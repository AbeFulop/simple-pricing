<template>
  <v-container>
    <v-row class="flex-nowrap">
      <v-col cols="4" class="door-styles">
        <v-row>
          <v-col cols="6">
            <h2 class="text-h4">Select Style</h2>
          </v-col>

          <v-col cols="6">
            <div class="multiplier-container ml-auto mr-5">
              <v-text-field
                v-model="multiplier"
                label="Multiplier"
                type="number"
                step=".01"
                dense
              ></v-text-field>
            </div>
          </v-col>
        </v-row>

        <div v-for="collection in collections" :key="collection.name">
          <h3 class="subtitle-1">{{ collection.name }}</h3>

          <v-item-group>
            <v-container>
              <v-row>
                <v-col
                  v-for="style in collection.styles"
                  :key="style.name"
                  class="flex-grow-0 pa-1"
                >
                  <v-item>
                    <v-card
                      class="d-flex align-center pa-2"
                      :class="activeDoorStyle === style.name ? 'elevation-5 active-style' : ''"
                      light
                      hover
                      outlined
                      @click="selectDoorStyle(style.name)"
                    >
                      <v-scroll-y-transition>
                        <div class="flex-grow-1">
                          <v-img
                            class="white--text align-end p"
                            width="50"
                            :src="style.image"
                          >
                        </v-img>
                          <div class="caption mt-2">
                            <div class="font-weight-bold">{{ style.style }}</div>
                            <div>{{ style.color }}</div>
                          </div>
                        </div>
                      </v-scroll-y-transition>
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
        </div>
      </v-col>

      <v-col col>
        <v-data-table
          :headers="headers"
          :items="rows"
          disable-pagination
          hide-default-footer
          class="elevation-2"
          disable-sort
          dense
        >
          <template v-slot:item="{ item, index }">
            <tr :class="{'sub-row': item.isSub}">
              <td>
                <v-text-field
                  v-model="item.qty"
                  label="Qty"
                  class="cell-input-qty"
                  type="number"
                  min="0"
                  single-line
                  solo
                  flat
                  dense
                ></v-text-field>
              </td>

              <td>{{ item.style }}</td>

              <td>{{ item.item }}</td>

              <td>
                <v-edit-dialog :return-value.sync="item.description">
                  {{ item.description }}
                  <template v-slot:input>
                    <v-text-field
                      v-model="item.description"
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </td>

              <td>
                <v-select
                  v-if="!item.isSub"
                  v-model="item.hinge"
                  :items="['Right', 'Left']"
                  class="cell-input-select"
                  dense
                  solo
                  flat
                >
                  <template v-slot:selection="{ item }">
                    <span>{{ item[0] }}</span>
                  </template>
                </v-select>
              </td>

              <td>
                <v-select
                  v-if="!item.isSub"
                  v-model="item.finish"
                  :items="['Right', 'Left']"
                  class="cell-input-select"
                  dense
                  solo
                  flat
                  multiple
                >
                  <template v-slot:selection="{ index, item, parent }">
                    <template v-if="index === 0">
                      <span v-if="parent.value.length === 1">{{ item[0] }}</span>

                      <span v-else>B</span>
                    </template>
                  </template>
                </v-select>
              </td>

              <td>{{ formatCurrency(item.unitPrice * multiplier) }}</td>

              <td>{{ +(item.qty && item.unitPrice) ? formatCurrency(item.qty * item.unitPrice * multiplier) : '' }}</td>

              <td class="actions-cell text-right">
                <v-icon
                  v-if="!item.isSub"
                  small
                  class="mr-2"
                  @click="addSub(index)"
                >mdi-wrench</v-icon>

                <v-icon
                  small
                  @click="deleteItem(index)"
                >mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>

        <v-dialog
          v-model="addSubDialog"
          max-width="500px"
        >
        <v-card>
          <v-card-title>Add Modification</v-card-title>

          <v-card-text>
            <v-row class="mx-5">
              <v-autocomplete
                v-model="selectedItem"
                :items="subNames"
                label="Modification"
                auto-select-first
                @change="addSubItem"
              ></v-autocomplete>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

              <v-btn
                color="primary"
                text
                @click="closeAddSub"
              >Close</v-btn>
          </v-card-actions>
        </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="secondary"
                text
                @click="closeDelete"
              >Cancel</v-btn>

              <v-btn
                color="primary"
                text
                @click="deleteItemConfirm"
              >OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar v-model="itemNotFoundSnackbar">
          Item not found in current door style

          <template v-slot:action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="itemNotFoundSnackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <v-snackbar v-model="subNoPrice">
          Price should be calculated manually

          <template v-slot:action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="subNoPrice = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <v-row class="item-list-container align-baseline mt-1">
          <v-col>
            <v-autocomplete
              v-model="selectedItem"
              :items="productNames"
              label="Item"
              auto-select-first
              :disabled="!activeDoorStyle"
              :menu-props="{ bottom: true, offsetY: true, maxHeight: '180px' }"
              @change="addItem"
            ></v-autocomplete>
          </v-col>
        </v-row>


        <v-row class="font-weight-bold">
          <v-col class="text-right">Sub Total: {{ formatCurrency(subTotal) }}</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./item-list.js"></script>

<style src="./item-list.scss" lang="scss" scoped></style>

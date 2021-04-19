<template>
  <v-container>
    <v-row>
      <v-col cols="4">
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

      <v-col cols="8">
        <v-data-table
          :headers="headers"
          :items="rows"
          disable-pagination
          hide-default-footer
          class="elevation-2"
        >
          <template v-slot:[`item.qty`]="{ item }">
            <v-text-field
              v-model="item.qty"
              label="Qty"
              class="cell-input-qty"
              single-line
              solo
              flat
              dense
            ></v-text-field>
          </template>

          <template v-slot:[`item.hinge`]="{ item }">
            <v-select
              v-model="item.hinge"
              :items="['Right', 'Left']"
              class="cell-input-select"
              dense
              solo
              flat
            ></v-select>
          </template>

          <template v-slot:[`item.finish`]="{ item }">
            <v-select
              v-model="item.finish"
              :items="['Right', 'Left']"
              class="cell-input-select"
              dense
              solo
              flat
              multiple
            ></v-select>
          </template>

          <template v-slot:[`item.unitPrice`]="{ item }">
            <span>{{ formatCurrency(item.unitPrice * multiplier) }}</span>
          </template>

          <template v-slot:[`item.totalPrice`]="{ item }">
            <span>{{ +(item.qty && item.unitPrice) ? formatCurrency(item.qty * item.unitPrice * multiplier) : '' }}</span>
          </template>

          <template v-slot:[`item.actions`]="{ index }">
            <v-icon
              small
              @click="deleteItem(index)"
            >mdi-delete</v-icon>
          </template>
        </v-data-table>

        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="healine">Are you sure you wnat to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="secondary"
                text
                @click="closeDelete"
              >Cancel</v-btn>

              <v-btn
                color="priamry"
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

        <v-row class="item-list-container align-baseline mt-1">
          <v-col>
            <v-autocomplete
              v-model="selectedItem"
              :items="productNames"
              label="Item"
              auto-select-first
              :disabled="!activeDoorStyle"
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

<script>
import data from '../data';

export default {
  data() {
    return {
      headers: [
        { text: 'Qty', value: 'qty' },
        { text: 'Style', value: 'style' },
        { text: 'Item', value: 'item' },
        { text: 'Description', value: 'description' },
        { text: 'Hinge', value: 'hinge' },
        { text: 'Finish', value: 'finish' },
        { text: 'Unit Price', value: 'unitPrice' },
        { text: 'Total Price', value: 'totalPrice' },
        { text: '', value: 'actions' },
      ],

      rows: [],

      allStyles: data.styles,

      allItems: data.items,

      activeDoorStyle: null,

      selectedItem: null,

      multiplier: 1,

      itemNotFoundSnackbar: false,

      deleteIndex: -1,
      dialogDelete: false,
    };
  },

  computed: {
    imperialStyles() {
      return this.allStyles.filter(s => s.series === 'Imperial');
    },

    prestigeStyles() {
      return this.allStyles.filter(s => s.series === 'Prestige');
    },

    basicStyles() {
      return this.allStyles.filter(s => s.series === 'Basic');
    },

    collections() {
      return [
        {
          name: 'Imperial',
          styles: this.imperialStyles
        },
        {
          name: 'Prestige',
          styles: this.prestigeStyles
        },
        {
          name: 'Basic',
          styles: this.basicStyles
        }
      ];
    },

    productNames() {
      return this.allItems.map(item => item.item);
    },

    subTotal() {
      let subTotal = 0;
      this.rows.forEach(item => {
        subTotal += item.qty * item.unitPrice * this.multiplier;
      });
      return subTotal;
    }
  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  methods: {
    addItem() {
      const itemName = this.selectedItem;

      if (!itemName) {
        return;
      }

      const item = this.allItems.find(p => p.item === itemName);

      if (item) {

        if (!item.pricing[this.activeDoorStyle]) {
          this.itemNotFoundSnackbar = true;

          setTimeout(() => this.itemNotFoundSnackbar = false, 6000);

          return;
        }

        this.rows.push({
          qty: 1,
          style: this.activeDoorStyle,
          item: item.item,
          description: item.description,
          hinge: null,
          finish: null,
          unitPrice: item.pricing[this.activeDoorStyle],
        });

        setTimeout(() => this.selectedItem = null, 0);

      }
    },

    deleteItem(index) {
      this.deleteIndex = index;
      this.dialogDelete = true;
    },

    deleteItemConfirm(index) {
      this.rows.splice(index, 1);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.deleteIndex = -1;
    },

    selectDoorStyle(style) {
      this.activeDoorStyle = style
    },

    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });

      return formatter.format(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-data-table ::v-deep .v-text-field__details {
  display: none;
}

.cell-input-qty {
  width: 55px;
}

.cell-input-select {
  width: 150px;
}

.active-style {
  border: 2px solid #00838f;
}

.multiplier-container {
  width: 100px;
}

.item-list-container {
  width: 350px;
}
</style>

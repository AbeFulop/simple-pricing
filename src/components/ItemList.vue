<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <h2 class="text-h4">Select Style</h2>

        <div v-for="collection in collections" :key="collection.name">
          <h3 class="subtitle-1">{{ collection.name }}</h3>

          <v-item-group>
            <v-container>
              <v-row>
                <v-col
                  v-for="style in collection.styles"
                  :key="style.name"
                  cols="4"
                >
                  <v-item>
                    <v-card
                      :color="activeDoorStyle === style.name ? 'primary lighten-4' : ''"
                      class="d-flex align-center"
                      light
                      height="100"
                      @click="selectDoorStyle(style.name)"
                    >
                      <v-scroll-y-transition>
                        <div
                          class="text-h5 flex-grow-1 text-center"
                        >
                          {{ style.description }}
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
        >
          <template v-slot:[`item.qty`]="{ item }">
            <v-edit-dialog :return-value.sync="item.qty">
              {{ item.qty }}
              <template v-slot:input>
                <v-text-field v-model="item.qty" label="Qty" single-line></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template v-slot:[`item.unitPrice`]="{ item }">
            <span>{{ formatCurrency(item.unitPrice) }}</span>
          </template>

          <template v-slot:[`item.totalPrice`]="{ item }">
            <span>{{ +(item.qty && item.unitPrice) ? formatCurrency(item.qty * item.unitPrice) : '' }}</span>
          </template>
        </v-data-table>

        <v-autocomplete
          v-model="selectedItem"
          :items="productNames"
          label="Item"
          auto-select-first
          :disabled="!activeDoorStyle"
          @change="addEmptyRow"
        ></v-autocomplete>

        <v-btn @click="addEmptyRow" :disabled="!activeDoorStyle">Add Row</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import data from '../data'

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
      ],

      rows: [],

      allStyles: data.styles,

      allItems: data.items,

      activeDoorStyle: null,

      selectedItem: null,
    }
  },

  computed: {
    imperialStyles() {
      return this.allStyles.filter(s => s.series === 'Imperial')
    },

    prestigeStyles() {
      return this.allStyles.filter(s => s.series === 'Prestige')
    },

    basicStyles() {
      return this.allStyles.filter(s => s.series === 'Basic')
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
          name: 'basic',
          styles: this.basicStyles
        }
      ]
      },

    productNames() {
      return this.allItems.map(item => item.item)
    }
  },

  methods: {
    addEmptyRow() {
      const itemName = this.selectedItem;

      if (!itemName) {
        return;
      }

      const item = this.allItems.find(p => p.item === itemName);

      if (item) {
        this.rows.push({
          qty: 1,
          style: this.activeDoorStyle,
          item: item.item,
          description: item.description,
          hinge: null,
          finish: null,
          unitPrice: item.pricing[this.activeDoorStyle], // TODO: calculate multipler
        })

        setTimeout(() => this.selectedItem = null, 0)

      }
    },

    selectDoorStyle(style) {
      this.activeDoorStyle = style
    },

    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      })

      return formatter.format(value)
    },
  }
}
</script>

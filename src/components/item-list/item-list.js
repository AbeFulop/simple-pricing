import data from '../../data';

export default {
  data() {
    return {
      headers: [
        { text: '', value: 'isSub' },
        { text: 'Qty', value: 'qty' },
        { text: 'Style', value: 'style' },
        { text: 'Item', value: 'item' },
        { text: 'Description', value: 'description', class: 'tiny-font', cellClass: 'tiny-font' },
        { text: 'Hinge', value: 'hinge', class: 'tiny-font', cellClass: 'tiny-font' },
        { text: 'Finish', value: 'finish', class: 'tiny-font', cellClass: 'tiny-font' },
        { text: 'Unit Price', value: 'unitPrice' },
        { text: 'Total Price', value: 'totalPrice' },
        { text: '', value: 'actions' },
      ],

      rows: [],

      allStyles: data.styles,

      allItems: data.items,

      allSubs: data.subs,

      activeDoorStyle: null,

      selectedItem: null,

      multiplier: 1,

      itemNotFoundSnackbar: false,

      subNoPrice: false,

      addSubDialog: false,

      activeItemIndex: -1,

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

    subNames() {
      return this.allSubs.map(sub => sub.item);
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
    },

    addSubDialog(val) {
      val || this.closeAddSub();
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

    addSubItem() {
      const itemName = this.selectedItem;

      if (!itemName) {
        return;
      }

      const item = this.allSubs.find(p => p.item === itemName);

      if (item) {
        if (!item.price) {
          this.subNoPrice = true;
          item.price = 999;
          setTimeout(() => this.subNoPrice = false, 6000);
        }

        this.rows.splice(this.activeItemIndex + 1, 0, {
          qty: 1,
          style: this.activeDoorStyle,
          item: item.item,
          description: item.description,
          hinge: null,
          finish: null,
          unitPrice: item.price,
          isSub: true,
        })

        setTimeout(() => {
          this.selectedItem = null;
          this.closeAddSub();
        }, 0);

      }
    },

    addSub(index) {
      this.addSubDialog = true;
      this.activeItemIndex = index;
    },

    closeAddSub() {
      this.addSubDialog = false;
      this.activeItemIndex = -1;
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

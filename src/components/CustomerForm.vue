<template>
  <v-form>
    <v-container>
      <v-row dense>
        <v-col cols="6" md="4" lg="2">
          <v-text-field dense label="Company Name"></v-text-field>
        </v-col>

        <v-col cols="6" md="4" lg="2">
          <v-text-field dense label="Shipping Address"></v-text-field>
        </v-col>

        <v-col cols="6" md="4" lg="2">
          <v-text-field dense label="Email"></v-text-field>
        </v-col>

        <v-col cols="6" md="4" lg="2">
          <v-text-field dense label="Phone"></v-text-field>
        </v-col>

        <v-col cols="6" md="4" lg="2">
          <v-text-field dense label="PO"></v-text-field>
        </v-col>

        <v-col cols="6" md="4" lg="2">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="computedDateFormatted"
                label="Ship Date"
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                @click:append="dateMenu = true"
                dense
              ></v-text-field>
            </template>

            <v-date-picker
              v-model="pickerDate"
              @input="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: (vm) => {
    return {
      pickerDate: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      dateMenu: false,
    };
  },

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.pickerDate);
    },
  },

  watch: {
    pickerDate(val) {
      this.dateFormatted = this.formatDate(val);
    },
  },

  methods: {
    formatDate(date) {
      if (!date) {
        return null;
      }

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },

    parseDate(date) {
      if (!date) {
        return null;
      }

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-form {
  width: 100%;
  margin: 12px auto;
  padding: 12px;
}
</style>

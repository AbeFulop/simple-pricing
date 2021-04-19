<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/cubitac-logo.svg"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>Cubitac Simple Pricinig</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://cubitac.com"
        target="_blank"
        text
      >
        <span class="mr-2">cubitac.com</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <CustomerForm />

      <ItemList />
    </v-main>

    <v-footer
      dark
      color="secondary"
      paddless
    >
      <v-container>
        <v-row>
          <v-col>
            <div>Cubitac Cabinetry</div>
            <div>4 Bell Drive</div>
            <div>Ridgefield, NJ 07657</div>
          </v-col>

          <v-spacer></v-spacer>

          <v-col class="text-right">
            <div>201.464.2000</div>
            <div><a href="https://cubitac.com" target="_blank">cubitac.com</a></div>
            <div><a href="mailto:orders@cubitac.com" target="_blank">orders@cubitac.com</a></div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import CustomerForm from './components/CustomerForm';
import ItemList from './components/ItemList';

export default {
  name: 'App',

  components: {
    CustomerForm,
    ItemList
  },

  data: () => ({
    //
  }),
};
</script>

<style scoped lang="scss">

.v-footer.theme--dark {
  a {
    color: #fff;
  }
}

</style>

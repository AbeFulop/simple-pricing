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

      <v-btn dark icon @click="print">
        <v-icon class="d-print-none">mdi-printer</v-icon>
      </v-btn>

      <v-btn
        href="https://cubitac.com"
        target="_blank"
        text
      >
        <span class="mr-2">cubitac.com</span>
        <v-icon class="d-print-none">mdi-open-in-new</v-icon>
      </v-btn>

      <v-btn v-if="isLoggedIn" class="d-print-none" text @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <div v-if="isLoggedIn">
        <CustomerForm />

        <ItemList />
      </div>

      <Login v-else />
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
import ItemList from './components/item-list/ItemList';
import Login from './components/Login';

export default {
  name: 'App',

  components: {
    CustomerForm,
    ItemList,
    Login,
  },

  data: () => ({
    //
  }),

  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('auth-user');
    }
  },

  methods: {
    print() {
      window.print();
    },

    logout() {
      localStorage.removeItem('auth-user');
      document.location.reload();
    },
  },
};
</script>

<style scoped lang="scss">

.v-footer.theme--dark {
  a {
    color: #fff;
  }
}

@media print {

  .v-app-bar--fixed {
    position: relative !important;
    flex-grow: 0;

    &.primary {
      background-color: #fff !important;

      color: #00838f;
    }

    + .v-main {
      padding-top: 0 !important;
    }
  }
}

</style>

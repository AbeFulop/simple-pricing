<template>
  <v-form class="d-flex fill-height align-center justify-center grey lighten-4" @submit="login">
    <v-card width="400">
      <v-card-title>Login</v-card-title>

      <v-card-text>
        <v-text-field label="Username" v-model="username" />
        <v-text-field label="Password" v-model="password" type="password" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn type="submit" block outlined color="primary">Login</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="loginErrorSnackbar" color="error" text>
      Incorrect Login

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="loginErrorSnackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-form>
</template>

<script>
export default {

  data() {
    return {
      username: '',
      password: '',

      loginErrorSnackbar: false,
    }
  },

  methods: {
    login(event) {
      event.preventDefault();

      const logins = [
        {
          username: 'demo',
          displayName: 'Demo',
          password: 'demo'
        },
        {
          username: 'who',
          displayName: 'Weisman Home Outlets',
          password: 'weismanho'
        },
        {
          username: 'fina',
          displayName: 'Fina Cabinets',
          password: 'FinaCabinets'
        },
        {
          username: 'cubitac',
          displayName: 'Cubitac',
          password: 'cubitac2000'
        },
        {
          username: 'creative',
          displayName: 'Createive Woodwork',
          password: 'creative5151'
        },
        {
          username: 'highline',
          displayName: 'Highline Cabinetry',
          password: 'highline2770'
        },
        {
          username: 'arkitchens',
          displayName: 'A&R Kitchens',
          password: 'arkitchens9500'
        },
        {
          username: 'nagad',
          displayName: 'Nagad Cabinets',
          password: 'nagad7200'
        },
        {
          username: 'parkkitchen',
          displayName: 'Park Kitchen and Stone',
          password: 'parkkitchen8080'
        },
        {
          username: 'kitchenexpo',
          displayName: 'Kitchen Expo',
          password: 'expo9595'
        },
        {
          username: 'bphomedecor',
          displayName: 'BP Home Decor',
          password: 'homedecor3200'
        },
        {
          username: 'dnacabinets',
          displayName: 'DNA Cabinets',
          password: 'dnac1524'
        },
        {
          username: 'lazerglick',
          displayName: 'Lazer Glick',
          password: 'lazerglick3502'
        },
        {
          username: 'eaststone',
          displayName: 'East Stone Kitchen & Bath',
          password: 'eaststone0097'
        },
        {
          username: 'abest',
          displayName: 'A Best Cabinets',
          password: 'abest8686'
        },
        {
          username: 'KitchenConceptsUsa',
          displayName: 'Kitchen Concepts USA',
          password: 'KitchenConceptsUsa2920'
        },
        {
          username: 'RobertSmith',
          displayName: 'Robert Smith Internal Account ',
          password: 'rsmith3511'
        },
        {
          username:"Tskitchens",
          displayName:"Tri State Kitchens",
          password:"tskitchens2245"
        },
        {
          username:"Instyle",
          displayName:"In Style Kitchen",
          password:"instyle7800"
        },
        {
          username:"Kitchenlion",
          displayName:"Kitchen Lion",
          password:"kitchenlion2900"
        },
        {
          username:"Kentco",
          displayName:"Kentco Kitchens",
          password:"kentco606"
        },
        {
          username:"Rashi",
          displayName:"Rashi Janitorials",
          password:"rashi7513"
        },
        {
          username:"Global",
          displayName:"Global Cabinets",
          password:"global4141"
        },
        {
        username:"Nova",
        displayName:"Nova Kitchen & Design",
        password:"novakitchen9443"
      }
     ];

      const u = logins.find(user => user.username === this.username?.toLowerCase());

      if (u && this.username?.toLowerCase() === u.username && this.password === u.password) {
        const { username, displayName } = u;
        localStorage.setItem('auth-user', JSON.stringify({username, displayName}));
        document.location.reload();
      } else {
        this.loginErrorSnackbar = true;
      }
    }
  }
}
</script>

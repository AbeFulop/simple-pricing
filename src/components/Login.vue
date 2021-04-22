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
          displayName: 'Weisman HO',
          password: 'weismanho'
        },
        {
          username: 'cubitac',
          displayName: 'Cubitac',
          password: 'cubitac2000'
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

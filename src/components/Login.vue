<template>
  <div>
    <v-content>
      <v-snackbar v-model="errorFlag" color="error" timeout="6000" top>{{ error }}</v-snackbar>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col lg="6" md="8" sm="12">
            <v-hover v-slot="{ hover }">
              <v-card :elevation="hover ? 6 : 2">
                <v-toolbar color="blue" dark flat>
                  <v-toolbar-title>Login</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pa-4">
                  <v-container>
                    <v-row justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="input.email"
                          label="Email address"
                          prepend-icon="alternate_email"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="input.password"
                          label="Password"
                          type="password"
                          prepend-icon="lock"
                          @keyup.enter.native="login()"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-btn @click="go('registerPage')" :disabled="submitting" class="ma-1">Sign Up</v-btn>
                      <v-btn @click="go('searchPage')" :disabled="submitting" class="ma-1">Continue as guest</v-btn>
                      <v-btn color="primary" @click="login()" :disabled="submitting" class="ma-1">Login</v-btn>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import * as Requests from "../utils/requests";

export default {
  data() {
    return {
      errorFlag: false,
      error: "",
      input: {
        email: "",
        password: ""
      },
      submitting: false
    };
  },
  methods: {
    login: async function() {
      if (this.submitting) {
        return;
      }
      this.submitting = true;

      let result = await Requests.login(this.input.email, this.input.password);
      if (result === true) {
        this.$root.$emit("authentication-change");
        this.$router.push({ name: "yourProfile" });
      } else {
        this.errorFlag = true;
        this.error = "Invalid email/password";
      }
      this.submitting = false;
    },
    showError: function(message) {
      this.errorFlag = true;
      this.error = message;
    },
    go: function(pageName) {
      this.$router.push({name: pageName});
    }
  },
  mounted: async function() {
    if (localStorage.getItem('userId') != null) {
      this.go('yourProfile');
    }
  }
};
</script>
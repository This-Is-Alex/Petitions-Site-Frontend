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
                  <v-toolbar-title>Register</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pa-4">
                  <v-container>
                    <v-row justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="input.name"
                          :rules="[rules.required]"
                          label="Name"
                          prepend-icon="person"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="input.email"
                          :rules="[rules.required, rules.email]"
                          label="Email address"
                          prepend-icon="alternate_email"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="input.password"
                          :rules="[rules.required]"
                          label="Password"
                          type="password"
                          prepend-icon="lock"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="input.city"
                          label="City (optional)"
                          prepend-icon="location_city"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model="input.country"
                          label="Country (optional)"
                          prepend-icon="public"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col cols="12" sm="8">
                        <v-file-input
                          accept="image/png, image/jpeg, image/gif"
                          placeholder="Pick a profile photo"
                          prepend-icon="camera_alt"
                          label="Profile photo (optional)"
                          ref="filePicker"
                          @change="updatedProfilePhoto($event)"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-btn @click="go('loginPage')" class="ma-1">Have an account? Login</v-btn>
                      <v-btn
                        color="primary"
                        class="ma-1"
                        @click="register()"
                        :disabled="!(allValid || !submitting)"
                      >Register</v-btn>
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
      rules: {
        required: value => !!value || "Required",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid email address";
        }
      },
      input: {
        name: "",
        email: "",
        password: "",
        city: "",
        country: ""
      },
      submitting: false,
      allValid: false,
      file: ""
    };
  },
  methods: {
    register: async function() {
      this.submitting = true;
      let validation = this.validateAll();
      if (validation !== true) {
        this.showError(validation);
        this.submitting = false;
        return;
      }

      let request = {
        name: this.input.name,
        email: this.input.email,
        password: this.input.password
      };
      if (this.input.country.length > 0) {
        request["country"] = this.input.country;
        //assume city can only be present if country is
        if (this.input.city.length > 0) {
          request["city"] = this.input.city;
        }
      }
      let userId = await Requests.register(request);
      if (typeof userId === "string") {
        this.submitting = false;
        this.showError(userId);
        return;
      }
      if (!(await Requests.login(this.input.email, this.input.password))) {
        this.showError("An unknown error occured");
        this.submitting = false;
        return;
      }

      if (typeof this.file !== "string") {
        await Requests.uploadProfilePhoto(this.file);
      }
      this.$root.$emit("authentication-change");
      this.$router.push({name: "yourProfile"});
    },
    showError: function(message) {
      this.errorFlag = true;
      this.error = message;
    },
    validateAll: function() {
      if (this.input.name.length == 0) {
        return "Name cannot be empty";
      }
      if (this.input.email.length == 0) {
        return "Email address cannot be empty";
      }
      if (this.rules.email(this.input.email) !== true) {
        return "Invalid email address format";
      }
      if (this.input.password.length == 0) {
        return "Password cannot be empty";
      }
      if (this.input.city.length > 0 && this.input.country.length == 0) {
        return "Country must be specified if City is specified";
      }
      return true;
    },
    updatedProfilePhoto(file) {
      this.file = file;
    },
    go: function(pageName) {
      this.$router.push({name: pageName});
    }
  },
  watch: {
    input: {
      handler: function() {
        this.allValid = this.validateAll() === true;
      },
      deep: true
    }
  }
};
</script>
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
                  <v-toolbar-title>{{editing ? "Edit Petition" : "Create Petition"}}</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pa-4">
                  <v-container>
                    <v-row justify="center">
                      <v-col cols="12" sm="8">
                        <v-text-field v-model="input.title" label="Name" :rules="[rules.required]"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col cols="12" sm="8">
                        <v-textarea
                          v-model="input.description"
                          label="Description"
                          :rules="[rules.required]"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-col cols="12" sm="8">
                        <v-file-input
                          accept="image/png, image/jpeg, image/gif"
                          placeholder="Pick a hero image"
                          prepend-icon="camera_alt"
                          label="Hero image"
                          ref="filePicker"
                          @change="updatedPhoto($event)"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-btn
                        color="primary"
                        @click="register()"
                        :disabled="!(!submitting || allValid)"
                      >{{editing ? "Save changes" : "Create Petition"}}</v-btn>
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
      editing: false,
      categories: [],
      input: {
        title: "",
        description: "",
        category: "",
        closingDate: ""
      },
      rules: {
        required: value => !!value || "Required"
      },
      submitting: false,
      allValid: false,
      file: ""
    };
  },
  methods: {
    showError: function(message) {
      this.errorFlag = true;
      this.error = message;
    },
    updatedPhoto(file) {
      this.file = file;
    },
    validateAll: function() {
      if (this.input.title.length == 0) {
        return false;
      }
      if (this.input.description.length == 0) {
        return false;
      }
      if (this.input.category.length == 0) {
        return false;
      }
      return true;
    }
  },
  mounted: async function() {
    if (!localStorage.getItem("userId")) {
      this.$router.push({ name: "loginPage" });
      return;
    }
    if (this.$route.params.petitionId) {
      let petitionId = this.$route.params.petitionId;
      this.editing = true;
      let petitionData = await Requests.getPetitionInfo(petitionId);
      if (petitionData.petitionId == petitionId) {
        if (petitionData.authorId != localStorage.getItem("userId")) {
          this.showError("You cannot edit somebody else's petition");
          this.editing = false;
          return;
        }
        this.input.title = petitionData.title;
        this.input.description = petitionData.description;
        this.input.category = petitionData.category;
        if (this.input.closingDate) {
          this.input.closingDate = petitionData.closingDate;
        }
      } else {
        this.showError("Somehow the backend returned the wrong petition");
      }
    }
    this.categories = await Requests.getCategories();
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
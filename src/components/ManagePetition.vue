<template>
  <div>
    <v-content>
      <v-snackbar v-model="errorFlag" color="error" timeout="6000" top>{{ error }}</v-snackbar>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col lg="6" md="10" sm="12">
            <v-hover v-slot="{ hover }">
              <v-card :elevation="hover ? 6 : 2">
                <v-toolbar color="blue" dark flat>
                  <v-toolbar-title>{{editing ? "Edit Petition" : "Create Petition"}}</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pa-4">
                  <v-container>
                    <v-row justify="center">
                      <v-col sm="12" md="11" lg="10">
                        <v-row justify="center">
                          <v-col>
                            <v-text-field
                              v-model="input.title"
                              label="Name"
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-col>
                            <v-textarea
                              v-model="input.description"
                              label="Description"
                              :rules="[rules.required]"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-col>
                            <v-select
                              :items="categories"
                              item-text="name"
                              label="Category"
                              append-icon="expand_more"
                              v-model="input.category"
                              outlined
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-col>
                            <div class="pa-8">
                              <div
                                v-if="input.petitionCloses && editing"
                              >You can't change an expiring petition to no longer expire after creating it</div>
                              <v-switch
                                v-model="input.petitionCloses"
                                class="ma-2"
                                label="Petition has a closing date"
                                :disabled="input.petitionCloses && editing"
                              ></v-switch>
                            </div>
                          </v-col>
                          <v-col>
                            <v-date-picker
                              :disabled="!input.petitionCloses"
                              v-model="input.closingDate"
                              :allowed-dates="allowedDates"
                              class="mt-4"
                              next-icon="chevron_right"
                              prev-icon="chevron_left"
                            ></v-date-picker>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-col>
                            <v-file-input
                              accept="image/png, image/jpeg, image/gif"
                              placeholder="Pick a hero image (leave blank for no image or to keep current image)"
                              prepend-icon="camera_alt"
                              label="Hero image"
                              ref="filePicker"
                              @change="updatedPhoto($event)"
                            ></v-file-input>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-btn @click="cancel()" v-if="editing" class="mr-2">Cancel</v-btn>
                          <v-btn
                            color="primary"
                            @click="createPetition()"
                            :disabled="!allValid || submitting"
                          >{{editing ? "Save changes" : "Create Petition"}}</v-btn>
                        </v-row>
                      </v-col>
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
        closingDate: "",
        petitionCloses: false
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
      if (this.input.petitionCloses) {
        if (
          this.input.closingDate.length == 0 ||
          new Date(this.input.closingDate) < new Date()
        ) {
          return false;
        }
      }
      return true;
    },
    allowedDates: function(val) {
      return new Date(val) > new Date();
    },
    createPetition: async function() {
      this.submitting = true;
      let requestBody = {};
      requestBody["title"] = this.input.title;
      requestBody["description"] = this.input.description;

      let chosenCategory = null;
      for (let type in this.categories) {
        if (this.categories[type].name == this.input.category) {
          chosenCategory = this.categories[type].categoryId;
          break;
        }
      }
      requestBody["categoryId"] = chosenCategory;
      if (this.input.petitionCloses) {
        let date = new Date(this.input.closingDate);
        let dateStr = "";
        dateStr += date.getFullYear();
        dateStr += "-";
        if (date.getMonth() < 9) dateStr += "0";
        dateStr += date.getMonth() + 1;
        dateStr += "-";
        if (date.getDate() < 10) dateStr += "0";
        dateStr += date.getDate();
        dateStr += " 00:00:00.000";
        requestBody["closingDate"] = dateStr;
      }

      try {
        let petitionId = this.petitionId;
        if (this.editing) {
          petitionId = await Requests.updatePetition(
            requestBody,
            this.$route.params.petitionId
          );
        } else {
          petitionId = await Requests.createPetition(requestBody);
        }

        if (petitionId == "Error") {
          this.submitting = false;
          return;
        }

        if (typeof this.file !== "string") {
          await Requests.uploadPetitionPhoto(petitionId, this.file);
        }

        if (!this.editing) {
          await Requests.signPetition(petitionId);
        }

        this.$router.push("/petition/" + petitionId);
      } catch (err) {
        console.error(err);
      }
      this.submitting = false;
    },
    cancel: function() {
      this.$router.push("/petition/"+ this.petitionId);
    }
  },
  mounted: async function() {
    if (!localStorage.getItem("userId")) {
      this.$router.push({ name: "loginPage" });
      return;
    }

    if (this.$route.params.petitionId) {
      this.petitionId = this.$route.params.petitionId;
      this.editing = true;
      let petitionData = await Requests.getPetitionInfo(this.petitionId);
      if (petitionData.petitionId == this.petitionId) {
        if (petitionData.authorId != localStorage.getItem("userId")) {
          this.showError("You cannot edit somebody else's petition");
          this.editing = false;
          return;
        }
        this.input.title = petitionData.title;
        this.input.description = petitionData.description;
        this.input.category = petitionData.category;
        if (petitionData.closingDate) {
          if (new Date(petitionData.closingDate) < new Date()) {
            this.showError(
              "You cannot edit a petition that has already closed"
            );
            this.editing = false;
            return;
          }
          let date = new Date(petitionData.closingDate);
          let dateStr = "";
          dateStr += date.getFullYear();
          dateStr += "-";
          if (date.getMonth() < 9) dateStr += "0";
          dateStr += date.getMonth() + 1;
          dateStr += "-";
          if (date.getDate() < 10) dateStr += "0";
          dateStr += date.getDate();
          this.input.closingDate = dateStr;
          this.input.petitionCloses = true;
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
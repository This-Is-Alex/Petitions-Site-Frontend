<template>
  <div>
    <v-snackbar v-model="errorFlag" color="error" timeout="6000" top>{{ error }}</v-snackbar>
    <v-content>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col md="8" sm="12">
            <v-card>
              <v-toolbar color="blue" dark flat>
                <v-toolbar-title>Your Profile</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-chip class="ml-2" light @click="editProfile()">
                  <v-icon class="mr-1">edit</v-icon>Edit
                </v-chip>
              </v-toolbar>
              <v-card-text>
                <div v-if="!loading">
                  <v-container>
                    <v-row justify="center">
                      <v-col>
                        <v-avatar size="164">
                          <v-img
                            :src="profilePhotoUrl"
                            :lazy-src="lazyPhoto"
                            @error="noProfilePhoto()"
                          />
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <h2>{{this.userData.name}}</h2>
                        <br />
                        <div
                          v-if="userData.city || userData.country"
                        >From {{userData.city}}{{userData.city && userData.country ? ', ' : ''}} {{userData.country}}</div>
                        <div v-else>
                          <em>location unspecified</em>
                        </div>
                        <br />
                        {{userData.email}}
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <DisplayPetition
            :petition="petition"
            v-for="petition in displayPetitions"
            v-bind:key="petition"
          ></DisplayPetition>

          <v-col cols="7" v-if="loading">
            <v-skeleton-loader type="card" class="mx-auto elevation-2"></v-skeleton-loader>
          </v-col>
          <v-col cols="7" v-else-if="displayPetitions.length == 0">
            <center>
              You have no petitions, would you like to
              <router-link to="/petition/create">create one?</router-link>
            </center>
          </v-col>
          <v-col cols="7" v-else class="text-center">
            <center
              v-if="pageNum == Math.ceil(petitions.length / 10)"
            >You have reached the end of your petitions</center>
            <center
              v-else
            >Viewing petitions {{(pageNum-1)*10+1}} - {{pageNum*10}} of {{petitions.length}}</center>
            <br />
            <v-pagination
              v-model="pageNum"
              :length="Math.ceil(petitions.length / 10)"
              total-visible="7"
              prev-icon="navigate_before"
              next-icon="navigate_next"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import * as Requests from "../utils/requests";
import DisplayPetition from "./DisplayPetition.vue";

export default {
  components: { DisplayPetition },
  data() {
    return {
      error: "",
      errorFlag: false,
      petitions: [],
      userData: {},
      displayPetitions: [],
      loading: true,
      pageNum: 1,
      profilePhotoUrl: "",
      lazyPhoto:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iZ3JheSIgd2lkdGg9IjE4cHgiIGhlaWdodD0iMThweCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTQuMmMtMi41IDAtNC43MS0xLjI4LTYtMy4yMi4wMy0xLjk5IDQtMy4wOCA2LTMuMDggMS45OSAwIDUuOTcgMS4wOSA2IDMuMDgtMS4yOSAxLjk0LTMuNSAzLjIyLTYgMy4yMnoiLz48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+"
    };
  },
  mounted: async function() {
    this.profilePhotoUrl = Requests.getUserPhotoUrl(
      localStorage.getItem("userId")
    )+"?rand="+Math.random();
    this.getUser();
    this.getPetitions();
    this.updatePagination();
    this.loading = false;
  },
  watch: {
    pageNum: function() {
      this.updatePagination(this.pageNum);
    }
  },
  methods: {
    getPetitions: async function() {
      this.loading = true;
      let userId = localStorage.getItem("userId");
      if (userId == null) {
        this.$router.push("/login");
        return;
      }
      while (this.petitions.length > 0) {
        this.petitions.pop();
      }
      console.log("This user is " + userId);
      let params = { authorId: userId };

      this.petitions = await Requests.getPetitions(params);
      if (typeof this.petitions === "string") {
        this.error = "Failed to get petitions";
        this.errorFlag = true;
      } else {
        this.updatePagination();
      }
      for (let petition in this.petitions) {
        this.petitions[petition]["authorId"] = userId;
      }
      this.loading = false;
    },
    getUser: async function() {
      let data = await Requests.getUserInfo(localStorage.getItem("userId"));
      this.userData = data;
    },
    updatePagination: function(pageNum = 0) {
      if (pageNum <= 0) {
        pageNum = 1;
      }
      let slice = this.petitions.slice(
        (pageNum - 1) * 10,
        (pageNum - 1) * 10 + 10
      );

      this.displayPetitions = slice;
    },
    noProfilePhoto() {
      this.profilePhotoUrl = this.lazyPhoto;
    },
    editProfile() {
      this.$router.push({name: "editProfile"});
    }
  }
};
</script>
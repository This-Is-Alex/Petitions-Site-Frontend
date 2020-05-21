<template>
  <div>
    <v-content>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col lg="6" md="8" sm="12">
            <v-hover v-slot="{ hover }">
              <v-card :elevation="hover ? 6 : 2">
                <v-toolbar color="blue" dark flat>
                  <v-toolbar-title>{{name.length > 0 ? 'Welcome back, '+name : 'Welcome back!'}}</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pa-4" style="background-color: #f5f5f5;">
                    What would you like to do today?<br />
                  <v-row align="center" justify="center">
                    <v-btn @click="go('makePetitionPage')" color="blue" class="mr-2" height="100">Create a petition</v-btn>
                    <v-btn @click="go('searchPage')" class="mr-2" height="100">Search petitions</v-btn>
                  </v-row>
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
      name: ""
    };
  },
  mounted: async function() {
    let userId = localStorage.getItem("userId");
    if (userId === null || userId === undefined) {
      this.$router.push({ name: "loginPage" });
      return;
    }
    let userInfo = await Requests.getUserInfo(userId);
    this.name = userInfo.name;
  },
  methods: {
    go: function(page) {
      this.$router.push({ name: page });
    }
  }
};
</script>
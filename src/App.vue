<template>
  <div id="app">
    <v-app>
      <v-app-bar color="primary" dark app>
        <v-toolbar-title>Petition365</v-toolbar-title>
        <v-spacer></v-spacer>
        <div>{{isLoggedIn ? currentName : "Guest"}}</div>
        <div>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                <v-avatar size="32">
                  <v-icon x-large v-if="!isLoggedIn">account_circle</v-icon>
                  <v-img
                    :src="profilePhotoUrl"
                    :lazy-src="lazyPhoto"
                    @error="noProfilePhoto()"
                    v-else
                  />
                </v-avatar>
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-if="!isLoggedIn" @click="go('loginPage')">
                <v-list-item-title>Sign In</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="!isLoggedIn" @click="go('registerPage')">
                <v-list-item-title>Sign Up</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="isLoggedIn" @click="logout()">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
      <v-content>
        <transition name="page-transition">
          <router-view v-if="!isTransitioning"></router-view>
        </transition>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import * as Requests from "./utils/requests";

export default {
  data() {
    return {
      isTransitioning: false,
      isLoggedIn: false,
      currentName: "Logging in",
      profilePhotoUrl: "",
      lazyPhoto:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDNjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMtMy0xLjM0LTMtMyAxLjM0LTMgMy0zem0wIDE0LjJjLTIuNSAwLTQuNzEtMS4yOC02LTMuMjIuMDMtMS45OSA0LTMuMDggNi0zLjA4IDEuOTkgMCA1Ljk3IDEuMDkgNiAzLjA4LTEuMjkgMS45NC0zLjUgMy4yMi02IDMuMjJ6Ii8+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg=="
    };
  },
  mounted: function() {
    this.$router.beforeEach((from, to, next) => {
      this.isTransitioning = true;
      next();
    });
    this.$root.$on("authentication-change", () => {
      this.updateAuth();
    });
    this.updateAuth();
  },
  watch: {
    $route() {
      this.isTransitioning = false;
    }
  },
  methods: {
    go: function(page) {
      this.$router.push({ name: page });
    },
    async updateAuth() {
      let userId = localStorage.getItem("userId");
      if (userId === undefined || userId === null) {
        this.isLoggedIn = false;
      } else {
        this.profilePhotoUrl = Requests.getUserPhotoUrl(userId);
        this.isLoggedIn = true;
        let profile = await Requests.getUserInfo(userId);
        if (profile.name) {
          this.currentName = profile.name;
        }
      }
    },
    noProfilePhoto() {
      this.profilePhotoUrl = this.lazyPhoto;
    },
    async logout() {
      await Requests.logout();
      this.updateAuth();
      this.$router.push({ name: "loginPage" });
    }
  }
};
</script>
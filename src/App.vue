<template>
  <div id="app">
    <v-app>
      <v-app-bar color="primary" dark app>
        <v-toolbar-title>Petition365</v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="isLoggedIn">
          Logged in as {{currentName}} <v-btn @click="logoutButtonClicked" outlined>Logout</v-btn>
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
export default {
  data() {
    return {
      isTransitioning: false,
      isLoggedIn: false
    };
  },
  mounted: function() {
    this.$router.beforeEach((from, to, next) => {
        this.isTransitioning = true;
        next();
    });
  },
  watch: {
      $route() {
        this.isTransitioning = false;
      }
    }
};
</script>
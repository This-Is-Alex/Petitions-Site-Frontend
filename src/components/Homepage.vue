<template>
  <div>
    <v-content>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col md="7" sm="12">
            <v-hover v-slot="{ hover }">
              <v-card :elevation="hover ? 6 : 2">
                <v-toolbar color="blue" dark flat>
                  <v-toolbar-title>Welcome</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pa-4">
                  Hello!
                  <br />If you're logged in then wait a second while we work out who you are, otherwise you can
                  <router-link to="/register">Sign Up</router-link>or
                  <router-link to="/login">Login</router-link>
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
export default {
  mounted: function() {
    let userId = localStorage.getItem("userId");
    if (userId !== null && userId !== undefined) {
      this.$router.push({ name: "yourProfile" });
    } else {
      this.$router.push({ name: "loginPage" });
    }
  }
};
</script>
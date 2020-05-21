<template>
  <div>
    <v-content>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col lg="6" md="8" sm="12">
            <v-hover v-slot="{ hover }" v-bind:petitionData="petitionData">
              <v-card
                :elevation="hover ? 6 : 2"
                active-class
                class="petition-box"
                :style="'z-index: '+(expanded ? 5 : 0)"
              >
                <v-toolbar
                  color="blue"
                  dark
                  flat
                >
                  <v-toolbar-title>Register</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pa-4">Hey hey</v-card-text>
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
  data() {
    return {};
  },
  methods: {}
};
</script>
<template>
  <div>
    <v-snackbar v-model="errorFlag" color="error" timeout=6000 top>{{ error }}</v-snackbar>
    <v-content>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <DisplayPetition :petition="petition" v-for="petition in petitions" v-bind:key="petition"></DisplayPetition>
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
      petitions: []
    };
  },
  mounted: function() {
    this.getPetition();
  },
  methods: {
    getPetition: async function() {
      this.petitions = [await Requests.getPetitionInfo(this.$route.params.petitionId)];
      if (typeof this.petitions === "string") {
        this.error = "Failed to get petitions";
        this.errorFlag = true;
      }
    }
  }
};
</script>
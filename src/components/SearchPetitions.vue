<template>
  <div>
    <v-snackbar v-model="errorFlag" color="error" timeout="6000" top>{{ error }}</v-snackbar>
    <v-content>
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col md="8" sm="12">
            <v-card>
              <v-toolbar color="blue" dark flat>
                <v-toolbar-title>Search petitions</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-container fill-height>
                  <v-row justify="center">
                    <v-col cols="8">
                      <v-text-field
                        outlined
                        v-model="searchQuery"
                        append-icon="search"
                        @keyup.enter.native="getPetitions()"
                      ></v-text-field>
                      <v-select
                        :items="sortByMap"
                        label="Sort By"
                        append-icon="keyboard_arrow_down"
                        item-text="name"
                        item-value="name"
                        outlined
                        v-model="sortBy"
                      ></v-select>
                      <v-select
                        :items="categories"
                        label="Filter by Category"
                        append-icon="keyboard_arrow_down"
                        item-text="name"
                        item-value="name"
                        outlined
                        v-model="category"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-chip
                      @click:close="searchQuery = ''"
                      v-if="searchQuery.length > 0"
                      close
                      class="mr-1"
                      close-icon="clear"
                    >Name: {{searchQuery}}</v-chip>
                    <v-chip
                      @click:close="sortBy = ''"
                      v-if="sortBy.length > 0"
                      close
                      class="mr-1"
                      close-icon="clear"
                    >Sort by: {{sortBy}}</v-chip>
                    <v-chip
                      @click:close="category = ''"
                      v-if="category.length > 0"
                      close
                      class="mr-1"
                      close-icon="clear"
                    >Category: {{category}}</v-chip>
                    <v-chip color="primary" @click="getPetitions()">Search</v-chip>
                  </v-row>
                </v-container>
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
            <center>No results</center>
          </v-col>
          <v-col cols="7" v-else class="text-center">
            <center v-if="pageNum == Math.ceil(petitions.length / 10)">You have reached the end of the results</center>
            <center v-else>Viewing petitions {{(pageNum-1)*10+1}} - {{pageNum*10}} of {{petitions.length}}</center>
            <br>
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

const sortingTypes = [
  { name: "Alphabetic (A first)", value: "ALPHABETICAL_ASC" },
  { name: "Alphabetic (Z first)", value: "ALPHABETICAL_DESC" },
  { name: "Most signatures first", value: "SIGNATURES_DESC" },
  { name: "Least signatures first", value: "SIGNATURES_ASC" }
];

export default {
  components: { DisplayPetition },
  data() {
    return {
      error: "",
      errorFlag: false,
      petitions: [],
      displayPetitions: [],
      loading: true,
      searchQuery: "",
      sortBy: "",
      category: "",
      categoryId: null,
      categories: [],
      sortByMap: sortingTypes,
      pageNum: 1
    };
  },
  mounted: async function() {
    this.categories = await Requests.getCategories();
    this.petitions = await Requests.getPetitions({ count: 10 });
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
      while (this.petitions.length > 0) {
        this.petitions.pop();
      }
      let params = {};

      if (this.searchQuery.length > 0) {
        params["q"] = this.searchQuery;
      }

      if (this.sortBy.length > 0) {
        let sortMethod = null;
        for (let type in sortingTypes) {
          if (sortingTypes[type].name == this.sortBy) {
            sortMethod = sortingTypes[type].value;
            break;
          }
        }
        params["sortBy"] = sortMethod;
      }

      if (this.category.length > 0) {
        let filterCategory = null;
        for (let type in this.categories) {
          if (this.categories[type].name == this.category) {
            filterCategory = this.categories[type].categoryId;
            break;
          }
        }
        params["categoryId"] = filterCategory;
      }

      this.petitions = await Requests.getPetitions(params);
      if (typeof this.petitions === "string") {
        this.error = "Failed to get petitions";
        this.errorFlag = true;
      } else {
        this.updatePagination();
      }
      this.loading = false;
    },
    updatePagination: function(pageNum = 0) {
      if (pageNum <= 0) {
        pageNum = 1;
      }
      let slice = this.petitions.slice((pageNum-1) * 10, (pageNum-1) * 10 + 10);

      this.displayPetitions = slice;
    }
  }
};
</script>
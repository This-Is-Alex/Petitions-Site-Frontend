<template>
  <v-col :md="this.expanded ? 10 : 7" sm="12">
    <v-overlay z-index="4" :value="expanded" v-bind:expanded="this.expanded"></v-overlay>
    <v-hover v-slot="{ hover }" v-bind:petitionData="petitionData">
      <v-card
        :elevation="hover ? 6 : 2"
        active-class
        class="petition-box"
        :style="'z-index: '+(expanded ? 5 : 0)"
      >
        <v-toolbar color="blue" dark flat :src="photoUrl" class="alexs-toolbar" height="100">
          <v-toolbar-title>{{petitionData.title}}</v-toolbar-title>
          <v-spacer />
          <div style="text-align: right;">
            <v-chip class="ml-2" color="white" outlined>{{petitionData.category}}</v-chip>
            <div v-if="!expanded" class="ml-4">
              {{petitionData.authorName}}
              <v-icon class="ml-2">account_circle</v-icon>
            </div>
            <div v-if="!expanded" class="ml-4">
              {{petitionData.signatureCount}} {{petitionData.signatureCount == 1 ? 'signature' : 'signatures'}}
              <v-icon class="ml-2">edit</v-icon>
            </div>
          </div>
        </v-toolbar>
        <v-card-text class="pl-0 pr-0 pt-0">
          <v-expand-transition
            v-bind:expanded="expanded"
            v-bind:extendedPetition="extendedPetition"
            v-bind:photoUrl="photoUrl"
            v-bind:authorPhotoUrl="authorPhotoUrl"
          >
            <v-card v-show="expanded" color="#f5f5f5" tile class="elevation-0">
              <v-sheet color="#303030" tile>
                <v-img
                  :src="photoUrl"
                  :lazy-src="lazyPhoto"
                  min-height="150"
                  max-height="400"
                  contain
                  @error="imageFail('petition')"
                />
              </v-sheet>
              <v-sheet v-if="extendedPetition == null" class="pl-8 pr-8 pt-5" color="#f5f5f5">
                <v-skeleton-loader type="paragraph, avatar" class="mx-auto"></v-skeleton-loader>
              </v-sheet>
              <v-sheet v-else color="#f5f5f5">
                <v-sheet class="ml-8 mr-8 mt-5" color="#f5f5f5">{{extendedPetition.description}}</v-sheet>
                <br />
                <v-divider />
                <v-sheet class="pl-4 pr-4">
                  <v-container>
                    <v-row justify="space-around">
                      <v-col cols="4">
                        <v-row justify="center" align="center">
                          <v-sheet>
                            <v-avatar size="48px" class="mr-4">
                              <v-img
                                :src="authorPhotoUrl"
                                :lazy-src="lazyProfilePhoto"
                                @error="imageFail('profile')"
                              />
                            </v-avatar>
                          </v-sheet>
                          <v-sheet>
                            Created by {{extendedPetition.authorName}}
                            <div
                              v-if="extendedPetition.authorCity || extendedPetition.authorCountry"
                            >From {{extendedPetition.authorCity}}{{extendedPetition.authorCity && extendedPetition.authorCountry ? ', ' : ''}} {{extendedPetition.authorCountry}}</div>
                          </v-sheet>
                        </v-row>
                      </v-col>
                      <v-col cols="4">
                        <v-row justify="center" align="center">
                          <v-icon x-large class="mr-4">edit</v-icon>
                          {{petitionData.signatureCount}} {{petitionData.signatureCount == 1 ? 'signature' : 'signatures'}}
                          <v-btn outlined class="ml-4" @click="doExpandSignatures()">{{expandSignatures ? 'Hide' : 'Show'}}</v-btn>
                        </v-row>
                      </v-col>
                      <v-col cols="4">
                        <v-row justify="center" align="center">
                          <v-sheet>
                            <v-icon x-large class="mr-4">date_range</v-icon>
                          </v-sheet>
                          <v-sheet class="mr-2">
                            Started
                            <div v-if="extendedPetition.closingDate">Closes</div>
                          </v-sheet>
                          <v-sheet>
                            {{new Date(extendedPetition.createdDate).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})}}
                            <div
                              v-if="extendedPetition.closingDate"
                            >{{new Date(extendedPetition.closingDate).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})}}</div>
                          </v-sheet>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-sheet>
              </v-sheet>
            </v-card>
          </v-expand-transition>
          <v-expand-transition>
            <v-card v-show="expandSignatures" color="white" tile class="elevation-0">
              <v-container class="pa-8 pr-0">
                <v-list three-line max-height="350" class="scroll pl-8">
                  <template v-for="item in signatures">
                    <v-list-item :key="item.signedDate">
                      <v-list-item-avatar>
                        <v-img :src="getAvatar(item.signatoryId)" :lazy-src="lazyProfilePhoto" @error="src = lazyProfilePhoto"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>{{item.name}}</v-list-item-title>
                        <v-list-item-subtitle>{{item.city && item.country ? 'From '+item.city+', '+item.country : ''}}
                          {{item.country && !item.city ? 'From '+item.country : ''}}
                          <br />Signed {{new Date(item.signedDate).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'})}}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-container>
            </v-card>
          </v-expand-transition>
          <v-container>
            <v-row class="ml-1 mr-1 mt-2">
              <v-btn v-if="!permanent" outlined @click="expand()" color="primary" class="pl-2">
                <v-icon class="mr-1">keyboard_arrow_{{expanded ? 'up' : 'down'}}</v-icon>
                Show {{expanded ? 'less' : 'more'}}
              </v-btn>
              <v-spacer />
              <v-btn text color="primary" class="ml-2" @click="shareMenu = !shareMenu">
                <v-icon class="mr-1">share</v-icon>Share
              </v-btn>
            </v-row>
          </v-container>
          <v-expand-transition v-bind:shareMenu="shareMenu">
            <div v-if="shareMenu">
              <v-container>
                <v-row justify="center">
                  <v-divider></v-divider>
                </v-row>
                <v-row justify="center" class="mt-2">
                  <h2>Share this petition</h2>
                </v-row>
                <v-row justify="center" class="mt-2">
                  <v-col cols="6">
                    <v-text-field outlined v-model="permaLink" readonly label="Permanent link"></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-btn
                    outlined
                    color="blue"
                    class="ml-2"
                    :href="'http://twitter.com/share?text=Check out this petition&url='+permaLink"
                    target="_blank"
                    width="100"
                  >Twitter</v-btn>
                  <v-btn
                    outlined
                    color="orange"
                    class="ml-2"
                    :href="'https://www.reddit.com/submit?url='+permaLink+'&title='+petitionData.title"
                    target="_blank"
                    width="100"
                  >Reddit</v-btn>
                  <v-btn
                    outlined
                    color="gray"
                    class="ml-2"
                    :href="'mailto:?subject=Check out this petition&amp;body='+permaLink"
                    target="_blank"
                    width="100"
                  >Email</v-btn>
                </v-row>
              </v-container>
            </div>
          </v-expand-transition>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import {
  getPetitionInfo,
  getUserPhotoUrl,
  getPetitionPhotoUrl,
  getPetitionSignatures,
  CLIENT_URL
} from "../utils/requests";
export default {
  props: ["petition"],
  data() {
    return {
      petitionId: -1,
      expanded: false,
      expandSignatures: false,
      permanent: false,
      extendedPetition: null,
      signatures: null,
      photoUrl: "",
      authorPhotoUrl: "",
      petitionData: {},
      shareMenu: false,
      lazyProfilePhoto:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iZ3JheSIgd2lkdGg9IjE4cHgiIGhlaWdodD0iMThweCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTQuMmMtMi41IDAtNC43MS0xLjI4LTYtMy4yMi4wMy0xLjk5IDQtMy4wOCA2LTMuMDggMS45OSAwIDUuOTcgMS4wOSA2IDMuMDgtMS4yOSAxLjk0LTMuNSAzLjIyLTYgMy4yMnoiLz48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+",
      lazyPhoto:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0yMCAySDRjLTEuMSAwLTEuOTkuOS0xLjk5IDJMMiAyMmw0LTRoMTRjMS4xIDAgMi0uOSAyLTJWNGMwLTEuMS0uOS0yLTItMnptLTcgOWgtMlY1aDJ2NnptMCA0aC0ydi0yaDJ2MnoiLz48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+"
    };
  },
  methods: {
    expand: async function() {
      this.expanded = !this.expanded;
      if (this.extendedPetition == null) {
        this.extendedPetition = await getPetitionInfo(this.petitionId);
        this.authorPhotoUrl = getUserPhotoUrl(this.extendedPetition.authorId);
      }
      if (!this.expanded) {
        this.expandSignatures = false;
      }
    },
    doExpandSignatures: async function() {
      this.expandSignatures = !this.expandSignatures;
      if (this.signatures == null) {
        this.signatures = await getPetitionSignatures(this.petitionId);
        console.log(this.signatures);
      }
    },
    imageFail: function(what) {
      if (what == "profile") {
        this.authorPhotoUrl = this.lazyProfilePhoto;
      }
    },
    getAvatar: function(userId) {
      return getUserPhotoUrl(userId);
    }
  },
  mounted: async function() {
    this.petitionId = this.petition.petitionId;
    this.petitionData = this.petition;
    this.permaLink = CLIENT_URL + "petition/" + this.petitionId;
    this.photoUrl = getPetitionPhotoUrl(this.petitionId);
  }
};
</script>
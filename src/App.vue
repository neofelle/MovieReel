<template>
  <v-app light>
      <v-navigation-drawer temporary v-model="sideNav" absolute v-bind:class="{ hide : guest }">
        <v-list>
          <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          router
          :to="item.link">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>{{ item.title }}</v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-list>
          <v-list-tile @click="signOut">
            <v-list-tile-action>
              <v-icon>input</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>Sign out</v-list-tile-content>
          </v-list-tile>
        </v-list>

      </v-navigation-drawer>
      <v-toolbar dark class="primary" v-bind:class="{ hide : guest }">
        <v-toolbar-side-icon
        @click="sideNav = !sideNav"
        class="hidden-sm-and-up"></v-toolbar-side-icon>
        <v-toolbar-title><router-link to="/" tag="span" style="cursor:pointer;">MovieReel</router-link></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn flat @click="signOut">
            <v-icon left>input</v-icon>
            Sign out
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <main>
        <router-view></router-view>
      </main>
  </v-app>
</template>

<script>
  import * as Firebase from 'firebase';

  const userModel = Firebase.database().ref('user');
  export default {
    firebase: {
      userList: userModel,
    },
    data() {
      return {
        sideNav: false,
        guest: true,
        logout: false,
        menuItems: [
          { icon: 'thumb_up', title: 'Reviews', link: '/reviews/21' },
        ],
      };
    },
    methods: {
      signOut() {
        Firebase.auth().signOut();
        this.guest = true;
        this.$router.push('/connect');
      },
    },
    computed: {
      checkEmail() {
        return this.$store.getters.checkEmail;
      },
    },
    beforeMount() {
      this.guest = true;
      Firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          this.guest = false;
        }
      });
    },
    mounted() {
      Firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (!firebaseUser) {
          this.guest = true;
          this.$router.push('/connect');
        }
      });
    },
  };
</script>

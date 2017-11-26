<template>
  <v-layout row>
    <v-flex x6 lg6 sm7 xs12 style="margin:0 auto;">
      <h1 class="home-title">Movies</h1>
      <v-layout row wrap  v-for="movie in upcoming_movies" class="movie-card shadow" style="">
          <v-flex xl4 lg6 md7 sm12 xs12>
              <v-card-media :src="imgPath+movie.poster_path" style="width:240px;height: 300px;margin:auto;"></v-card-media>
          </v-flex>
          <v-flex xl8 lg6 md5 sm12 xs12 class="movie-description">
              <h2>{{ movie.title }}</h2>
              <p><span class="text-gray">TMDB Score : {{ movie.vote_average }}</span></p>
              <p class="justify">{{ movie.overview | truncate(315) }}</p>
              <p>Release Date : <span class="text-cyan">{{ movie.release_date }}</span></p>
              <v-btn flat
              router
              class="see-review-btn"
              :to="url+movie.id">
                See User Reviews
              </v-btn>
          </v-flex>
      </v-layout>
      <ul>
        <li><router-link class="tree-link" to="/movies/1">1</router-link></li>
        <li><router-link class="tree-link" to="/movies/2">2</router-link></li>
        <li><router-link class="tree-link" to="/movies/3">3</router-link></li>
        <li><router-link class="tree-link" to="/movies/4">4</router-link></li>
        <li><router-link class="tree-link" to="/movies/5">5</router-link></li>
      </ul>
    </v-flex>
  </v-layout>
</template>

<script>
const axios = require('axios');

export default {
  data() {
    return {
      url: '/reviews/',
      overview: '',
      upcoming_movies: null,
      imgPath: 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/',
    };
  },
  methods: {
  },
  mounted() {
    const page = `https://api.themoviedb.org/3/movie/upcoming?api_key=75a211ed97aa818a7965596fb17aa7ad&language=en-US&page=${this.$route.params.page}`;
    axios.get(page)
    .then((upcoming) => {
      this.upcoming_movies = upcoming.data.results;
    });
  },
  updated() {
    const page = `https://api.themoviedb.org/3/movie/upcoming?api_key=75a211ed97aa818a7965596fb17aa7ad&language=en-US&page=${this.$route.params.page}`;
    axios.get(page)
    .then((upcoming) => {
      this.upcoming_movies = upcoming.data.results;
    });
  },
};
</script>

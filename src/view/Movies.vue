<template lang="pug">
  v-layout(row='')
    v-flex(x6='', lg6='', sm7='', xs12='', style='margin:0 auto;')
      h1.home-title Movies
      v-layout.movie-card.shadow(row='', wrap='', v-for='movie in upcoming_movies', style='')
        v-flex(xl4='', lg6='', md7='', sm12='', xs12='')
          v-card-media(:src='imgPath+movie.poster_path', style='width:240px;height: 300px;margin:auto;')
        v-flex.movie-description(xl8='', lg6='', md5='', sm12='', xs12='')
          h2 {{ movie.title }}
          p
            span.text-gray TMDB Score : {{ movie.vote_average }}
          p.justify {{ movie.overview | truncate(315) }}
          p
            | Release Date :
            span.text-cyan {{ movie.release_date }}
          v-btn.see-review-btn(flat='', router='', :to='url+movie.id')
            | See User Reviews
      .pagination-container
        ul.pagination
          li(v-for='page in pages')
            a(:href='page.url') {{ page.text }}
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
      pages: [
        { url: '/movies/1', text: '1' },
        { url: '/movies/2', text: '2' },
        { url: '/movies/3', text: '3' },
        { url: '/movies/4', text: '4' },
        { url: '/movies/5', text: '5' },
      ],
      refresh: 1,
    };
  },
  methods: {
  },
  mounted() {
    if (this.$route.params.page > 0) {
      const page = `https://api.themoviedb.org/3/movie/upcoming?api_key=75a211ed97aa818a7965596fb17aa7ad&language=en-US&page=${this.$route.params.page}`;
      axios.get(page)
      .then((upcoming) => {
        this.upcoming_movies = upcoming.data.results;
      });
    }
    if (!this.$route.params.page) {
      axios.get('https://api.themoviedb.org/3/movie/upcoming?api_key=75a211ed97aa818a7965596fb17aa7ad&language=en-US&page=1')
      .then((upcoming) => {
        this.upcoming_movies = upcoming.data.results;
      });
    }
  },
};
</script>

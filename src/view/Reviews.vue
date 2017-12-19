<template lang="pug">
  v-layout(row="")
     span(style="display:none;") {{ this.$store.getters.userFullname }}
     .banner(v-bind:style="{ 'background-image': this.backdropURL }")
       .overlay-banner
         v-flex(x6="" lg6="" sm7="" xs12="" style="margin:0 auto;")
           h2.home-title
             router-link.tree-link(to="/") Home >
             |  {{ this.movieData.title }}
           v-layout.movie-single(row="" wrap="")
             v-flex.movie-review-pic(xl4="" lg6="" md6="" sm12="" xs12="")
               v-card-media.review-movie-pic(:src="this.posterURL")
             v-flex.movie-review-description(xl8="" lg6="" md6="" sm12="" xs12="")
               h2.text-white {{ this.movieData.title }}
               ul.genre-list
                 li(v-for="genre in this.movieData.genres") {{ genre.name }}
               br(style="clear:both;")
               h2.text-white.tagline(style="font-style:italic;" v-if="this.movieData.tagline") " {{this.movieData.tagline}} "
               br
               p.justify.text-white {{ this.overview }}
               p.text-white.mobile-center Run Time : {{ this.movieData.runtime }} Minutes
               p.text-white.mobile-center
                 | Release Date :
                 span.text-cyan {{ this.movieData.release_date }}
               p.text-white.mobile-center
                 span.text-white TMDB Score : {{ this.movieData.vote_average }} / 10
       v-flex(x6="" lg6="" sm7="" xs12="" style="margin:0 auto;")
         h1.home-title Reviews
         br(style="clear:both;")
         br
         .reviews-card(v-for="review in this.loadReviews")
           div(v-if="review.yourReview")
             a.delete-icon(href="#" @click="modalDelete = true")
               v-icon(style="color:red;") highlight_off
           .left.profile-pic-container
             img.review-profile-pic(:src="review.pic")
           .left.review-container
             h2.review-title.mobile-center " {{ review.title }} "
             h2.review-by.mobile-center Reviewed by : {{ review.fullname }}
             br
             p.review-description  {{ review.description }}
             h2.review-num
               v-icon.review-icon grade
               | Score : {{ review.score }}/5
         .review-form-container
           .left(style="width:100%;" v-if="this.$store.getters.reviewable")
             form(@submit.prevent="onSubmit")
               h1 Write your Review
               br
               div
                 .left.text-review-title
                   v-text-field.default(name="title" label="Title" v-model="review.title" v-bind:class="{ errortxt : isTitleInvalid }" type="text")
                 .right.select-review-score
                   v-select(v-bind:items="items" name="score" label="Your Score" v-model="review.score" v-bind:class="{ errortxt : isScoreInvalid }" required="")
               v-text-field.default.text-review(name="review" v-model="review.description" v-bind:class="{ errortxt : isDescriptionInvalid }" label="Your Review" multi-line="")
               v-btn.submit-blue(type="submit" :disabled="loading" :loading="loading")
                 | Submit Your Review
                 span.custom-loader(slot="loader")
                   v-icon(light="") cached
           .left(style="width:100%;" v-if="canUpdate")
             form(@submit.prevent="onUpdate")
               h1 Edit your Review
               br
               div
                 .left.text-review-title
                   v-text-field.default(name="title" label="Title" v-model="review.title" v-bind:class="{ errortxt : isTitleInvalid }" type="text")
                 .right.select-review-score
                   v-select(v-bind:items="items" name="score" label="Your Score" v-model="review.score" v-bind:class="{ errortxt : isScoreInvalid }" required="")
               v-text-field.default.text-review(name="review" v-model="review.description" v-bind:class="{ errortxt : isDescriptionInvalid }" label="Your Review" multi-line="")
               v-btn.submit-blue(type="submit" :disabled="loading" :loading="loading")
                 | Update Your Review
                 span.custom-loader(slot="loader")
                   v-icon(light="") cached
           div(v-if="this.$store.getters.reviewSuccess")
             h4.txt-thanks Thank you for your Reviewing this movie!
             br
             a.blue-btn(href="#" @click="updateReview") Edit Your Review
     v-dialog(v-model="modalDelete" max-width="290")
       v-card
         v-card-title.headline Are you sure you want to Delete your Review?
         v-card-text This will permanently remove your published post.
         v-card-actions(style="margin:0 auto;width:50%;")
           v-btn(color="green darken-1" flat="flat" @click.native="deleteReview") Yes
           v-btn(color="green darken-1" flat="flat" @click.native="modalDelete = false") No
</template>

<script>
import * as Firebase from 'firebase';

const axios = require('axios');

const userRef = Firebase.database().ref('user');
export default {
  data() {
    return {
      firebase: {
        users: userRef,
      },
      backdropURL: 'https://image.tmdb.org/t/p/w1400_and_h450_bestv2',
      userList: {},
      reviewList: {},
      overview: '',
      myEmail: '',
      canUpdate: false,
      posterURL: '',
      modalDelete: false,
      props: ['id'],
      items: ['1', '2', '3', '4', '5'],
      movieData: [],
      review: {
        title: '',
        score: '',
        description: '',
      },
      isTitleInvalid: false,
      isScoreInvalid: false,
      isDescriptionInvalid: false,
      myReview: null,
    };
  },
  methods: {
    updateReview() {
      this.$store.dispatch('updateReview');
      console.log('w');
      console.log(this.myReview);
      this.canUpdate = true;
      this.review.description = this.myReview.description;
      this.review.score = this.myReview.score;
      this.review.title = this.myReview.title;
    },
    onUpdate() {
      //    update sample
      Firebase.database().ref('review').child(this.$store.getters.reviewKey).update({
        description: this.review.description,
        title: this.review.title,
        score: this.review.score,
      });
      this.canUpdate = false;
      alert('Your Review has been Updated!');
    },
    onSubmit() {
      Firebase.database().ref('user').on('value', (user) => {
        this.userList = user.val();
      });
      this.$store.dispatch('getEmail', this.userList);
      if (this.validateTitle === true ||
          this.validateDescription === true ||
          this.validateScore === true) {
        alert('Please fill up the required fields!');
        return;
      }
      if (this.validateTitle === false &&
          this.validateDescription === false &&
          this.validateScore === false) {
        this.$store.dispatch('registerReview', {
          fullName: this.$store.getters.userFullname,
          email: this.$store.getters.email,
          movieID: this.$route.params.movieId,
          title: this.review.title,
          description: this.review.description,
          score: this.review.score,
        });
      }
    },
    deleteReview() {
      this.modalDelete = false;
      Firebase.database().ref('review').child(this.$store.getters.reviewKey).remove();
    },
  },
  updated() {
    this.$store.dispatch('getName', this.userList);
    this.myReview = this.$store.getters.myReview;
  },
  mounted() {
    this.modalDelete = false;
    //    delete sample
    Firebase.database().ref('review').child('-L-743TL1jZV7rZbaTaa').remove();
    //    update sample
    Firebase.database().ref('review').child('-L-74U-oYyKHWFTPoS6L').update({
      description: 'nice movie2!',
    });
    window.scrollTo(0, 0);
    const apiKey = '75a211ed97aa818a7965596fb17aa7ad';
    const urlParam = `https://api.themoviedb.org/3/movie/${this.$route.params.movieId}?api_key=${apiKey}&language=en-US`;
    axios.get(urlParam)
    .then((movie) => {
      this.movieData = movie.data;
      this.overview = this.movieData.overview.substring(0, 315);
      const backgroundURL = 'https://image.tmdb.org/t/p/w1400_and_h450_bestv2';
      this.backdropURL = `url(${backgroundURL}${this.movieData.backdrop_path})`;
      const posterPath = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';
      this.posterURL = `${posterPath}${this.movieData.poster_path}`;
    });
    Firebase.database().ref('user').on('value', (user) => {
      this.userList = user.val();
    });
    this.$store.dispatch('getEmail', this.userList);
    Firebase.database().ref('review').on('value', (review) => {
      this.$store.dispatch('getReviews', {
        reviewList: review.val(),
        movieID: this.$route.params.movieId,
      });
    });
    this.myReview = this.$store.getters.myReview;
  },
  computed: {
    loadReviews() {
      return this.$store.getters.movieReview;
    },
    loadBg() {
      const bgURL = `url(${this.backgroundURL})`;
      return bgURL;
    },
    loading() {
      return this.$store.getters.loading;
    },
    validateTitle() {
      this.isTitleInvalid = false;
      if (this.$lodash.isEmpty(this.review.title)) {
        this.isTitleInvalid = true;
      }
      return this.isTitleInvalid;
    },
    validateDescription() {
      this.isDescriptionInvalid = false;
      if (this.$lodash.isEmpty(this.review.description)) {
        this.isDescriptionInvalid = true;
      }
      return this.isDescriptionInvalid;
    },
    validateScore() {
      this.isScoreInvalid = false;
      if (this.$lodash.isEmpty(this.review.score)) {
        this.isScoreInvalid = true;
      }
      return this.isScoreInvalid;
    },
    getMovie() {
      return this.$route.params.movieId;
    },
  },
};
</script>

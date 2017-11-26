import Vue from 'vue';
import Vuex from 'vuex';
import * as Firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBDKLNlScH0wlHcG7__DCPNG4AePjHGXzY',
  authDomain: 'moviereel-57a57.firebaseapp.com',
  databaseURL: 'https://moviereel-57a57.firebaseio.com',
  projectId: 'moviereel-57a57',
  storageBucket: 'moviereel-57a57.appspot.com',
  messagingSenderId: '597077655240',
};


Firebase.initializeApp(config);
const auth = Firebase.auth();

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    userList: {},
    reviewable: true,
    reviewSuccess: false,
    movieReview: {},
    userFullname: 'Anonymous',
    loading: false,
    error: null,
    email: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setReviewable(state, payload) {
      state.reviewable = payload;
    },
    setReview(state, payload) {
      state.movieReview = payload;
    },
    setReviewSuccess(state, payload) {
      state.reviewSuccess = payload;
    },
    setEmail(state, payload) {
      state.email = payload;
    },
    setUserFullname(state, payload) {
      state.userFullname = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    getEmail({ commit }) {
      Firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          commit('setEmail', firebaseUser.email);
        }
      });
    },
    registerReview({ commit }, payload) {
      const newReview = {
        fullname: payload.fullName,
        email: payload.email,
        movieid: payload.movieID,
        title: payload.title,
        score: payload.score,
        description: payload.description,
      };
      Firebase.database().ref('review').push(newReview);
    },
    getReviews({ commit }, payload) {
      const obj = {};
      commit('setReviewSuccess', false);
      commit('setReviewable', true);
      Object.entries(payload.reviewList).forEach(([key, value]) => {
        if (payload.movieID === value.movieid) {
          const randomNumber = String(Math.ceil(Math.random() * 50));
          const url = `https://randomuser.me/api/portraits/men/${randomNumber}.jpg`;
          value.pic = url;
          obj[key] = value;
        }
        if (this.state.email === value.email && payload.movieID === value.movieid) {
          commit('setReviewable', false);
          commit('setReviewSuccess', true);
        }
      });
      commit('setReview', obj);
    },
    getName({ commit }, payload) {
      Object.entries(payload).forEach(([key, value]) => {
        if (this.state.email === value.email) {
          console.log(key);
          commit('setUserFullname', value.name);
        }
      });
    },
    signUserUp({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      auth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          (user) => {
            console.log(user);
            commit('setLoading', false);
            commit('setEmail', payload.email);
            const newUser = {
              name: payload.name,
              email: payload.email,
              password: payload.password,
            };
            Firebase.database().ref('user').push(newUser)
              .then((data) => {
                commit('setUser', newUser);
                console.log(data);
              });
          },
        )
        .catch(
          (error) => {
            commit('setLoading', false);
            commit('setError', error);
            console.log(error);
          },
        );
    },
    signUserIn({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      auth.signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          (user) => {
            commit('setLoading', false);
            const newUser = {
              id: user.uid,
              email: payload.email,
              password: payload.password,
            };
            commit('setEmail', payload.email);
            commit('setUser', newUser);
          },
        )
        .catch(
          (error) => {
            commit('setLoading', false);
            commit('setError', error);
          },
        );
    },
    clearError({ commit }) {
      commit('clearError');
    },
  },
  getters: {
    userFullname(state) {
      return state.userFullname;
    },
    movieReview(state) {
      return state.movieReview;
    },
    user(state) {
      return state.user;
    },
    reviewSuccess(state) {
      return state.reviewSuccess;
    },
    email(state) {
      return state.email;
    },
    loading(state) {
      return state.loading;
    },
    reviewable(state) {
      return state.reviewable;
    },
    error(state) {
      return state.error;
    },
  },
});

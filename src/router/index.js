import Vue from 'vue';
import Router from 'vue-router';
import Movies from '@/view/Movies';
import Connect from '@/view/Connect';
import Register from '@/view/Register';
import Reviews from '@/view/Reviews';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Movies',
      component: Movies,
    },
    {
      path: '/movies/:page',
      name: 'Movies',
      component: Movies,
      props: true,
    },
    {
      path: '/connect',
      name: 'Connect',
      component: Connect,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/reviews/:movieId',
      name: 'Reviews',
      props: true,
      component: Reviews,
    },
  ],
  mode: 'history',
});

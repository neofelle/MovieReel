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

export default auth {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    authCheck() {
      auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          this.email = firebaseUser.email;
        }
      });
      return this.email;
    },
  },
};

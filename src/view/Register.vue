<template lang="pug">
  v-container
    v-layout(row='')
      v-flex.login-form.center-block(x6='', lg6='', sm7='', xs12='')
        v-layout.default-container.gray-block(row='', wrap='')
          v-flex.login-container.register-block(lg8='', md9='', sm10='', xs11='')
            h2 Create Account
            br
            v-layout(row='', v-if='error')
              v-flex(xs12='')
                app-alert(@dismissed='onDismissed', :text='error.message')
            form(@submit.prevent='onSignup')
              v-text-field.default(name='name', label='Full Name*', type='text', v-model='user_account.name', v-bind:class='{ errortxt : isNameInvalid }')
              v-text-field.default(name='email', label='Email Address*', type='text', v-model='user_account.email', v-bind:class='{ errortxt : isEmailInvalid }')
              v-text-field.default(name='password', label='Password*', type='password', v-model='user_account.password', v-bind:class='{ errortxt : isPasswordInvalid }')
              br
              v-btn.submit-blue(type='submit', :disabled='loading', :loading='loading')
                | Register
                span.custom-loader(slot='loader')
                  v-icon(light='') cached
              span.register(style='margin-right:10px;', @click='redirect_login()') Already have account? Sign In
</template>

<script>
  import * as Firebase from 'firebase';

  export default {
    data() {
      return {
        isEmailInvalid: false,
        isNameInvalid: false,
        isPasswordInvalid: false,
        user_account: {
          email: '',
          name: '',
          password: '',
        },
      };
    },
    computed: {
      user() {
        return this.$store.getters.user;
      },
      error() {
        return this.$store.getters.error;
      },
      loading() {
        return this.$store.getters.loading;
      },
      validateEmail() {
        this.isEmailInvalid = false;
        if (this.$lodash.isEmpty(this.user_account.email)) {
          this.isEmailInvalid = true;
        }
        return this.isEmailInvalid;
      },
      validateName() {
        this.isNameInvalid = false;
        if (this.$lodash.isEmpty(this.user_account.name)) {
          this.isNameInvalid = true;
        }
        return this.isNameInvalid;
      },
      validatePassword() {
        this.isPasswordInvalid = false;
        if (this.$lodash.isEmpty(this.user_account.password)) {
          this.isPasswordInvalid = true;
        }
        return this.isPasswordInvalid;
      },
    },
    watch: {
      user(value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/');
        }
      },
    },
    methods: {
      onSignup() {
        if (this.validateName === true ||
            this.validateEmail === true ||
            this.validatePassword === true) {
          alert('Please fill up the required fields!');
          return;
        }
        if (this.validateEmail === false &&
            this.validateName === false &&
            this.validatePassword === false) {
          this.$store.dispatch('signUserUp', {
            email: this.user_account.email,
            password: this.user_account.password,
            name: this.user_account.name,
          });
        }
      },
      onDismissed() {
        this.$store.dispatch('clearError');
      },
      mounted() {
        Firebase.auth().onAuthStateChanged((firebaseUser) => {
          if (firebaseUser) {
            this.$router.push('/');
          }
        });
      },
      post() {
        this.validateEmail();
        this.validateName();
        this.validatePassword();
        if (this.isEmailInvalid === true ||
            this.isNameInvalid === true ||
            this.isPasswordInvalid === true) {
          alert('Please fill up the required fields!');
          return;
        }
        if (this.isEmailInvalid === false &&
            this.isNameInvalid === true &&
            this.isPasswordInvalid === true) {
          this.$http.post('https://moviereel-57a57.firebaseio.com/users.json', this.user_account).then((data) => {
            this.submitted = true;
            console.log(data);
            this.$router.push('/');
          });
        }
      },
      redirect_login() {
        this.$router.push('/connect');
      },
    },
  };
</script>

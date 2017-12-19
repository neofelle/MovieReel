<template lang="pug">
  v-container
    v-layout(row="")
      v-flex.gray-block.login-form(x6="" lg6="" sm7="" xs12="")
        v-layout.default-container(row="" wrap="" style="")
          v-flex.login-container(lg8="" md9="" sm10="" xs11="" style="margin:0 auto;")
            h2 Connect to MovieReel
            br
            v-layout(row="" v-if="error")
              v-flex(xs12="")
                app-alert(@dismissed="onDismissed" :text="error.message")
            form(@submit.prevent="onSignIn")
              v-text-field.default(name="email" label="Email Address" type="text" v-model="user_account.email" v-bind:class="{ errortxt : isEmailInvalid }")
              v-text-field.default(name="password" label="Password" type="password" v-model="user_account.password" v-bind:class="{ errortxt : isPasswordInvalid }")
              br
              v-btn.submit-blue(type="submit" :disabled="loading" :loading="loading")
                | Connect
                span.custom-loader(slot="loader")
                  v-icon(light="") cached
              span.register(@click="redirect_register()") Don't have an Account yet?
</template>

<script>
  import * as Firebase from 'firebase';

  export default {
    data() {
      return {
        isEmailInvalid: false,
        isPasswordInvalid: false,
        user_account: {
          email: '',
          password: '',
        },
      };
    },
    mounted() {
      Firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          this.$router.push('/');
        }
      });
    },
    methods: {
      onSignIn() {
        this.validateEmail();
        this.validatePassword();
        this.$store.dispatch('signUserIn', {
          email: this.user_account.email,
          password: this.user_account.password,
        });
      },
      onDismissed() {
        this.$store.dispatch('clearError');
      },
      redirect_register() {
        this.$router.push('/register');
      },
      validateEmail() {
        this.isEmailInvalid = false;
        if (this.$lodash.isEmpty(this.user_account.email)) {
          this.isEmailInvalid = true;
        }
      },
      validatePassword() {
        this.isPasswordInvalid = false;
        if (this.$lodash.isEmpty(this.user_account.password)) {
          this.isPasswordInvalid = true;
        }
      },
    },
    watch: {
      user(value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/');
        }
      },
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
    },
  };
</script>

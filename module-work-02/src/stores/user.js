import { defineStore } from 'pinia';
import { ref } from 'vue';
import { keycloak } from '@/utils/keycloak';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: ref({}),
    token: ref(undefined),
  }),
  getters: {
    isAuthenticated: (state) => {
      return state.token !== undefined && state.token !== '';
    },
    getToken: (state) => {
      return state.token;
    },
    getUserInfo: (state) => {
      return state.userInfo;
    },
    getRealmAccess: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    setToken(token) {
      this.$patch({
        token: token,
      });
    },
    setUserInfo(user) {
      this.$patch({
        userInfo: user,
      });
    },
    logout() {
      this.$reset();
      return keycloak.logout();
    },
  },
});

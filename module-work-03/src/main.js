import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { initKeycloak, keycloak, KEYCLOAK_USER_ATTRIBUE } from './utils/keycloak';
import { useUserStore } from './stores/user';

initKeycloak()
  .then(() => {
    createApp(App).use(createPinia()).mount('#app');
  })
  .then(() => {
    if (keycloak.authenticated) {
      const userStore = useUserStore();
      userStore.setToken(keycloak.token);
      userStore.setUserInfo({
        email: keycloak.tokenParsed[KEYCLOAK_USER_ATTRIBUE.email],
        preferred_username: keycloak.tokenParsed[KEYCLOAK_USER_ATTRIBUE.preferred_username],
        name: keycloak.tokenParsed[KEYCLOAK_USER_ATTRIBUE.name],
        given_name: keycloak.tokenParsed[KEYCLOAK_USER_ATTRIBUE.given_name],
        family_name: keycloak.tokenParsed[KEYCLOAK_USER_ATTRIBUE.family_name],
        roles: keycloak.tokenParsed[KEYCLOAK_USER_ATTRIBUE.realm_access]?.roles ?? [],
      });
    }

    keycloak
      .updateToken(60)
      .then((refreshed) => {
        if (refreshed) {
          console.debug(`Token refreshed ${refreshed}`);
          const userStore = useUserStore();
          userStore.setToken(keycloak.token);
        } else {
          console.debug(`Token not refreshed, valid for ${Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000)} seconds`);
        }
      })
      .catch(() => {
        console.error('Failed to refresh token');
      });
  });

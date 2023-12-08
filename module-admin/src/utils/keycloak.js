import Keycloak from 'keycloak-js';
import { useUserStore } from '@/stores/user';

const keycloakInitOptions = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirectUri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URL,
  checkLoginIframe: false,
  flow: 'standard',
  onLoad: 'login-required',
};

const keycloak = new Keycloak(keycloakInitOptions);

const KEYCLOAK_USER_ATTRIBUE = {
  email: 'email',
  preferred_username: 'preferred_username',
  name: 'name',
  given_name: 'given_name',
  family_name: 'family_name',
  realm_access: 'realm_access',
};

function initKeycloak() {
  const pathName = window.location.pathname + window.location.search;

  return keycloak
    .init({
      onLoad: keycloakInitOptions.onLoad,
      redirectUri: `${keycloakInitOptions.redirectUri}${pathName}`,
      checkLoginIframe: keycloakInitOptions.checkLoginIframe,
      scope: 'openid email profile',
    })
    .then(() => {
      location.hash = '';
      history.replaceState(history.state, '', location.pathname);

      // Token Refresh
      setInterval(() => {
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
          .catch((error) => {
            console.error('Failed to refresh token');
            console.error(error);
          });
      }, 30000);
    })
    .catch((error) => {
      console.log(error);
    });
}

export { initKeycloak, keycloak, KEYCLOAK_USER_ATTRIBUE };

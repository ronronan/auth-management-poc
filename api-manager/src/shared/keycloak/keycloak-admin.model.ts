export enum KeycloakGroupEnum {
  ADMIN = 'ADMIN',
}

export interface IKeycloakGroup {
  id: string;
  name: KeycloakGroupEnum;
}

export interface IKeycloakUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: number;
  roles: KeycloakGroupEnum[];
}

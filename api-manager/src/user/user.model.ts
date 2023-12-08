import { KeycloakGroupEnum } from '@/shared/keycloak';

export interface IUserDto {
  id: string | undefined;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: number | undefined;
  updatedAt: number | undefined;
  roles: KeycloakGroupEnum[];
}

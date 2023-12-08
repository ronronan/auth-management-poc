import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakAdminClient } from '@s3pweb/keycloak-admin-client-cjs';
import { IKeycloakUser, KeycloakGroupEnum, IKeycloakGroup } from './keycloak-admin.model';

const logger = new Logger('KeycloakAdminService');

@Injectable()
export class KeycloakAdminService {
  private readonly KEYCLOAK_ADMIN_CLIENT_ID: string;
  private readonly KEYCLOAK_ADMIN_CLIENT_SECRET: string;
  private readonly keycloakAdminClient: KeycloakAdminClient;

  private adminKeycloakGroup: IKeycloakGroup | undefined;

  constructor(private configService: ConfigService) {
    const keycloakUrl = this.configService.getOrThrow('KEYCLOAK_URL');
    const keycloakRealm = this.configService.getOrThrow('KEYCLOAK_REALM');
    this.KEYCLOAK_ADMIN_CLIENT_ID = this.configService.getOrThrow('KEYCLOAK_ADMIN_CLIENT_ID');
    this.KEYCLOAK_ADMIN_CLIENT_SECRET = this.configService.getOrThrow('KEYCLOAK_ADMIN_CLIENT_SECRET');
    this.keycloakAdminClient = new KeycloakAdminClient({
      baseUrl: keycloakUrl,
      realmName: keycloakRealm,
    });
  }

  private async auth(): Promise<void> {
    logger.verbose('auth()');
    await this.keycloakAdminClient.auth({
      grantType: 'client_credentials',
      clientId: this.KEYCLOAK_ADMIN_CLIENT_ID,
      clientSecret: this.KEYCLOAK_ADMIN_CLIENT_SECRET,
    });
  }

  private async setCacheBaseGroup(): Promise<void> {
    logger.verbose('setCacheBaseGroup()');
    if (this.adminKeycloakGroup === undefined) {
      const groupKeycloakList = await this.keycloakAdminClient.groups.find();
      if (Array.isArray(groupKeycloakList)) {
        const adminGroup = groupKeycloakList.find((g) => g.name === KeycloakGroupEnum.ADMIN);
        if (adminGroup) {
          this.adminKeycloakGroup = {
            id: adminGroup.id,
            name: KeycloakGroupEnum.ADMIN,
          } as IKeycloakGroup;
        }
      }
    }
  }

  public async findAllUsers(): Promise<IKeycloakUser[]> {
    logger.verbose('findAllUsers()');
    await this.auth();
    await this.setCacheBaseGroup();
    if (this.adminKeycloakGroup === undefined) {
      throw new Error(`No group '${KeycloakGroupEnum.ADMIN}' found in keycloak`);
    }
    const userList = await this.keycloakAdminClient.users.find();
    const adminList = await this.keycloakAdminClient.groups.listMembers({ id: this.adminKeycloakGroup.id });
    const idUserList = userList.filter((u) => u.emailVerified && u.enabled).map((u) => u.id);
    return idUserList
      .map((id) => {
        const adminFound = adminList.find((a) => a.id === id);
        const userFound = userList.find((u) => u.id === id);

        let user: any;
        if (adminFound) {
          if (user) {
            user.roles.push(KeycloakGroupEnum.ADMIN);
          } else {
            user = {
              id: adminFound.id,
              createdAt: adminFound.createdTimestamp,
              email: adminFound.email,
              lastName: adminFound.lastName,
              firstName: adminFound.firstName,
              roles: [KeycloakGroupEnum.ADMIN],
            } as IKeycloakUser;
          }
        }
        if (userFound && !user) {
          user = {
            id: userFound.id,
            createdAt: userFound.createdTimestamp,
            email: userFound.email,
            lastName: userFound.lastName,
            firstName: userFound.firstName,
            roles: [],
          } as IKeycloakUser;
        }
        return user;
      })
      .filter((u) => u?.id !== undefined);
  }
}

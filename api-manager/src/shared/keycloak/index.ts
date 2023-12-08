import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, KeycloakConnectModule, RoleGuard, PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';
import { KeycloakAdminService } from './keycloak-admin.service';
import { IKeycloakUser, KeycloakGroupEnum } from './keycloak-admin.model';

@Module({
  imports: [
    ConfigModule,
    KeycloakConnectModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        authServerUrl: configService.getOrThrow('KEYCLOAK_URL'),
        realm: configService.getOrThrow('KEYCLOAK_REALM'),
        clientId: configService.getOrThrow('KEYCLOAK_CLIENT_ID'),
        secret: configService.getOrThrow('KEYCLOAK_CLIENT_SECRET'),
        policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
        tokenValidation: TokenValidation.OFFLINE,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    KeycloakAdminService,
  ],
  exports: [KeycloakAdminService],
})
class KeycloakModule {}

export { KeycloakModule, KeycloakAdminService, IKeycloakUser, KeycloakGroupEnum };

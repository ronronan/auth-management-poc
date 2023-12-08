import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { KeycloakModule } from './shared/keycloak';
import { UserModule } from './user';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), KeycloakModule, UserModule],
  controllers: [AppController],
})
export class AppModule {}

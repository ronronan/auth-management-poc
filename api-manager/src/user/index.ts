import { Module } from '@nestjs/common';
import { KeycloakModule } from '@/shared/keycloak';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IUserDto } from './user.model';

@Module({
  imports: [KeycloakModule],
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}

export { UserModule, UserService, IUserDto };

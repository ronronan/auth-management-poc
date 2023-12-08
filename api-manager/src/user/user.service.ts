import { Injectable } from '@nestjs/common';
import { KeycloakAdminService } from '@/shared/keycloak';

@Injectable()
export class UserService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  public async getAllUser(): Promise<any[]> {
    const keycloakUserList = await this.keycloakAdminService.findAllUsers();
    return keycloakUserList;
  }
}

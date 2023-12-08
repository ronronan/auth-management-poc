import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'nest-keycloak-connect';

const logger = new Logger('AppController');

@ApiTags('System')
@Controller()
export class AppController {
  constructor() {}

  @Get('/_health')
  @Public()
  @ApiOkResponse({ description: 'True is server is OK, else false', type: Boolean })
  healthCheck(): boolean {
    logger.verbose('health check call');
    return true;
  }
}

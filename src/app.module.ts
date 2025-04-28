import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseUtil } from './common/utils/response.util';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ResponseUtil],
})
export class AppModule {}

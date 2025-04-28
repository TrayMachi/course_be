import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseUtil } from './common/utils/response.util';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, ResponseUtil],
})
export class AppModule {}

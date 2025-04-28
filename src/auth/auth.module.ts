import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResponseUtil } from 'src/common/utils/response.util';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenGuard } from './auth.guard';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({ secret: process.env.JWT_SECRET! }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ResponseUtil, RefreshTokenGuard],
})
export class AuthModule {}

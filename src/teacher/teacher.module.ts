import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { ResponseUtil } from 'src/common/utils/response.util';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherController],
  providers: [TeacherService, JwtService, ResponseUtil],
})
export class TeacherModule {}

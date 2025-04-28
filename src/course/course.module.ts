import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { ResponseUtil } from 'src/common/utils/response.util';

@Module({
  imports: [PrismaModule],
  controllers: [CourseController],
  providers: [CourseService, JwtService, ResponseUtil],
})
export class CourseModule {}

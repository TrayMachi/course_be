import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AccessTokenGuard } from 'src/auth/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AccessTokenGuard],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}

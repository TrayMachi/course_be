import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseUtil } from './common/utils/response.util';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [PrismaModule, AuthModule, CourseModule, StudentModule, TeacherModule],
  controllers: [AppController],
  providers: [AppService, ResponseUtil],
})
export class AppModule {}

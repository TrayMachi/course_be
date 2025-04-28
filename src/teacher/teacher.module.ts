import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { AccessTokenGuard } from 'src/auth/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AccessTokenGuard],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}

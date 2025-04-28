import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccessTokenGuard } from 'src/auth/auth.guard';

@Module({
  imports: [PrismaModule, AccessTokenGuard],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}

import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { ResponseUtil } from 'src/common/utils/response.util';

@Module({
  imports: [PrismaModule],
  controllers: [StudentController],
  providers: [StudentService, JwtService, ResponseUtil],
})
export class StudentModule {}

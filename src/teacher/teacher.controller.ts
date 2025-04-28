import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ResponseUtil } from 'src/common/utils/response.util';
import { RegisterTeacherDto, UpdateTeacherDto } from './teacher.dto';
import { AccessTokenGuard } from 'src/auth/auth.guard';

@Controller('teacher')
@UseGuards(AccessTokenGuard)
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterTeacherDto, @Req() req) {
    if (req.user.role !== 'GUEST') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only GUEST users can register teachers',
      });
    }
    const teacher = await this.teacherService.registerTeacher(body);
    return this.responseUtil.response(
      {
        code: HttpStatus.CREATED,
        message: 'Teacher registered successfully',
      },
      { data: teacher },
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'TEACHER') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only TEACHER users request',
      });
    }
    const teacher = await this.teacherService.getTeacherById(id);
    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: 'Teacher fetched successfully',
      },
      { data: teacher },
    );
  }

  @Get('course/:courseId')
  async getByCourse(@Param('courseId') courseId: string) {
    const teacher = await this.teacherService.getTeacherByCourseId(courseId);
    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: 'Teacher fetched successfully',
      },
      { data: teacher },
    );
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTeacherDto,
    @Req() req,
  ) {
    if (req.user.role !== 'TEACHER') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only TEACHER users request',
      });
    }
    const teacher = await this.teacherService.updateTeacher(id, body);
    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: 'Teacher updated successfully',
      },
      { data: teacher },
    );
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'TEACHER') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only TEACHER users request',
      });
    }
    await this.teacherService.deleteTeacher(id);
    return this.responseUtil.response({
      code: HttpStatus.OK,
      message: 'Teacher deleted successfully',
    });
  }
}

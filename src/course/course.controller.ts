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
import { CourseService } from './course.service';
import { ResponseUtil } from 'src/common/utils/response.util';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { AccessTokenGuard } from 'src/auth/auth.guard';

@Controller('course')
@UseGuards(AccessTokenGuard)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Get()
  async getAll() {
    const courses = await this.courseService.getAllCourses();
    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: 'Courses fetched successfully',
      },
      { data: courses },
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const course = await this.courseService.getCourseById(id);
    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: 'Course fetched successfully',
      },
      { data: course },
    );
  }

  @Post('create')
  async create(@Body() body: CreateCourseDto, @Req() req) {
    if (req.user.role !== 'TEACHER') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only TEACHER users request',
      });
    }
    const course = await this.courseService.createCourse(body);
    return this.responseUtil.response(
      {
        code: HttpStatus.CREATED,
        message: 'Course created successfully',
      },
      { data: course },
    );
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCourseDto,
    @Req() req,
  ) {
    if (req.user.role !== 'TEACHER') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only TEACHER users request',
      });
    }
    const course = await this.courseService.updateCourse(
      id,
      body,
      req.user.sub,
    );
    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: 'Course updated successfully',
      },
      { data: course },
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
    await this.courseService.deleteCourse(id);
    return this.responseUtil.response({
      code: HttpStatus.OK,
      message: 'Course deleted successfully',
    });
  }

  @Post(':id/enroll/:studentId')
  async enrollStudent(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
    @Req() req,
  ) {
    if (req.user.role !== 'STUDENT') {
      return this.responseUtil.response({
        code: HttpStatus.FORBIDDEN,
        message: 'Only STUDENT users request',
      });
    }
    const result = await this.courseService.enrollStudent(id, studentId);
    return this.responseUtil.response({
      code: HttpStatus.OK,
      message: result.message,
    });
  }
}

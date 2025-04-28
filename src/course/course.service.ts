import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCourses() {
    const courses = await this.prisma.course.findMany();

    return courses;
  }

  async getCourseById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            department: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async enrollStudent(courseId: string, studentId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const findEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          courseId: courseId,
          studentId: studentId,
        },
      },
    });

    if (findEnrollment) {
      throw new ForbiddenException('Student already enrolled in this course');
    }

    await this.prisma.enrollment.create({
      data: {
        courseId,
        studentId,
      },
    });

    return { message: 'Student enrolled successfully' };
  }

  async createCourse(data: CreateCourseDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: data.teacherId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const course = await this.prisma.course.create({
      data: {
        name: data.name,
        code: data.code,
        teacher: { connect: { id: data.teacherId } },
      },
    });
    return course;
  }

  async updateCourse(id: string, data: UpdateCourseDto, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.teacher.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this course',
      );
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        name: data.name ? data.name : course.name,
        code: data.code ? data.code : course.code,
        teacher: {
          connect: { id: data.teacherId ? data.teacherId : course.teacherId },
        },
      },
    });
  }

  async deleteCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.teacher.user.id !== id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this course',
      );
    }

    await this.prisma.course.delete({
      where: { id },
    });

    return { message: 'Course deleted successfully' };
  }
}

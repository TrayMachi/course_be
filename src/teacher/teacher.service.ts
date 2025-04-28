import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterTeacherDto, UpdateTeacherDto } from './teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeacherById(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
        courses: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async getTeacherByCourseId(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
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

    if (!course || !course.teacher) {
      throw new NotFoundException('No teacher found for this course');
    }
    return course.teacher;
  }

  async registerTeacher(data: RegisterTeacherDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: data.userId },
      data: { role: 'TEACHER' },
    });

    return await this.prisma.teacher.create({
      data: {
        userId: data.userId,
        department: data.department,
      },
      include: {
        user: true,
      },
    });
  }

  async updateTeacher(id: string, data: UpdateTeacherDto, userId: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (teacher.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this teacher',
      );
    }

    return this.prisma.teacher.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async deleteTeacher(id: string, userId: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (teacher.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this teacher',
      );
    }

    await this.prisma.user.update({
      where: { id: teacher.userId },
      data: { role: 'GUEST' },
    });
    return this.prisma.teacher.delete({ where: { id } });
  }
}

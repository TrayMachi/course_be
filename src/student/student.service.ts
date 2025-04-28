import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterStudentDto, UpdateStudentDto } from './student.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentByCourseId(courseId: string) {
    const students = await this.prisma.enrollment.findMany({
      where: { courseId },
      select: {
        student: {
          select: {
            id: true,
            GPA: true,
            major: true,
            degree: true,
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

    if (!students || students.length === 0) {
      throw new NotFoundException('No students found for this course');
    }
    return students;
  }

  async getStudentById(id: string) {
    const student = await this.prisma.student.findUnique({
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
        Enrollment: {
          select: {
            course: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async registerStudent(data: RegisterStudentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: data.userId },
      data: { role: 'STUDENT' },
    });

    return await this.prisma.student.create({
      data: {
        userId: data.userId,
        GPA: data.GPA,
        major: data.major,
        degree: data.degree,
      },
    });
  }

  async updateStudent(id: string, data: UpdateStudentDto, userId: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this student',
      );
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        GPA: data.GPA ? data.GPA : student.GPA,
        major: data.major ? data.major : student.major,
        degree: data.degree ? data.degree : student.degree,
      },
    });
  }

  async deleteStudent(id: string, userId: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this student',
      );
    }

    await this.prisma.user.update({
      where: { id: student.userId },
      data: { role: 'GUEST' },
    });
    return this.prisma.student.delete({ where: { id } });
  }
}

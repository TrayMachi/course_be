import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateCourseSchema = z.object({
  name: z.string().nonempty('Course name is required'),
  code: z.string().nonempty('Course code is required'),
  teacherId: z.string().nonempty('Teacher ID is required'),
});

export class CreateCourseDto extends createZodDto(CreateCourseSchema) {}

export const UpdateCourseSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  teacherId: z.string().optional(),
});

export class UpdateCourseDto extends createZodDto(UpdateCourseSchema) {}

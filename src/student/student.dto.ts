import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const RegisterStudentSchema = z.object({
  userId: z.string(),
  GPA: z
    .number()
    .min(0, 'GPA must be between 0 and 4')
    .max(4, 'GPA must be between 0 and 4'),
  major: z.string().nonempty('Major is required'),
  degree: z.string().nonempty('Degree is required'),
});

export class RegisterStudentDto extends createZodDto(RegisterStudentSchema) {}

export const UpdateStudentSchema = z.object({
  GPA: z
    .number()
    .min(0, 'GPA must be between 0 and 4')
    .max(4, 'GPA must be between 0 and 4').optional(),
  major: z.string().optional(),
  degree: z.string().optional(),
});

export class UpdateStudentDto extends createZodDto(UpdateStudentSchema) {}

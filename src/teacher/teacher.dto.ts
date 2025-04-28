import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const RegisterTeacherSchema = z.object({
  userId: z.string(),
  department: z.string().nonempty('Department is required'),
});

export class RegisterTeacherDto extends createZodDto(RegisterTeacherSchema) {}

export const UpdateTeacherSchema = z.object({
  department: z.string().nonempty('Department is required'),
});

export class UpdateTeacherDto extends createZodDto(UpdateTeacherSchema) {}

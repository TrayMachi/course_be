import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/,
        'Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.',
      ),
    confirmPassword: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/,
        'Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.',
      ),
    name: z.string().nonempty('Name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password and confirm password do not match',
  });

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().nonempty('Password is required'),
});

export class RegisterDto extends createZodDto(registerSchema) {}
export class LoginDto extends createZodDto(loginSchema) {}

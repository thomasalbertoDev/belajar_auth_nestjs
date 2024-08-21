import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly AUTH: ZodType = z.object({
    username: z
      .string()
      .min(6, 'Username must have a minimum of 6 characters')
      .max(50, 'Username must have a maximum of 50 characters'),

    password: z
      .string()
      .min(8, 'Password must have a minimum of 8 characters')
      .max(255, 'Password must have a maximum of 255 characters'),
  });
}

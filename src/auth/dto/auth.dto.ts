import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthRequest {
  @IsString()
  @MaxLength(50)
  @MinLength(6)
  username: string;

  @IsString()
  @MaxLength(255)
  @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

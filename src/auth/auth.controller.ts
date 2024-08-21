import { Controller, Post, Body, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest, RefreshTokenDto } from './dto/auth.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  public async signUp(@Body() req: AuthRequest): Promise<any> {
    return this.authService.signUp(req);
  }

  @Post('/signin')
  public async signIn(@Body() req: AuthRequest): Promise<any> {
    return this.authService.signIn(req);
  }

  @Post('/refresh-token')
  public async refreshToken(@Body() req: RefreshTokenDto): Promise<any> {
    return this.authService.refreshToken(req);
  }

  @Delete('/logout')
  @UseGuards(AuthGuard)
  public async logout(@Req() req): Promise<any> {
    return this.authService.logout(req.user.id);
  }
}

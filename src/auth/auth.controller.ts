import { Body, Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseUtil } from 'src/common/utils/response.util';
import { LoginDto, RegisterDto } from './auth.dto';
import { RefreshTokenGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    await this.authService.register(body);

    return this.responseUtil.response({
      code: HttpStatus.OK,
      message: `User registered successfully`,
    });
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { accessToken, refreshToken } = await this.authService.login(body);

    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: `User logged in successfully`,
      },
      {
        data: { accessToken, refreshToken },
      },
    );
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@Req() req) {
    await this.authService.logout(req.refreshToken);

    return this.responseUtil.response({
      code: HttpStatus.OK,
      message: `User logged out successfully`,
    });
  }
  
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      req.user.id,
      req.refreshToken,
    );

    return this.responseUtil.response(
      {
        code: HttpStatus.OK,
        message: `Token refreshed successfully`,
      },
      {
        data: { accessToken, refreshToken },
      },
    );
  }
}

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterDto } from '../../application/dtos/register.dto';
import { LoginDto } from '../../application/dtos/login.dto';
import { AuthResponseDto } from '../../application/dtos/auth-response.dto';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { Public } from '../../infrastructure/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.registerUseCase.execute(registerDto);
    
    // Após registro, fazer login automático
    return this.loginUseCase.execute({
      email: registerDto.email,
      password: registerDto.password,
    });
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(loginDto);
  }
}


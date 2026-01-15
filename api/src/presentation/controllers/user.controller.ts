import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}


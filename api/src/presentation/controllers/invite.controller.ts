import { CurrentUser } from "@infrastructure/decorators/current-user.decorator";
import { Controller, Get, Param } from "@nestjs/common";

@Controller('invites')
export class InviteController {
    @Get(':id')
    async listInvites(@Param('id') id: string, @CurrentUser() user: any) {
        
    }
}
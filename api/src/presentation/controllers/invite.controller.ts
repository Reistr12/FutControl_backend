import { CreateInviteDto } from "@application/dtos/create-invite-dto";
import { AcceptInviteUseCase } from "@application/use-cases/invites/accept-invite.usecase";
import { AcceptUserInviteUseCase } from "@application/use-cases/invites/accept-user-invite.usecase";
import { CreateInviteUseCase } from "@application/use-cases/invites/create-invite.usecase";
import { ListInvitesByIdUseCase } from "@application/use-cases/invites/list-invites-by-id.usecase";
import { ListUserInvitesUseCase } from "@application/use-cases/invites/list-user-invites.usecase";
import { CurrentUser } from "@infrastructure/decorators/current-user.decorator";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";

@Controller('invite')
export class InviteController {
    constructor(
        private readonly listInvitesByIdUseCase: ListInvitesByIdUseCase,
        private readonly createInviteUseCase: CreateInviteUseCase,
        private readonly acceptInviteUseCase: AcceptInviteUseCase,
        private readonly listUserInvitesUseCase: ListUserInvitesUseCase,
        private readonly acceptUserInviteUseCase: AcceptUserInviteUseCase,
    ) {}

    @Post(':idOrganization')
    async createInvite(@Param('idOrganization') idOrganization: string, @CurrentUser() user, @Body() email: CreateInviteDto) {
        return await this.createInviteUseCase.execute(idOrganization, user.id, email);
    }

    @Get(':idOrganization')
    async listInvites(@Param('idOrganization') id: string, @CurrentUser() user) {
        return await this.listInvitesByIdUseCase.execute(id, user.id);
    }

    @Post(':idOrganization/:idInvite/accept')
    async acceptInvite(@Param('idInvite') idInvite: string, @Param('idOrganization') idOrganization: string, @CurrentUser() user) {
        return await this.acceptInviteUseCase.execute(idInvite, user.id, idOrganization);
    }

    @Get('user/my-invites')
    async listUserInvites(@CurrentUser() user) {
        return await this.listUserInvitesUseCase.execute(user.id);
    }

    @Post('user/:idInvite/accept')
    async acceptUserInvite(@Param('idInvite') idInvite: string, @CurrentUser() user) {
        return await this.acceptUserInviteUseCase.execute(idInvite, user.id);
    }
}
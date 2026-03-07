import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';
import { PlayerTypeEnum } from '@domain/enums/player-type.enum';

export class AddPlayerToMatchDto {
  @ValidateIf((o) => o.type === PlayerTypeEnum.MEMBER)
  @IsString()
  userId?: string;

  @IsEnum(PlayerTypeEnum)
  type: PlayerTypeEnum;

  @ValidateIf((o) => o.type === PlayerTypeEnum.GUEST)
  @IsString()
  guestName?: string;
}

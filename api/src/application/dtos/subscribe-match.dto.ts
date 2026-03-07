import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PlayerTypeEnum } from '@domain/enums/player-type.enum';

export class SubscribeMatchDto {
  @IsEnum(PlayerTypeEnum)
  type: PlayerTypeEnum;

  @IsOptional()
  @IsString()
  guestName?: string;
}

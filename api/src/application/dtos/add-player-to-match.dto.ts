import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';
import { PaymentMethodEnum } from '@domain/enums/payment-method.enum';

export class AddPlayerToMatchDto {
  @ValidateIf((o) => !o.isGuest)
  @IsString()
  userId?: string;

  @IsBoolean()
  isGuest: boolean;

  @ValidateIf((o) => o.isGuest)
  @IsString()
  guestName?: string;

  @ValidateIf((o) => o.isGuest)
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsBoolean()
  hasPaid?: boolean;

  @IsOptional()
  @IsEnum(PaymentMethodEnum)
  paymentMethod?: PaymentMethodEnum;
}

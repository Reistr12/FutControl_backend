import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethodEnum } from '@domain/enums/payment-method.enum';

export class SubscribeMatchDto {
  @IsOptional()
  @IsString()
  memberId?: string;

  @IsBoolean()
  isGuest: boolean;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsBoolean()
  hasPaid?: boolean;

  @IsOptional()
  @IsEnum(PaymentMethodEnum)
  paymentMethod?: PaymentMethodEnum;
}

import { IsDateString, IsNotEmpty, IsNumber, IsString, Min, IsOptional } from "class-validator";

export class CreateMatchDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(2)
    maxPlayers: number;

    @IsDateString({ strict: true })
    @IsNotEmpty()
    schedule: Date;

    @IsDateString({ strict: true })
    @IsNotEmpty()
    startAt: Date;

    @IsDateString({ strict: true })
    @IsNotEmpty()
    endAt: Date;

    @IsNumber()
    @IsOptional()
    @Min(0)
    maxGuests?: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(2)
    maxTeams: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    playersPerTeam: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    price?: number;
}
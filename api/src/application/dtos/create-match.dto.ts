import { IsDateString, IsNotEmpty, IsNumber, IsString, Min, IsOptional } from "class-validator";

export class CreateMatchDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(2)
    maxPlayers: number;

    @IsDateString({ strict: true })
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsNotEmpty()
    endTime: string;

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

    @IsDateString({ strict: true })
    @IsNotEmpty()
    registrationOpenDate: Date;

    @IsNumber()
    @IsOptional()
    @Min(0)
    price?: number;
}
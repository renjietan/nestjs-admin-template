import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, MinLength, ValidateNested } from "class-validator";
import { CreateWaveDeviceConfigDto } from "./createOne.dto";
import { Type } from "class-transformer";

export class BatchCreateWaveDeviceConfigDto {
  @ArrayMinSize(1)
  @ApiProperty({name: 'list', type: [CreateWaveDeviceConfigDto]})
  list: CreateWaveDeviceConfigDto[]
}
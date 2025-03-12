import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, MinLength, ValidateNested } from "class-validator";
import { UpdateWaveDeviceConfigDto } from "./updateOne.dto";

export class BatchUpdateWaveDeviceConfigDto {
  @ArrayMinSize(1)
  @ApiProperty({name: 'list', type: [UpdateWaveDeviceConfigDto]})
  list: UpdateWaveDeviceConfigDto[]
}
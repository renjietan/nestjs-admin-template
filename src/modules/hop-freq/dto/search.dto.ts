import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PagerDto } from "~/common/dto/pager.dto";

export class SearchHFDto extends PagerDto {
    @IsOptional()
    @ApiProperty({ description: "别名", example: "别名" })
    alias?: string;
  
    @IsOptional()
    @ApiProperty({ description: "类型", example: "VHF" })
    type?: string;
}
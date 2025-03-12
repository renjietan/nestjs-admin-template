import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { PagerDto } from "~/common/dto/pager.dto";

export class SearchPShotMessageDto extends PagerDto {
    @IsOptional()
    @ApiProperty({ description: "短信内容", example: '短信内容' })
    text_message?: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PagerDto } from "~/common/dto/pager.dto";

export class SearchEncryptDto extends PagerDto {
  @IsNotEmpty()
  @ApiProperty({ description: "表ID", example: 1})
  table_id: number;
}

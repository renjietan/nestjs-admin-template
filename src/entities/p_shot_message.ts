import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";

@Entity("p_shot_message")
export class PShotMessageEntity  extends CompleteEntity{
  @ApiProperty()
  @Column("text", { name: "text_message" })
  text_message: string;
}

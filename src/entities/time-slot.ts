import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive } from "class-validator";
import { Column, Entity } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";

@Entity("time-slot")
export class TimeSlotEntity extends CompleteEntity {
  @ApiProperty({ description: "名称", example: "名称" })
  @IsNotEmpty()
  @Column("varchar", { name: "name", comment: "名称" })
  name: string;

  @ApiProperty({ description: "电台", example: 80 })
  @IsNotEmpty()
  @IsPositive()
  @Column("int", { name: "radio", comment: "电台" })
  radio: number;

  @Column("simple-array", { name: "points", comment: "值 集合", nullable: false })
  points: string[];
}

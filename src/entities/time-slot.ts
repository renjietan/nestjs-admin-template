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

  @ApiProperty({ description: "最小值", example: 1 })
  @IsNotEmpty()
  @IsPositive()
  @Column("int", { name: "from", comment: "最小值" })
  from: number;

  @ApiProperty({ description: "最小值", example: 30 })
  @IsNotEmpty()
  @IsPositive()
  @Column("int", { name: "to", comment: "最大值" })
  to: number;

  @Column("simple-array", { name: "points", comment: "值 集合", nullable: false })
  points: string[];
}

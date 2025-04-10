import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { SubEntity } from "./t_sub";

@Entity("t_sub_slot")
export class SubTimeSlotEntity extends CompleteEntity {
  @IsNotEmpty()
  @ApiProperty({ description: '表名', example: "时隙表名" })
  @Column("varchar", { name: "name", comment: '调频表别名' })
  name: string; 

  @IsNotEmpty()
  @ApiProperty({ description: '数量', example: 240 })
  @Column("int", { name: "count", comment: "数量" })
  count: number

  @IsNotEmpty()
  @ApiProperty({ description: '电台', example: 80 })
  @Column("int", { name: "radio", comment: '电台' })
  radio: number

  @IsNotEmpty()
  @Column("simple-array",{  name: "points", comment: "频点集合" })
  points: number[];

  @ManyToOne(() => SubEntity, (sub) => sub.time_slots, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'subId' })
  sub: SubEntity
}
  
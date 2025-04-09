import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { SubEntity } from "./t_sub";

@Entity("t_sub_hop")
export class SubHopEntity extends CompleteEntity {
  @IsNotEmpty()
  @ApiProperty({ description: '调频表别名', example: "调频表别名" })
  @Column("varchar", { name: "alias", comment: '调频表别名' })
  alias: string;

  @IsNotEmpty()
  @ApiProperty({ description: '调频表类型 字典表-code码', example: 1 })
  @Column("varchar", { name: "type", comment: '调频表类型 字典表-code码' })
  type: string;

  @IsNotEmpty()
  @Column("simple-array",{  name: "points", comment: "频点集合" })
  points: number[];

  @ManyToOne(() => SubEntity, (sub) => sub.hops, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'subId' })
  sub: SubEntity
}
 
import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { SubEntity } from "./t_sub";

@Entity("t_sub_hop")
export class SubHopEntity extends CompleteEntity {
  @IsNotEmpty()
  @Column("simple-array",{  name: "points", comment: "秘钥集合" })
  points: string[];

  @ManyToOne(() => SubEntity, (sub) => sub.hops, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'subId' })
  sub: SubEntity
}
 
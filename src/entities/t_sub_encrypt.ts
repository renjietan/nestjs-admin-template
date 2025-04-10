import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CompleteEntity } from "~/common/entity/common.entity";
import { SubEntity } from "./t_sub";

@Entity("t_sub_encrypt")
export class SubEncryptEntity extends CompleteEntity {
  @IsNotEmpty()
  @ApiProperty({ description: '秘钥表名称', example: "秘钥表名称" })
  @Column("varchar", { name: "name", comment: '秘钥表名称' })
  name: string

  @IsNotEmpty()
  @ApiProperty({ description: '波形', example: "VHF" })
  @Column("varchar", { name: "waveType", comment: '波形' })
  waveType: string

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: '生效时间', example: "2025-03-03" })
  @Column("varchar", { name: "startTime", comment: '生效时间' })
  startTime: string

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: '调频表别名', example: "2025-03-03" })
  @Column("varchar", { name: "endTime", comment: '失效时间' })
  endTime: string

  @Column("simple-array",{  name: "points", comment: "秘钥集合" })
  points: string[];

  @ManyToOne(() => SubEntity, (sub) => sub.encrypts, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'subId' })
  sub: SubEntity
}
 
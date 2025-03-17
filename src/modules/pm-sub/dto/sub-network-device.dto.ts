import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { IpAddressField } from "~/common/decorators/field.decorator";
import { Exact } from "~/common/dto/pager.dto";

export class SubNetWorkDeviceDto {
  @IpAddressField({ required: true })
  @ApiProperty({
    description: "任务规划-主任务-ip地址",
    example: "192.168.1.1",
  })
  ip_addr: string;

  @IpAddressField({ required: true })
  @ApiProperty({
    description: "任务规划-主任务-网关地址",
    example: "255.255.255.0",
  })
  network_addr: string;

  @IsNotEmpty()
  @ApiProperty({ description: "任务规划-子任务-私有配置", example: "{obj: 1}" })
  private_conf: string;

  @IsNumber()
  @IsNotEmpty()
  @IsEnum(Exact)
  @ApiProperty({ description: "任务规划-子任务-是否为master", enum: Exact })
  isMaster: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "任务规划-子任务-设备ID", example: 1 })
  device_id: number;
}

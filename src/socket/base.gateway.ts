import type { Socket } from 'socket.io'

import { ErrorEnum } from '~/constants/error-code.constant'
import { BusinessEvents } from './business-event.constant'

export abstract class BaseGateway {
  public gatewayMessageFormat(
    type: BusinessEvents,
    message: any,
    code?: number,
  ) {
    return {
      type,
      data: message,
      code,
    }
  }

  handleDisconnect(client: Socket) {
    client.send(
      this.gatewayMessageFormat(BusinessEvents.GATEWAY_CONNECT, ErrorEnum.WebSocketDisconnected),
    )
  }

  handleConnect(client: Socket) {
    client.send(
      this.gatewayMessageFormat(BusinessEvents.GATEWAY_CONNECT, ErrorEnum.WebSocketConnected),
    )
  }
}

export abstract class BroadcastBaseGateway extends BaseGateway {
  broadcast(event: BusinessEvents, data: any) {}
}

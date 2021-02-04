import { RedisSocketEventEmitDTO } from './RedisSocketEventEmitDTO';

export class RedisSocketEventSendDTO extends RedisSocketEventEmitDTO {
  public readonly userId: string;

  public readonly socketId: string;
}

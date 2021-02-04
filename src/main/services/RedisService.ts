import { Inject, Injectable, Logger } from '@nestjs/common';
import { Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import IoredisAux from 'ioredis-aux';
import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from '../providers/RedisProvider/RedisConstants';

export interface RedisSubscribeMessage {
  readonly message: string;
  readonly channel: string;
}

@Injectable()
export class RedisService {
  private logger = new Logger('RedisService');

  public constructor(
    @Inject(REDIS_SUBSCRIBER_CLIENT)
    private readonly redisSubscriberClient: IoredisAux,
    @Inject(REDIS_PUBLISHER_CLIENT)
    private readonly redisPublisherClient: IoredisAux,
  ) {}

  public fromEvent<T>(eventName: string): Observable<T> {
    this.redisSubscriberClient.client.subscribe(eventName);

    return new Observable((observer: Observer<RedisSubscribeMessage>) =>
      this.redisSubscriberClient.client.on('message', (channel, message) =>
        observer.next({ channel, message }),
      ),
    ).pipe(
      filter(({ channel }) => channel === eventName),
      map(({ message }) => JSON.parse(message)),
    );
  }

  public get memoize() {
    return this.redisPublisherClient.memoize;
  }

  public get find() {
    return this.redisPublisherClient.find;
  }

  public get findOne() {
    return this.redisPublisherClient.findOne;
  }

  public get delete() {
    return this.redisPublisherClient.delete;
  }

  public get saveOrUpdate() {
    return this.redisPublisherClient.saveOrUpdate;
  }

  public async set(
    key: string,
    value: unknown,
    expireMode?: 'EX' | 'PX',
    expiresIn?: number,
  ): Promise<boolean> {
    try {
      if (expireMode && expiresIn) {
        return !!(await this.redisPublisherClient.client.set(
          key,
          JSON.stringify(value),
          expireMode,
          expiresIn,
        ));
      }

      return !!(await this.redisPublisherClient.client.set(
        key,
        JSON.stringify(value),
      ));
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  public async get<T>(key: string): Promise<T | false> {
    try {
      const getted = await this.redisPublisherClient.client.get(key);
      return JSON.parse(getted) as T;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  public async publish(channel: string, value: unknown): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.redisPublisherClient.client.publish(
        channel,
        JSON.stringify(value),
        (error, reply) => {
          if (error) {
            return reject(error);
          }

          return resolve(reply);
        },
      );
    });
  }
}

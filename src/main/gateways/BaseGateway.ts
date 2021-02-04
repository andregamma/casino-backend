import { from } from 'rxjs';
import { map } from 'rxjs/operators';

export class BaseGateway {
  protected eventPrefix = '';

  protected asPipe(event: string, data: Array<any>) {
    return from([data]).pipe(
      map((data) => ({ event: `${this.eventPrefix}:${event}`, data })),
    );
  }

  protected event(eventName: string, data: any, withPrefix = true) {
    const event = withPrefix ? `${this.eventPrefix}:${eventName}` : eventName;
    return { event, data };
  }

  protected error(message: string) {
    return { event: `${this.eventPrefix}:error`, data: message };
  }
}

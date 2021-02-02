import { Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
import { EventsGateway } from './events.gateway';
import { DiceGateway } from './games/dice.gateway';

@Module({
  providers: [EventsGateway, DiceGateway],
  imports: [ProfileModule],
})
export class EventsModule {}

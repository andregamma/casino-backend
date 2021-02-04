import { Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
import { TablesModule } from '../tables/tables.module';
import { EventsGateway } from './events.gateway';
import { BlackjackGateway } from './games/blackjack.gateway';
import { DiceGateway } from './games/dice.gateway';

@Module({
  providers: [EventsGateway, DiceGateway, BlackjackGateway],
  imports: [ProfileModule, TablesModule],
})
export class EventsModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { AuthModule } from '../auth/auth.module';


@Module({
    imports: [ConfigModule, AuthModule],
    controllers: [EpisodesController],
    providers: [EpisodesService],
})
export class EpisodesModule {}

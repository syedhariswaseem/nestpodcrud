import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import type { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { JwtCookieGuard } from '../common/guards/jwt-cookie.guard';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('episodes')
@ApiCookieAuth('access_token')
@UseGuards(JwtCookieGuard)
@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get()
  findAll(@Query('sort') sort: 'asc' | 'desc' = 'desc'): Episode[] {
    return this.episodesService.findAll(sort);
  }

  @Get('featured')
  findFeatured(): Episode[] {
    return this.episodesService.findFeatured();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Episode {
    return this.episodesService.findOne(id);
  }

  @Post()
  create(@Body() input: CreateEpisodeDto): Episode {
    return this.episodesService.create(input);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateEpisodeDto): Episode {
    return this.episodesService.update(id, input);
  }

  @Delete(':id')
  remove(@Param('id') id: string): { deleted: true } {
    return this.episodesService.remove(id);
  }
}

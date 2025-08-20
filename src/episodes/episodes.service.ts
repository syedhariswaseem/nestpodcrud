import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Episode } from './entities/episode.entity';

@Injectable()
export class EpisodesService {
    private episodes: Episode[] = [];
    private nextId = 1;

    constructor() {
        const now = new Date();
        this.episodes = [
            {
                id: String(this.nextId++),
                title: 'Welcome to the Podcast',
                description: 'Introduction and what to expect.',
                featured: true,
                publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7),
                createdAt: now,
                updatedAt: now,
            },
            {
                id: String(this.nextId++),
                title: 'Deep Dive into NestJS',
                description: 'Discussing providers, modules, and controllers.',
                featured: false,
                publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3),
                createdAt: now,
                updatedAt: now,
            },
        ];
    }

    findAll(sort: 'asc' | 'desc' = 'desc', limit: number = 10): Episode[] {
        const sorted = [...this.episodes].sort((a, b) =>
            a.publishedAt.getTime() - b.publishedAt.getTime(),
        );
        const limited = sorted.slice(0, limit);
        return sort === 'asc' ? limited : limited.reverse();
    }

    findFeatured(): Episode[] {
        return this.findAll('desc').filter((e) => e.featured);
    }

    findOne(id: string): Episode {
        const episode = this.episodes.find((e) => e.id === id);
        if (!episode) {
            throw new NotFoundException(`Episode ${id} not found`);
        }
        return episode;
    }

    create(input: { title: string; description?: string; featured?: boolean; publishedAt?: string }): Episode {
        const title: unknown = input?.title;
        if (typeof title !== 'string' || title.trim().length === 0) {
            throw new BadRequestException('title is required');
        }

        const now = new Date();
        const publishedAt = this.parseDateOrNow(input?.publishedAt, now);
        const featured = Boolean(input?.featured);

        const episode: Episode = {
            id: String(this.nextId++),
            title: title.trim(),
            description: this.normalizeOptionalString(input?.description),
            featured,
            publishedAt,
            createdAt: now,
            updatedAt: now,
        };
        this.episodes.push(episode);
        return episode;
    }

    update(id: string, input: { title?: string; description?: string; featured?: boolean; publishedAt?: string }): Episode {
        const episode = this.findOne(id);
        const now = new Date();

        if (input?.title !== undefined) {
            const title: unknown = input.title;
            if (typeof title !== 'string' || title.trim().length === 0) {
                throw new BadRequestException('title must be a non-empty string');
            }
            episode.title = title.trim();
        }

        if (input?.description !== undefined) {
            episode.description = this.normalizeOptionalString(input.description);
        }

        if (input?.featured !== undefined) {
            episode.featured = Boolean(input.featured);
        }

        if (input?.publishedAt !== undefined) {
            episode.publishedAt = this.parseDateOrThrow(input.publishedAt);
        }

        episode.updatedAt = now;
        return episode;
    }

    remove(id: string): { deleted: true } {
        const index = this.episodes.findIndex((e) => e.id === id);
        if (index === -1) {
            throw new NotFoundException(`Episode ${id} not found`);
        }
        this.episodes.splice(index, 1);
        return { deleted: true };
    }

    private normalizeOptionalString(value: unknown): string | undefined {
        if (typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }

    private parseDateOrNow(value: unknown, fallback: Date): Date {
        if (!value) return fallback;
        return this.parseDateOrThrow(value);
    }

    private parseDateOrThrow(value: unknown): Date {
        if (value instanceof Date) return value;
        if (typeof value === 'number') return new Date(value);
        if (typeof value === 'string') {
            const parsed = new Date(value);
            if (!isNaN(parsed.getTime())) return parsed;
        }
        throw new BadRequestException('publishedAt must be a valid date');
    }
}

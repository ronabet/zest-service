import { Module } from '@nestjs/common';
import { ReposModule } from './repos/repos.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store'
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  CacheModule.registerAsync({
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      ttl: configService.get('CACHE_TTL'),
      store: (await redisStore({
        url: configService.get('REDIS_URL'),
      })) as unknown as CacheStore,
    }),
    inject: [ConfigService],
  }),
  ReposModule, FavoritesModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ReposModule } from './repos/repos.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({
    isGlobal: true,
    store: 'memory',
  }),
  ReposModule, FavoritesModule],
})
export class AppModule {}

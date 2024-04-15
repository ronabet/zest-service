import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ReposService } from 'src/repos/repos.service';
import { ReposModule } from 'src/repos/repos.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ReposModule, HttpModule],
  providers: [FavoritesService, ReposService],
  controllers: [FavoritesController]
})
export class FavoritesModule {}

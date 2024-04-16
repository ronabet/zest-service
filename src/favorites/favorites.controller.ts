import { Controller, Post, Body, Delete, Param, HttpException, HttpStatus, Get, Req, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorite.entity';
import { CreateFavoriteDto } from 'src/common/dtos/add-user-favorite.dto';
import { Repository } from 'src/common/interfaces/repository.interface';
import { SortOrder } from 'src/common/interfaces/utils';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites(@Query('userId') userId: number) {
    return this.favoritesService.findByUserId(userId);
  }

  @Get('/sort')
  getSortedFavorites(@Query('userId') userId: number, @Query('sort') sort: SortOrder) {
    return this.favoritesService.findAndSortByUserId(userId, sort);
  }

  @Post('add')
  async addFavorite(@Body() favoriteData: CreateFavoriteDto): Promise<Repository> {
    const favorite = new Favorite(favoriteData.userId, favoriteData.repoId);
    return this.favoritesService.addFavorite(favoriteData.userId, favorite);
  }

  @Delete()
  async removeFavorite(@Query('userId') userId: number, @Query('repoId') repoId: number) {
    const result = await this.favoritesService.removeFavorite(userId, repoId);
    if (!result) {
      throw new HttpException(`RepoId: ${repoId} not found`, HttpStatus.NOT_FOUND);
    }
    return { message: `RepoId: ${repoId} removed successfully` };
  }
}


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
    // Assuming Favorite class is correctly defined elsewhere with appropriate constructor
    const favorite = new Favorite(favoriteData.userId, favoriteData.repoId);
    return this.favoritesService.addFavorite(favoriteData.userId, favorite);
  }

  @Delete(':userId/:id')
  removeFavorite(@Param('userId') userId: number, @Param('id') id: number) {
    const result = this.favoritesService.removeFavorite(userId, id);
    if (!result) {
      throw new HttpException('Favorite repo not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Favorite removed successfully' };
  }
}


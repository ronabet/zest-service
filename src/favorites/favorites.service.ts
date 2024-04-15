import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Favorite } from './favorite.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ReposService } from '../repos/repos.service';
import { SortOrder } from '../common/interfaces/utils';
import { Repository } from '../common/interfaces/repository.interface';

@Injectable()
export class FavoritesService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, 
  private reposService: ReposService) {}


  async findByUserId(userId: number): Promise<Record<number, Repository>> {
    const userIdKey = userId.toString();
    const userFavorites = await this.cacheManager.get<Record<number, Repository>>(userIdKey) || {};

    return userFavorites;
  }

  private sortRepositoriesByStars(repositories: Record<number, Repository>, sortOrder: SortOrder = SortOrder.Desc): Repository[] {
    const repoArray = Object.values(repositories);

    repoArray.sort((a, b) => {
      if (sortOrder === SortOrder.Desc) {
        return b.stargazers_count - a.stargazers_count;
      } else {
        return a.stargazers_count - b.stargazers_count;
      }
    });

    return repoArray;
}

  async findAndSortByUserId(userId: number, sort: SortOrder = SortOrder.Desc): Promise<Repository[]> {
    const userIdKey = userId.toString();
    const userFavorites = await this.cacheManager.get<Record<number, Repository>>(userIdKey) || {};

    const sortedUserFavorites = this.sortRepositoriesByStars(userFavorites, sort)

    return sortedUserFavorites;
  }

  async addFavorite(userId: number, favorite: Favorite): Promise<Repository> {
    const userFavoritesKey = userId.toString();
    const userFavorites = await this.findByUserId(userId);

    // Check if the favorite already exists to prevent duplicates
    if (userFavorites && userFavorites[favorite.repoId]) {
      return userFavorites[favorite.repoId];
    }

    // Retrieve and update the favorite in the cache
    const repos = await this.reposService.getAllTopRepos();
    
    if (!repos[favorite.repoId]) {
      throw new HttpException('Favorite repository not found', HttpStatus.BAD_REQUEST);
    }

    userFavorites[favorite.repoId] = repos[favorite.repoId];
    await this.cacheManager.set(userFavoritesKey, userFavorites);

    return userFavorites[favorite.repoId];;
}
  

  async removeFavorite(userId: number, repoId: number): Promise<boolean> {
    const favoritesKey = userId.toString();
    const favorites = await this.findByUserId(userId);

    if (favorites[repoId]) {
      delete favorites[repoId];
      await this.cacheManager.set(favoritesKey, favorites);
      return true;
    }

    return false;
  }
}


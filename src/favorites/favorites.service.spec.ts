import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ReposService } from '../repos/repos.service';
import { SortOrder } from '../common/interfaces/utils';
import { HttpException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let cacheManager: any;
  let reposService: any;

  beforeEach(async () => {
    // Mock cache manager and repos service
    const cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const reposServiceMock = {
      getAllTopRepos: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
        {
          provide: ReposService,
          useValue: reposServiceMock,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    cacheManager = module.get(CACHE_MANAGER);
    reposService = module.get(ReposService);
  });

  describe('findAndSortByUserId', () => {
    it('should return sorted repositories by stargazers count in descending order', async () => {
      const userId = 1;
      const userFavorites = {
        100: { id: 100, stargazers_count: 150 },
        101: { id: 101, stargazers_count: 250 },
      };

      cacheManager.get.mockResolvedValue(userFavorites);
      const sortedFavorites = await service.findAndSortByUserId(userId, SortOrder.Desc);
      expect(sortedFavorites[0].id).toEqual(101);
      expect(sortedFavorites[1].id).toEqual(100);
    });
  });

  describe('addFavorite', () => {
    it('should add a favorite repository if it does not exist', async () => {
      const userId = 1;
      const favorite = { userId, repoId: 102 };
      const repos = { 102: { repoId: 102, stargazers_count: 200 } };

      cacheManager.get.mockResolvedValue({});
      reposService.getAllTopRepos.mockResolvedValue(repos);

      await service.addFavorite(userId, favorite);
      expect(cacheManager.set).toHaveBeenCalledWith(userId.toString(), { 102: repos[102] });
    });

    it('should throw HttpException if the repository is not found', async () => {
      const userId = 1;
      const favorite = { userId, repoId: 103 };

      cacheManager.get.mockResolvedValue({});
      reposService.getAllTopRepos.mockResolvedValue({});

      await expect(service.addFavorite(userId, favorite)).rejects.toThrow(HttpException);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite repository if it exists', async () => {
      const userId = 1;
      const repoId = 102;
      const favorites = { 102: { repoId: 102, stargazers_count: 200 } };

      cacheManager.get.mockResolvedValue(favorites);

      const result = await service.removeFavorite(userId, repoId);
      expect(result).toBeTruthy();
      expect(cacheManager.set).toHaveBeenCalledWith(userId.toString(), {});
    });

    it('should return false if the favorite does not exist', async () => {
      const userId = 1;
      const repoId = 105;

      cacheManager.get.mockResolvedValue({});

      const result = await service.removeFavorite(userId, repoId);
      expect(result).toBeFalsy();
    });
  });
});

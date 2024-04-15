import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { SortOrder } from '../common/interfaces/utils';

@Injectable()
export class ReposService {
  private readonly cacheKey = 'top-repos';

  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getTopRepos(page: number = 1) {
    try {
      // Attempt to fetch the entire current cache for repositories
      let allRepos = await this.cacheManager.get<{[id: string]: any}>(this.cacheKey) || {};

      const response = await this.fetchFromGitHub(this.buildGitHubApiUrl(page, SortOrder.Desc));
      const newRepos = this.processRepositories(response.data.items);

      allRepos = { ...allRepos, ...newRepos };

      // Update the cache with the merged data
      await this.cacheManager.set(this.cacheKey, allRepos);
      
      return { total_count: Object.keys(allRepos).length, items: response.data.items };
    } catch (error) {
      this.handleFetchError(error);
    }
  }

  async getAllTopRepos() {
    let allRepos = await this.cacheManager.get<{[id: string]: any}>(this.cacheKey);
    if (!allRepos) {
      this.getTopRepos();
    }

    return allRepos;
  }

  private buildGitHubApiUrl(page: number, order: SortOrder): string {
    return `https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=${order}&page=${page}`;
  }

  private async fetchFromGitHub(url: string) {
    return await this.httpService.axiosRef.get(url);
  }

  private processRepositories(items: any[]): {[key: string]: any} {
    const repos = {};
    items.forEach(item => {
      repos[item.id] = item;
    });
    return repos;
  }

  private handleFetchError(error) {
    const errorMessage = `Failed to fetch top repositories: ${error.response?.data?.message || error.message}`;
    Logger.error('Failed to fetch top repositories', errorMessage);
    throw new Error(errorMessage);
  }
}

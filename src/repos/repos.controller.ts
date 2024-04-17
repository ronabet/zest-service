import { Controller, Get, Query } from '@nestjs/common';
import { ReposService } from './repos.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('repo')
export class ReposController {
  constructor(private reposService: ReposService) {}

  @Get('top')
  @ApiResponse({ status: 200, description: 'Get top ranked github repos by page (default is 1)' })
  getTopRepos(@Query('page') page: number) {
    return this.reposService.getTopRepos(page);
  }
}

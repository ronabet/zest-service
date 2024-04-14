import { Controller, Get, Query } from '@nestjs/common';
import { ReposService } from './repos.service';

@Controller('repo')
export class ReposController {
  constructor(private reposService: ReposService) {}

  @Get('top')
  getTopRepos(@Query('page') page: number) {
    return this.reposService.getTopRepos(page);
  }
}

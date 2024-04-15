export class Favorite {
  userId: number;
  repoId: number;

  constructor(userId: number, repoId: number) {
    this.userId = userId;
    this.repoId = repoId;
  }
}
  
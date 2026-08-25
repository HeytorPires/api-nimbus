import { v4 as uuidv4 } from 'uuid';
import {
  IUserTokensRepository,
  ICreateUserToken,
} from '@modules/users/domain/repositories/IUserTokensRepository';
import { IUserToken } from '@modules/users/domain/models/IUserToken';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class FakeUserTokenRepository implements IUserTokensRepository {
  private users: IUserToken[] = [];

  public async generate(userId: string): Promise<UserToken> {
    const userToken = new UserToken();

    userToken.id = uuidv4();
    userToken.token = uuidv4();
    userToken.userId = userId;
    userToken.createdAt = new Date();
    userToken.updatedAt = new Date();

    this.users.push(userToken);

    return userToken;
  }

  public async save(data: ICreateUserToken): Promise<IUserToken> {
    const userToken = new UserToken();

    userToken.id = uuidv4();
    userToken.token = data.token;
    userToken.userId = data.userId;
    userToken.createdAt = new Date();
    userToken.updatedAt = new Date();

    this.users.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<IUserToken | undefined> {
    const user = this.users.find((user) => user.token === token);
    return user;
  }

  public async findByUserId(userId: string): Promise<IUserToken | undefined> {
    const user = this.users.find((user) => user.userId === userId);
    return user;
  }

  public async deleteByToken(token: string): Promise<void> {
    this.users = this.users.filter((user) => user.token !== token);
  }

  public async removeByUserId(userId: string): Promise<void> {
    this.users = this.users.filter((user) => user.userId !== userId);
  }
}

export default FakeUserTokenRepository;

import { v4 as uuidv4 } from 'uuid';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import { IUserToken } from '@modules/users/domain/models/IUserToken';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class FakeUserTokenRepository implements IUserTokensRepository {
  private users: IUserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    userToken.id = uuidv4();
    userToken.token = uuidv4();
    userToken.user_id = user_id;
    userToken.created_at = new Date();
    userToken.updated_at = new Date();

    this.users.push(userToken);

    return userToken;
  }

  public async save(user: IUserToken): Promise<IUserToken> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id
    );

    this.users[findIndex] = user;

    return user;
  }

  public async findByToken(token: string): Promise<IUserToken | undefined> {
    const user = this.users.find((user) => user.token === token);
    return user;
  }
}

export default FakeUserTokenRepository;

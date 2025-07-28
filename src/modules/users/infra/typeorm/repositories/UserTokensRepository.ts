import { getRepository, Repository } from 'typeorm';
import { IUserToken } from '../../../domain/models/IUserToken';
import { IUserTokensRepository } from '../../../domain/repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;
  constructor() {
    this.ormRepository = getRepository(UserToken);
  }
  public async save(user: IUserToken): Promise<IUserToken> {
    await this.ormRepository.save(user);
    return user;
  }
  public async findByToken(token: string): Promise<IUserToken | undefined> {
    const userToken = await this.ormRepository.findOne({ where: { token } });
    return userToken;
  }
  public async generate(user_id: string): Promise<IUserToken> {
    const userToken = await this.ormRepository.create({ user_id });

    await this.ormRepository.save(userToken);
    return userToken;
  }
}

export default UserTokensRepository;

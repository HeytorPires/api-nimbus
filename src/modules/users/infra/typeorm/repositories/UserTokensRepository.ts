import { getRepository, Repository } from 'typeorm';
import { IUserToken } from '../../../domain/models/IUserToken';
import {
  IUserTokensRepository,
  ICreateUserToken,
} from '../../../domain/repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;
  constructor() {
    this.ormRepository = getRepository(UserToken);
  }
  public async save(data: ICreateUserToken): Promise<IUserToken> {
    const userToken = this.ormRepository.create(data);
    await this.ormRepository.save(userToken);
    return userToken;
  }
  public async findByToken(token: string): Promise<IUserToken | undefined> {
    const userToken = await this.ormRepository.findOne({ where: { token } });
    return userToken;
  }
  public async findByUserId(user_id: string): Promise<IUserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { user_id },
      order: { created_at: 'DESC' },
    });
    return userToken;
  }
  public async deleteByToken(token: string): Promise<void> {
    await this.ormRepository.delete({ token });
  }
  public async generate(user_id: string): Promise<IUserToken> {
    const userToken = await this.ormRepository.create({ user_id });

    await this.ormRepository.save(userToken);
    return userToken;
  }
  public async removeByUserId(user_id: string): Promise<void> {
    await this.ormRepository.delete({ user_id });
  }
}

export default UserTokensRepository;

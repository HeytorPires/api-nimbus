import { getRepository, Repository } from 'typeorm';
import { IUserToken } from '../../../domain/models/IUserToken';
import {
  IUserTokensRepository,
  ICreateUserToken,
} from '../../../domain/repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private readonly ormRepository: Repository<UserToken>;
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
  public async findByUserId(userId: string): Promise<IUserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return userToken;
  }
  public async deleteByToken(token: string): Promise<void> {
    await this.ormRepository.delete({ token });
  }
  public async generate(userId: string): Promise<IUserToken> {
    const userToken = this.ormRepository.create({ userId });

    await this.ormRepository.save(userToken);
    return userToken;
  }
  public async removeByUserId(userId: string): Promise<void> {
    await this.ormRepository.delete({ userId });
  }
}

export default UserTokensRepository;

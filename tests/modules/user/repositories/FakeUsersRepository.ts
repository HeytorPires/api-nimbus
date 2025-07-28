import { v4 as uuidv4 } from 'uuid';
import { ICreateUser } from '../../../../src/modules/users/domain/models/ICreateUser';
import { IUserRepository } from '../../../../src/modules/users/domain/repositories/IUserRepository';
import User from '../../../../src/modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const user = new User();

    user.id = uuidv4();
    user.name = name;
    user.email = email;
    user.password = password;

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id
    );

    this.users[findIndex] = user;

    return user;
  }

  public async remove(user: User): Promise<void> {}

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async list(): Promise<User[] | undefined> {
    return this.users;
  }

  public async findByName(name: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.name === name);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }
}

export default FakeUsersRepository;

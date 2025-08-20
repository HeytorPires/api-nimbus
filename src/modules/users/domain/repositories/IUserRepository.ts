import User from '@modules/users/infra/typeorm/entities/User';
import { ICreateUser } from '../models/ICreateUser';

export interface IUserRepository {
  findByName(name: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  list(): Promise<User[] | undefined>;
  create(data: ICreateUser): Promise<User>;
  save(customer: User): Promise<User>;
  remove(customer: User): Promise<void>;
}

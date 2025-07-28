import { v4 as uuidv4 } from 'uuid';
import Customer from '../../../src/modules/customers/infra/typeorm/entities/Customer';

import {
  ICustomerRepository,
  SearchParams,
} from '../../../src/modules/customers/domain/repositories/ICustomerRepository';
import { ICreateCustomer } from '../../../src/modules/customers/domain/models/ICreateCustomer';
import { IPaginateCustomer } from '../../../src/modules/customers/domain/models/IPaginateCustomer';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';

class FakeCustomersRepository
  implements Omit<ICustomerRepository, 'remove' | 'findAll' | 'list'>
{
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer = new Customer();

    customer.id = uuidv4();
    customer.name = name;
    customer.email = email;

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<ICustomer> {
    const findIndex = this.customers.findIndex(
      (findCustomer) => findCustomer.id === customer.id
    );
    this.customers[findIndex] = customer;

    return customer;
  }
  public async remove(customer: Customer): Promise<void> {}

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IPaginateCustomer | undefined> {
    const start = skip;
    const end = skip + take;

    const paginated = this.customers.slice(start, end);

    const total = this.customers.length;
    const totalPages = Math.ceil(total / take);

    return {
      from: start + 1,
      to: Math.min(end, total),
      per_page: take,
      total,
      current_page: page,
      prev_page: page > 1 ? page - 1 : null,
      next_page: page < totalPages ? page + 1 : null,
      data: paginated,
    };
  }
  public async findByName(name: string): Promise<ICustomer | undefined> {
    const customer = this.customers.find((c) => c.name === name);
    return customer;
  }
  public async findById(id: string): Promise<ICustomer | undefined> {
    const customer = this.customers.find((c) => c.id === id);
    return customer;
  }
  public async findByEmail(email: string): Promise<ICustomer | undefined> {
    const customer = this.customers.find((c) => c.email === email);
    return customer;
  }
}

export default FakeCustomersRepository;

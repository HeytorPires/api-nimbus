import 'reflect-metadata';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import AppError from '@shared/errors/AppError';
import ListCustomerService from '@modules/customers/services/ListCustomersService';
import FakeCustomersRepository from '../repositories/FakeCustomersRepositorys';

let fakeCustomersRepository: FakeCustomersRepository;
let ListCustomer: ListCustomerService;
let CreateCustomer: CreateCustomerService;
describe('List Customer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    ListCustomer = new ListCustomerService(fakeCustomersRepository);
    CreateCustomer = new CreateCustomerService(fakeCustomersRepository);
  });
  it('should not list customers when none exist ', async () => {
    const page = 1;
    const limit = 10;

    await expect(ListCustomer.execute({ page, limit })).rejects.toBeInstanceOf(
      AppError
    );
  });
  it('should be able to list all customers', async () => {
    const page = 1;
    const limit = 10;
    await CreateCustomer.execute({
      name: 'João silva',

      email: 'João@gmail.com',
    });
    const customers = await ListCustomer.execute({ page, limit });
    expect(customers.data).not.toHaveLength(0);
  });
});

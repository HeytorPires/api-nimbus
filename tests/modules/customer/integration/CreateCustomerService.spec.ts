import 'reflect-metadata';
import FakeCustomersRepository from '../repositories/FakeCustomersRepositorys';
import CreateCustomerService from '../../../../src/modules/customers/services/CreateCustomerService';
import AppError from '../../../../src/shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let CreateCustomer: CreateCustomerService;
describe('Create Customer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    CreateCustomer = new CreateCustomerService(fakeCustomersRepository);
  });

  it('should be able to create a new customer', async () => {
    const customer = await CreateCustomer.execute({
      name: 'João silva',
      email: 'João@gmail.com',
    });

    expect(customer).toHaveProperty('id');
  });
  it('should not be able to create two customers with the same email', async () => {
    const customer = await CreateCustomer.execute({
      name: 'João Silva',
      email: 'joao@gmail.com',
    });
    const { email } = customer;
    await expect(
      CreateCustomer.execute({
        name: 'João Silva',
        email,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

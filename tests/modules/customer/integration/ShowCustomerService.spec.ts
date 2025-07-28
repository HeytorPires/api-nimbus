import 'reflect-metadata';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import AppError from '@shared/errors/AppError';
import ShowCustomerService from '@modules/customers/services/ShowCustomerService';
import FakeCustomersRepository from '../repositories/FakeCustomersRepositorys';

let fakeCustomersRepository: FakeCustomersRepository;
let showCustomer: ShowCustomerService;
let CreateCustomer: CreateCustomerService;
describe('Show Customer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    showCustomer = new ShowCustomerService(fakeCustomersRepository);
    CreateCustomer = new CreateCustomerService(fakeCustomersRepository);
  });
  it('should not show customer when not exist ', async () => {
    const id = '123456789abcd';

    await expect(showCustomer.execute({ id })).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to list all customers', async () => {
    const customer = await CreateCustomer.execute({
      name: 'João silva',
      email: 'João@gmail.com',
    });
    const { id } = customer;
    const customerShow = await showCustomer.execute({ id });
    expect(customerShow).toHaveProperty('id');
  });
});

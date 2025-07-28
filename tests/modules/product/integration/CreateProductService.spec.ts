import 'reflect-metadata';
import AppError from '../../../../src/shared/errors/AppError';
import FakeProductRepository from '../repositories/FakeProductRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import FakeCacheProvider from '../../../providers/FakeCacheProvider';

let fakeProductRepository: FakeProductRepository;
let createProduct: CreateProductService;
let fakeCacheProvider: FakeCacheProvider;

describe('Create product', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createProduct = new CreateProductService(
      fakeProductRepository,
      fakeCacheProvider
    );
  });

  it('should be able to create a new product', async () => {
    const { name, price, quantity } = {
      name: 'Mouse',
      price: 110,
      quantity: 150,
    };
    const product = await createProduct.execute({ name, price, quantity });
    expect(product).toHaveProperty('id');
  }, 15000);
  it('should not be able to create two Product with the same name', async () => {
    const { name, price, quantity } = {
      name: 'Mouse',
      price: 110,
      quantity: 150,
    };
    await createProduct.execute({ name, price, quantity });

    await expect(
      createProduct.execute({ name, price, quantity })
    ).rejects.toBeInstanceOf(AppError);
  }, 15000);
});

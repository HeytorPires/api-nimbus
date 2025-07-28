import 'reflect-metadata';
import FakeProductRepository from '../repositories/FakeProductRepository';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import CreateProductService from '@modules/products/services/CreateProductService';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '../../../providers/FakeCacheProvider';

let fakeProductRepository: FakeProductRepository;
let deleteProduct: DeleteProductService;
let createProduct: CreateProductService;
let fakeCacheProvider: FakeCacheProvider;

describe('Delete product', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteProduct = new DeleteProductService(
      fakeProductRepository,
      fakeCacheProvider
    );
    createProduct = new CreateProductService(
      fakeProductRepository,
      fakeCacheProvider
    );
  });

  it('should be able to delete a product existent', async () => {
    const { name, price, quantity } = {
      name: 'Mouse',
      price: 110,
      quantity: 150,
    };
    const product = await createProduct.execute({ name, price, quantity });
    const { id } = product;
    await deleteProduct.execute(id);
    expect(product).toBeUndefined;
  });
  it('should be able to delete a product not existent', async () => {
    const id = '123456789abcde';
    await expect(deleteProduct.execute(id)).rejects.toBeInstanceOf(AppError);
  });
});

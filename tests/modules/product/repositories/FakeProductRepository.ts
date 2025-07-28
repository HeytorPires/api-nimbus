import {
  IFindProducts,
  IProductsRepository,
} from '@modules/products/domain/repositories/IProductsRepository';
import { IProductCreate } from '@modules/products/domain/models/IProductCreate';
import { IProduct } from '@modules/products/domain/models/IProduct';
import { v4 as uuidv4 } from 'uuid';
class FakeProductRepository
  implements Omit<IProductsRepository, 'list' | 'findAllByIds'>
{
  private products: IProduct[] = [];

  public async create({
    name,
    price,
    quantity,
  }: IProductCreate): Promise<IProduct> {
    const product: IProduct = {
      id: uuidv4(),
      name,
      price,
      quantity,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.products.push(product);

    return product;
  }

  public async save(product: IProduct): Promise<IProduct> {
    const findIndex = this.products.findIndex(
      (findProduct) => findProduct.id === product.id
    );
    this.products[findIndex] = product;

    return product;
  }
  public async remove(product: IProduct): Promise<void> {}

  public async list(): Promise<IProduct[] | null> {
    return null;
  }

  public async findAllByIds(
    products: IFindProducts[]
  ): Promise<IProduct[] | undefined> {
    return undefined;
  }

  public async findByName(name: string): Promise<IProduct | undefined> {
    const product = this.products.find((p) => p.name === name);
    return product;
  }
  public async findById(id: string): Promise<IProduct | undefined> {
    const product = this.products.find((p) => p.id === id);
    return product;
  }
}

export default FakeProductRepository;

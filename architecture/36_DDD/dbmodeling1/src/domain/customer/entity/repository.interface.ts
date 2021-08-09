import { CustomerId } from '../vo/CustomerId';
import { CustomerName } from '../vo/CustomerName';
import { Customer } from './Customer';

export interface ICustomerRepository {
  save(customer: Customer): Promise<void>;
  findById(id: CustomerId): Promise<Customer>;
  findByName(name: CustomerName): Promise<Array<Customer>>;
}

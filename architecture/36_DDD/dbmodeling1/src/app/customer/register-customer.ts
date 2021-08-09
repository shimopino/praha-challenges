import { Customer } from 'src/domain/customer/entity/Customer';
import { ICustomerRepository } from 'src/domain/customer/entity/repository.interface';
import { CustomerDTO } from './DTO/register-customer';

export class RegisterCustomerUseCase {
  private readonly customerRepository: ICustomerRepository;

  public constructor(customerRepository: ICustomerRepository) {
    this.customerRepository = customerRepository;
  }

  public async do(props: CustomerDTO) {
    const { name, phone } = props;

    const customer = Customer.register({ name, phone });
    await this.customerRepository.save(customer);
  }
}

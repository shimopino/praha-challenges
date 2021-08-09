import { PrismaClient } from '@prisma/client';
import { Customer } from 'src/domain/customer/entity/Customer';
import { ICustomerRepository } from 'src/domain/customer/entity/repository.interface';
import { CustomerId } from 'src/domain/customer/vo/CustomerId';
import { CustomerName } from 'src/domain/customer/vo/CustomerName';
import { CustomerPhone } from 'src/domain/customer/vo/CustomerPhone';

export class CustomerRepository implements ICustomerRepository {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async save(customer: Customer): Promise<Customer> {
    const { id, name, phone } = customer.getAllProperties();

    const savedCustomerDataModel = await this.prismaClient.customer.create({
      data: {
        id,
        name,
        phone,
      },
    });

    /**
     * 本当はPrisma経由で登録した savedCustomerDataModel からエンティティを復元したい
     */
    const savedCustomer = Customer.register({
      name: CustomerName.create(name),
      phone: CustomerPhone.create(phone),
    });

    return savedCustomer;
  }

  findById(id: CustomerId): Promise<Customer> {
    throw new Error('Method not implemented.');
  }

  findByName(name: CustomerName): Promise<Customer[]> {
    throw new Error('Method not implemented.');
  }
}

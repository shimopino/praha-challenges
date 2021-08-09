import { Body, Controller, Post } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomerDTO } from 'src/app/customer/DTO/register-customer';
import { RegisterCustomerUseCase } from 'src/app/customer/register-customer';
import { CustomerRepository } from 'src/infra/db/repository/customer/customer-repository';
import { RegisterCustomerRequest } from './request/register-request';

@Controller({
  path: '/customer',
})
export class CustomerController {
  @Post()
  async registerCustomer(
    @Body() registerCustomerRequest: RegisterCustomerRequest,
  ): Promise<void> {
    const prisma = new PrismaClient();
    const repository = new CustomerRepository(prisma);
    const usecase = new RegisterCustomerUseCase(repository);

    const customerDTO = new CustomerDTO({
      name: registerCustomerRequest.name,
      phone: registerCustomerRequest.phone,
    });

    await usecase.do(customerDTO);
  }
}

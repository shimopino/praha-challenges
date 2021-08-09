import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { ICustomerRepository } from 'src/domain/customer/entity/repository.interface';
import { PrismaClient } from '@prisma/client';
import { CustomerRepository } from 'src/infra/db/repository/customer/customer-repository';
import { RegisterCustomerUseCase } from '../register-customer';
import { CustomerDTO } from '../DTO/register-customer';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/customer/customer-repository');

describe('ユースケース Customer do', () => {
  let mockCustomerRepository: MockedObjectDeep<ICustomerRepository>;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockCustomerRepository = mocked(new CustomerRepository(prisma), true);
  });

  it('[正常系] ユーザーを登録できる', async () => {
    const usecase = new RegisterCustomerUseCase(mockCustomerRepository);

    const name = 'shimokawa';
    const phone = '000-0000-0000';
    const dto = new CustomerDTO({ name, phone });

    return expect(usecase.do(dto)).resolves.toBe(undefined);
  });

  it('[異常系] リポジトリから発生した例外をキャッチして、例外を送出する', () => {
    const ERROR_MESSAGE = 'sample';
    mockCustomerRepository.save.mockRejectedValueOnce(ERROR_MESSAGE);

    const name = 'shimokawa';
    const phone = '000-0000-0000';
    const dto = new CustomerDTO({ name, phone });
    const usecase = new RegisterCustomerUseCase(mockCustomerRepository);

    return expect(usecase.do(dto)).rejects.toEqual(ERROR_MESSAGE);
  });
});

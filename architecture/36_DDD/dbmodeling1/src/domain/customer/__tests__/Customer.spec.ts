import * as faker from 'faker';
import { Customer } from '../entity/Customer';
import * as createRandomIdStringModule from 'src/utils/random';
import { CustomerId } from '../vo/CustomerId';
import { CustomerName } from '../vo/CustomerName';
import { CustomerPhone } from '../vo/CustomerPhone';
import { InvalidArgumentError } from 'src/utils/error';

/**
 * テストの時だけ使用する Entity の生成メソッドが欲しい
 *
 * - 代案としては、現在は private にしているコンストラクタを解放する？
 */

const buildCustomer = (overrides?): Customer => {
  const customer_info = {
    id: faker.datatype.uuid(),
    name: faker.internet.userName(),
    phone: faker.phone.phoneNumber(),
    ...overrides,
  };

  return new Customer({
    id: CustomerId.random(),
    name: CustomerName.create(customer_info.customerName),
    phone: CustomerPhone.create(customer_info.customerPhone),
  });
};

describe('エンティティ Customer', () => {
  let randomSpy: jest.SpyInstance;

  beforeEach(() => {
    randomSpy = jest.spyOn(createRandomIdStringModule, 'createRandomIdString');
  });

  afterEach(() => {
    randomSpy.mockClear();
  });

  it('[正常系] 同一性を担保する', () => {
    // Arrange
    randomSpy.mockReturnValue('1');
    const customer1 = buildCustomer();
    const customer2 = buildCustomer();

    // Act
    const actual = customer1.equals(customer2);

    // Assert
    expect(actual).toBeTruthy();
  });

  it('[正常系] 顧客を新規登録できる', () => {
    // Arrange
    randomSpy.mockReturnValue('1');
    const name = CustomerName.create(faker.internet.userName());
    const phone = CustomerPhone.create(faker.phone.phoneNumber());

    // Act
    const actual = Customer.register({ name, phone });

    expect(actual).toEqual({
      id: CustomerId.random(),
      name,
      phone,
    });
  });

  it('[異常系] 顧客の新規登録時に必須項目である "顧客名" が足りていない場合は例外送出', () => {
    // Arrange
    const name = null;
    const phone = CustomerPhone.create(faker.phone.phoneNumber());

    // Act
    const sut = () => {
      Customer.register({ name, phone });
    };

    // Assert
    expect(sut).toThrow(InvalidArgumentError);
    expect(sut).toThrow('必須項目が入力されていません。');
  });

  it('[異常系] 顧客の新規登録時に必須項目である "電話番号" が足りていない場合は例外送出', () => {
    // Arrange
    const name = CustomerName.create(faker.internet.userName());
    const phone = null;

    // Act
    const sut = () => {
      Customer.register({ name, phone });
    };

    // Assert
    expect(sut).toThrow(InvalidArgumentError);
    expect(sut).toThrow('必須項目が入力されていません。');
  });
});

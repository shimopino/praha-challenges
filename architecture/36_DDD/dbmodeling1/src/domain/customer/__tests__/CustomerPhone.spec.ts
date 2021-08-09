import { CustomerPhone } from '../vo/CustomerPhone';

describe('値オブジェクト CustomerName', () => {
  it('[等価性の検証] 値が同じオブジェクトは True', () => {
    const customer_name_1 = CustomerPhone.create('customer');
    const customer_name_2 = CustomerPhone.create('customer');

    const result = customer_name_1.equals(customer_name_2);

    expect(result).toBeTruthy();
  });

  it('[等価性の検証] 値が同じオブジェクトは False', () => {
    const customer_name_1 = CustomerPhone.create('customer');
    const customer_name_2 = CustomerPhone.create('item');

    const result = customer_name_1.equals(customer_name_2);

    expect(result).toBeFalsy();
  });
});

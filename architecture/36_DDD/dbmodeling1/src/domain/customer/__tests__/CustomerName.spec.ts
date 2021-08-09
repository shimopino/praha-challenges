import { CustomerName } from '../vo/CustomerName';

describe('値オブジェクト CustomerName', () => {
  it('[等価性の検証] 値が同じオブジェクトは True', () => {
    const customer_name_1 = CustomerName.create('customer');
    const customer_name_2 = CustomerName.create('customer');

    const result = customer_name_1.equals(customer_name_2);

    expect(result).toBeTruthy();
  });

  it('[等価性の検証] 値が同じオブジェクトは False', () => {
    const customer_name_1 = CustomerName.create('customer');
    const customer_name_2 = CustomerName.create('item');

    const result = customer_name_1.equals(customer_name_2);

    expect(result).toBeFalsy();
  });
});

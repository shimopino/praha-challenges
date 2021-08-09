import { CustomerId } from '../vo/CustomerId';
import * as createRandomIdStringModule from 'src/utils/random';

describe('値オブジェクト CustomerID', () => {
  it('[等価性の検証] 値が同じオブジェクトは True', () => {
    const randomSpy = jest
      .spyOn(createRandomIdStringModule, 'createRandomIdString')
      .mockReturnValue('10');

    const customer_id1 = CustomerId.random();
    const customer_id2 = CustomerId.random();

    const result = customer_id1.equals(customer_id2);

    expect(createRandomIdStringModule.createRandomIdString()).toBe('10');
    expect(randomSpy).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('[等価性の検証] 値が異なるオブジェクトは False', () => {
    const randomSpy = jest
      .spyOn(createRandomIdStringModule, 'createRandomIdString')
      .mockReturnValueOnce('10');

    const customer_id1 = CustomerId.random();
    const customer_id2 = CustomerId.random();

    const result = customer_id1.equals(customer_id2);

    expect(createRandomIdStringModule.createRandomIdString()).toBe('10');
    expect(randomSpy).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});

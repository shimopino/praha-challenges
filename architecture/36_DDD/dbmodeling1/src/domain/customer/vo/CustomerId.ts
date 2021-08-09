import { PrimitiveValueObject } from 'src/domain/common/vo/ValueObject';
import { createRandomIdString } from 'src/utils/random';

export class CustomerId extends PrimitiveValueObject<string> {
  static random(): CustomerId {
    return new CustomerId(createRandomIdString());
  }

  toString(): string {
    return this._value;
  }
}

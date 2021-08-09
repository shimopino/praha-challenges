import { PrimitiveValueObject } from 'src/domain/common/vo/ValueObject';

export class CustomerPhone extends PrimitiveValueObject<string> {
  static create(value): CustomerPhone {
    return new CustomerPhone(value);
  }
}

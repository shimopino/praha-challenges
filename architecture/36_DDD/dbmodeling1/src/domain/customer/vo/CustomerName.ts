import { PrimitiveValueObject } from 'src/domain/common/vo/ValueObject';

export class CustomerName extends PrimitiveValueObject<string> {
  static create(value: string): CustomerName {
    return new CustomerName(value);
  }
}

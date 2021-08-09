import { CustomerName } from 'src/domain/customer/vo/CustomerName';
import { CustomerPhone } from 'src/domain/customer/vo/CustomerPhone';

export class CustomerDTO {
  public readonly name: CustomerName;
  public readonly phone: CustomerPhone;

  public constructor(props: { name: string; phone: string }) {
    const { name, phone } = props;

    this.name = CustomerName.create(name);
    this.phone = CustomerPhone.create(phone);
  }
}

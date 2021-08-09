import { Entity } from 'src/domain/common/entity/Entity';
import { InvalidArgumentError } from 'src/utils/error';
import { CustomerId } from '../vo/CustomerId';
import { CustomerName } from '../vo/CustomerName';
import { CustomerPhone } from '../vo/CustomerPhone';

export class Customer implements Entity {
  private readonly id: CustomerId;
  private readonly name: CustomerName;
  private readonly phone: CustomerPhone;

  constructor(props: {
    id: CustomerId;
    name: CustomerName;
    phone: CustomerPhone;
  }) {
    const { id, name, phone } = props;
    this.id = id;
    this.name = name;
    this.phone = phone;
  }

  /**
   * 会員の新規登録処理
   *
   * @param name 顧客名
   * @param phone 顧客の電話番号
   */
  static register(props: {
    name: CustomerName;
    phone: CustomerPhone;
  }): Customer {
    const { name, phone } = props;
    if (name == null || phone == null) {
      throw new InvalidArgumentError('必須項目が入力されていません。');
    }

    const id = CustomerId.random();
    return new Customer({ id, name, phone });
  }

  public getAllProperties() {
    return {
      id: this.id.value,
      name: this.name.value,
      phone: this.phone.value,
    };
  }

  equals(entity?: Customer): boolean {
    return this.id.equals(entity?.id);
  }
}

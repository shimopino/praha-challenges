import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * name! のように "!" を末尾に付けると、コンパイラに対して、
 * この変数は undefined や null になることはないと伝える
 *
 * https://qiita.com/zigenin/items/364264a6cf635b962542
 */

export class RegisterCustomerRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly phone!: string;
}

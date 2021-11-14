import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;
}

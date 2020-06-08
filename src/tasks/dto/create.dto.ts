import { IsNotEmpty } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

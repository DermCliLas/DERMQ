import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateSiteContentDto {
  @IsNotEmpty()
  @IsObject()
  data: Record<string, any>;
}

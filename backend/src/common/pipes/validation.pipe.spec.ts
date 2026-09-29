import { ValidationPipe } from './validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { IsString, IsInt, Min } from 'class-validator';

class TestDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  it('should pass valid data and return transformed class instance', async () => {
    const raw = { name: 'Serum Anti-edad', quantity: 2 };
    const result = await pipe.transform(raw, {
      type: 'body',
      metatype: TestDto,
    });

    expect(result).toBeInstanceOf(TestDto);
    expect(result.name).toBe('Serum Anti-edad');
    expect(result.quantity).toBe(2);
  });

  it('should throw BadRequestException if validation constraints fail', async () => {
    const raw = { name: 'Test', quantity: 0 }; // Min is 1
    await expect(
      pipe.transform(raw, { type: 'body', metatype: TestDto }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should strip or reject forbidden non-whitelisted properties', async () => {
    const raw = { name: 'Test', quantity: 1, hackerProp: 'malicious' };
    await expect(
      pipe.transform(raw, { type: 'body', metatype: TestDto }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should bypass primitive types cleanly', async () => {
    const raw = 'simple-string';
    const result = await pipe.transform(raw, {
      type: 'param',
      metatype: String,
    });
    expect(result).toBe('simple-string');
  });
});

import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MathService {
  constructor(private readonly logger: LoggerService) {}

  add(a: number, b: number): number {
    const result = a + b;
    this.logger.log(`MathService.add: ${a} + ${b} = ${result}`);
    return result;
  }

  subtract(a: number, b: number): number {
    const result = a - b;
    this.logger.log(`MathService.subtract: ${a} - ${b} = ${result}`);
    return result;
  }

  multiply(a: number, b: number): number {
    const result = a * b;
    this.logger.log(`MathService.multiply: ${a} * ${b} = ${result}`);
    return result;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      this.logger.error('MathService.divide: division by zero');
      throw new Error('Cannot divide by zero');
    }
    const result = a / b;
    this.logger.log(`MathService.divide: ${a} / ${b} = ${result}`);
    return result;
  }
}

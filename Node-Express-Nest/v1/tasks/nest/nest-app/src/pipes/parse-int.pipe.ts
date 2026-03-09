import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  constructor(private readonly logger: LoggerService) {}

  transform(value: string) {
    this.logger.log(`[PIPE] ParseIntPipe: "${value}"`);

    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
      this.logger.error(`[PIPE] Invalid number: "${value}"`);
      throw new BadRequestException(`"${value}" is not a valid number`);
    }

    this.logger.log(`[PIPE] Transformed to ${intValue}`);
    return intValue;
  }
}

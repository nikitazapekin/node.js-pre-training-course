import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  constructor(private readonly logger: LoggerService) {
    this.logger.log('UserService initialized');
  }

  findAll(): User[] {
    this.logger.log('UserService.findAll called');
    return this.users;
  }

  findById(id: number): User | undefined {
    this.logger.log(`UserService.findById: ${id}`);
    return this.users.find(u => u.id === id);
  }

  create(name: string, email: string): User {
    this.logger.log(`UserService.create: ${name}, ${email}`);
    const newUser = { id: this.users.length + 1, name, email };
    this.users.push(newUser);
    return newUser;
  }
}

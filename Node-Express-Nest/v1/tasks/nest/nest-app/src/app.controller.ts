import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: 'NestJS Tasks App', endpoints: {
      math: '/math/add?a=5&b=3',
      audit: '/audit/log (POST)',
      lifecycle: '/lifecycle/protected',
      todos: '/todos',
      todosOrm: '/todos-orm',
    }};
  }
}

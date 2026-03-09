import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;
}

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  title?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export class TodoResponseDto {
  id: number;
  title: string;
  completed: boolean;

  constructor(id: number, title: string, completed: boolean) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}

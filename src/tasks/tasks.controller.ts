import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateDto } from './dto/create.dto';
import { GetFilterDto } from './dto/get-filter.dto';
import { StatusValidation } from './pipes/status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @UsePipes(ValidationPipe)
  public create(
    @Body() createDto: CreateDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.create(createDto, user);
  }

  @Get()
  public get(
    @Query(ValidationPipe) filterDto: GetFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.get(filterDto, user);
  }

  @Get('/:id')
  public getById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getById(id, user);
  }

  @Patch('/:id/status')
  public updateStatusById(
    @Param('id') id: string,
    @Body('status', StatusValidation) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateStatusById(id, status, user);
  }

  @Delete('/:id')
  public deleteById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteById(id, user);
  }
}

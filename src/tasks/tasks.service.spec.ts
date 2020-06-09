import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetFilterDto } from './dto/get-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';

const mockUser = { id: 'lalau123', username: 'John Doe' };

const mockTaskRepository = () => ({
  get: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.get.mockResolvedValue('someValue');

      expect(taskRepository.get).not.toHaveBeenCalled();

      const filters: GetFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Lalau',
      };

      const result = await tasksService.get(filters, mockUser);

      expect(taskRepository.get).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test description' };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getById(
        'laeuhauaosfa1223941',
        mockUser,
      );

      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'laeuhauaosfa1223941',
          userId: mockUser.id,
        },
      });
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getById('jiasd2i12', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('calls taskRepository.save() and successfully save and return the task', async () => {
      const createDto: CreateDto = {
        title: 'Test task',
        description: 'Test description',
      };

      const createdTask = await tasksService.create(createDto, mockUser);

      expect(taskRepository.save).toHaveBeenCalled();
      expect(createdTask.title).toEqual(createDto.title);
      expect(createdTask.description).toEqual(createDto.description);
    });
  });
});

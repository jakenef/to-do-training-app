import { generateDummyUserData } from '../../../dummy/helpers/dummy-user';
import { appRouter } from '../../api.routes';
import { vi, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, User } from '../../../../../prisma/client';

describe('Delete task', () => {
  let requestingUser: User;
  let deleteTask: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['deleteTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: [],
        roles: ['user'],
      }),
    });
    deleteTask = appRouter
      .createCaller({ userId: requestingUser.id })
      .tasks
      .deleteTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });

  it('deletes the task', async () => {
    const task = await prisma.task.create({
      data: {
        title: faker.company.name(),
        ownerId: requestingUser.id,
      }
    });
    
    await deleteTask({ taskId: task.id });
    
    const deletedTask = await prisma.task.findUnique({
      where: {
        id: task.id
      }
    });
    
    expect(deletedTask).toBeNull();
  });

  it('errors if requesting user is not the owner of task', async () => {
    const otherUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: [],
        roles: ['user'],
      }),
    });
    const task = await prisma.task.create({
      data: {
        title: faker.company.name(),
        ownerId: otherUser.id,
      }
    })
    try {
      await expect(deleteTask({ taskId: task.id })).rejects.toHaveProperty('code', 'NOT_FOUND');
    } finally {
      await prisma.task.delete({
        where: {
          id: task.id
        }
      })
      await prisma.user.delete({ where: { id: otherUser.id } });
    }
  })
});
import { generateDummyUserData } from '../../../dummy/helpers/dummy-user';
import { appRouter } from '../../api.routes';
import { vi, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, Status, User } from '../../../../../prisma/client';

describe('Update task', () => {
  let requestingUser: User;
  let updateTask: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['updateTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: [],
        roles: ['user'],
      }),
    });
    updateTask = appRouter
      .createCaller({ userId: requestingUser.id })
      .tasks
      .updateTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });

  it('updates task with new data', async () => {
    const oldTask = await prisma.task.create({
      data: {
        title: "dummyTitle",
        description: "oldDescription",
        ownerId: requestingUser.id,
      }
    });
    const newTitle = faker.book.title();
    const newDesc = faker.book.genre();
    const newStatus = Status.InProgress;

    try {
      const result = await updateTask({
        taskId: oldTask.id,
        newTitle: newTitle,
        newDescription: newDesc,
        newStatus: newStatus,
      });
      const updatedTask = await prisma.task.findUnique({
        where: {
          id: result.taskId,
        }
      });
      expect(updatedTask).toBeDefined();
      expect(updatedTask).toHaveProperty('title', newTitle);
      expect(updatedTask).toHaveProperty('description', newDesc);
      expect(updatedTask).toHaveProperty('status', newStatus);
    } finally {
      await prisma.task.delete({
        where: {
          id: oldTask.id,
        }
      });
    }
  });

  it('updates completedAt if status is completed', async () => {
    const oldTask = await prisma.task.create({
      data: {
        title: "dummyTitle",
        description: "oldDescription",
        ownerId: requestingUser.id,
      }
    });
  })

  it('errors if requestingUser is not owner')
});
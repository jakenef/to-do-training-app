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

  it('updates completedDate if status is completed', async () => {
    const oldTask = await prisma.task.create({
      data: {
        title: "dummyTitle",
        description: "oldDescription",
        ownerId: requestingUser.id,
      }
    });
    try {
      expect(oldTask).toHaveProperty('completedDate', null);
      await updateTask({
        taskId: oldTask.id,
        newStatus: Status.Complete,
      });
      const newTask = await prisma.task.findUnique({
        where: {
          id: oldTask.id,
        }
      });
      expect(newTask).toBeDefined();
      expect(newTask?.completedDate).toBeInstanceOf(Date);
    } finally {
      await prisma.task.delete({
        where: {
          id: oldTask.id,
        }
      });
    }
  });

  it('updates completedDate if status is changed from completed to anything else', async () => {
    const oldTask = await prisma.task.create({
      data: {
        title: "dummyTitle",
        description: "oldDescription",
        ownerId: requestingUser.id,
      }
    });
    const updatedTask = await prisma.task.update({
        where: { id: oldTask.id },
        data: { completedDate: new Date(), status: Status.Complete }
      });
    try {
      expect(updatedTask.completedDate).not.toBeNull();
      await updateTask({
        taskId: updatedTask.id,
        newStatus: Status.InProgress,
      });
      const newTask = await prisma.task.findUnique({
        where: {
          id: updatedTask.id,
        }
      });
      expect(newTask).toBeDefined();
      expect(newTask?.completedDate).toBeNull();
    } finally {
      await prisma.task.delete({
        where: {
          id: oldTask.id,
        }
      });
    }
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
      await expect(updateTask({ taskId: task.id, newTitle: 'newTitle' })).rejects.toHaveProperty('code', 'NOT_FOUND');
    } finally {
      await prisma.task.delete({
        where: {
          id: task.id
        }
      });
      await prisma.user.delete({ where: { id: otherUser.id } });
    }
  });
});
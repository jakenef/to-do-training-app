import { z } from 'zod/v4';
import { prisma } from '../../../../../prisma/client';
import { authenticatedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const createTaskInput = z.object({
  title: z.string(),
  description: z.string().optional()
});

const createTaskOutput = z.object({
  taskId: z.string()
});

export const createTask = authenticatedProcedure
  .input(createTaskInput)
  .output(createTaskOutput)
  .mutation(async (opts) => {
    const task = await prisma.task.create({
      data: {
        title: opts.input.title,
        description: opts.input.description,
        ownerId: opts.ctx.userId,
      }
    })
    
    return { taskId: task.id }
  });

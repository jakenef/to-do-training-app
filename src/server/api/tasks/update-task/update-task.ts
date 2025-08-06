import { z } from 'zod/v4';
import { prisma, Status } from '../../../../../prisma/client';
import { authenticatedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { isPrismaError } from '../../../utils/prisma';

const updateTaskInput = z.object({
  taskId: z.string(),
  newTitle: z.optional(z.string()),
  newDescription: z.optional(z.string()),
  newStatus: z.enum(Status).optional(),
});

const updateTaskOutput = z.object({
  status: z.literal(Object.values(Status)),
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  description: z.string().nullable(),
  completedDate: z.nullable(z.date()),
  ownerId: z.string(),
});

export const updateTask = authenticatedProcedure
  .input(updateTaskInput)
  .output(updateTaskOutput)
  .mutation(async (opts) => {
    const updateData: any = {};
    if (opts.input.newTitle !== undefined) {
      updateData.title = opts.input.newTitle;
    }
    if (opts.input.newDescription !== undefined) {
      updateData.description = opts.input.newDescription;
    }
    if (opts.input.newStatus !== undefined) {
      updateData.status = opts.input.newStatus;

      // set completedDate based on new status
      if (opts.input.newStatus === Status.Complete) {
        updateData.completedDate = new Date();
      } else {
        updateData.completedDate = null;
      }
    }

    try {
      return await prisma.task.update({
        where: {
          id: opts.input.taskId,
          ownerId: opts.ctx.userId,
        },
        data: updateData
      });
    } catch (error) {
      if (isPrismaError(error, 'NOT_FOUND')) {
        throw new TRPCError({
          code: 'NOT_FOUND'
        });
      }
      throw error;
    }
    
  });

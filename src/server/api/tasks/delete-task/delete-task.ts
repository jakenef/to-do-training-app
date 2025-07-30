import { z } from 'zod/v4';
import { prisma } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { isPrismaError } from '../../../utils/prisma';
import { resourceLimits } from 'worker_threads';

const deleteTaskInput = z.object({
  taskId: z.string(),
});

const deleteTaskOutput = z.void();

export const deleteTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(deleteTaskInput)
  .output(deleteTaskOutput)
  .mutation(async (opts) => {
    try {
      const deleteResult = await prisma.task.deleteMany({
        where: {
          id: opts.input.taskId,
          ownerId: opts.ctx.userId,
        }
      });
      
      if (deleteResult.count === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }
    } catch (error) {
      if (isPrismaError(error, 'NOT_FOUND')) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        })
      }

      throw error;
    }
  });

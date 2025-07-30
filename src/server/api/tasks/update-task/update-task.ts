import { z } from 'zod/v4';
import { prisma, Status } from '../../../../../prisma/client';
import { authenticatedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const updateTaskInput = z.object({
  taskId: z.string(),
  newTitle: z.optional(z.string()),
  newDescription: z.optional(z.string()),
  newStatus: z.enum(Status),
});

const updateTaskOutput = z.object({
  taskId: z.string(),
});

export const updateTask = authenticatedProcedure
  .input(updateTaskInput)
  .output(updateTaskOutput)
  .mutation(async (opts) => {
    // Your logic goes here
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  });

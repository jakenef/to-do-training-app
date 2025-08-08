import { expect, Page, test } from '@playwright/test'; 
import { prisma } from '../../prisma/client';
import { TaskCreateManyInput } from '../../prisma/generated/models';
import generateDummyUserData from '../User Helper Functions/generateDummyUserData';

async function signInTestUser(page: Page): Promise<string> {
  const dummyUser = generateDummyUserData({permissions: ['manage-tasks']});
  const createdUser = await prisma.user.create({data: dummyUser})
 
  await page.goto(`http://localhost:4200/proxy?net_id=${createdUser.netId}`); 
  return createdUser.id;
}

async function deleteTestUser(id: string) {
  await prisma.user.delete({where: {id}})
}

test.describe('Task Page', () => {
  let id: string;
 
  test.beforeEach(async ({page}) => {
    id = await signInTestUser(page);
    await page.goto('http://localhost:4200/tasks');
  })
 
  test.afterEach(async () => {
    await deleteTestUser(id);
  })
  
  test('create tasks', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Create task button' });
    
    // No Tasks
    await expect(page.getByRole('group')).toContainText('0 of 0');

    // First Task
    await button.click();
    await page.getByRole('textbox', { name: 'Title' }).fill('Task 13');
    await page.getByRole('textbox', { name: 'Description' }).fill('This is just a random description.');
    await page.getByRole('button', { name: 'save button' }).click();
    await expect(page.getByRole('group')).toContainText('1 – 1 of 1');

    for (let i = 0; i < 12; i++) {
      await button.click();
      await page.getByRole('textbox', { name: 'Title' }).fill(`Task ${12 - i}`);
      await page.getByRole('textbox', { name: 'Description' }).fill('This is just a random description.');
      await page.getByRole('button', { name: 'save button' }).click();
    }

    await expect(page.getByRole('group')).toContainText('1 – 12 of 13');
  });
})

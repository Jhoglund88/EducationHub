import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LocalTasksRepository } from '../src/storage/LocalTasksRepository.ts';
const note = { id: 'one', title: 'Test', status: 'today', createdAt: '2026-10-08T10:00:00.000Z', updatedAt: '2026-10-08T10:00:00.000Z', courseId: 'future-course' };
function memory(initial = null) { let data = initial; return { getItem: () => data, setItem: (_, value) => { data = value; } }; }
test('create, read after reload, update, sort and delete preserve optional links', async () => {
  const storage = memory(); const repo = new LocalTasksRepository(() => storage);
  assert.deepEqual(await repo.list(), []);
  await repo.save(note);
  const reloaded = new LocalTasksRepository(() => storage);
  assert.deepEqual(await reloaded.list(), [note]);
  await reloaded.save({ ...note, id: 'two', updatedAt: '2026-10-08T11:00:00.000Z' });
  await reloaded.save({ ...note, title: 'Changed', updatedAt: '2026-10-08T12:00:00.000Z' });
  const notes = await reloaded.list(); assert.equal(notes.length, 2); assert.equal(notes[0].title, 'Changed'); assert.equal(notes[0].courseId, 'future-course');
  await reloaded.remove('one'); assert.equal((await reloaded.list())[0].id, 'two');
});
test('invalid stored data cannot be overwritten', async () => {
  const storage = memory('{broken'); const repo = new LocalTasksRepository(() => storage);
  await assert.rejects(repo.list(), /kunde inte läsas/); await assert.rejects(repo.save(note)); assert.equal(storage.getItem(), '{broken');
});
test('blocked storage and quota errors are understandable', async () => {
  await assert.rejects(new LocalTasksRepository(() => { throw new Error('blocked'); }).list(), /kunde inte läsas/);
  const repo = new LocalTasksRepository(() => ({getItem: () => '[]', setItem: () => {throw new Error('quota');}}));
  await assert.rejects(repo.save(note), /kunde inte sparas/); await assert.rejects(repo.remove('one'), /kunde inte sparas/);
});

test('every status transition persists and preserves creation date and links', async () => {
  const storage = memory(); const repo = new LocalTasksRepository(() => storage);
  for (const from of ['today', 'later', 'done']) {
    for (const to of ['today', 'later', 'done']) {
      await repo.save({ ...note, status: from });
      await repo.save({ ...note, status: to, updatedAt: '2026-10-08T13:00:00.000Z' });
      const task = (await new LocalTasksRepository(() => storage).list())[0];
      assert.equal(task.status, to); assert.equal(task.createdAt, note.createdAt); assert.equal(task.courseId, note.courseId);
    }
  }
});
test('invalid status and empty titles fail safely', async () => {
  for (const bad of [{ ...note, status: 'invalid' }, { ...note, title: '  ' }]) {
    const storage = memory(JSON.stringify([bad]));
    await assert.rejects(new LocalTasksRepository(() => storage).list(), /kunde inte läsas/);
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LocalNotesRepository } from '../src/storage/LocalNotesRepository.ts';
const note = { id: 'one', title: 'Test', text: 'Text', createdAt: '2026-10-08T10:00:00.000Z', updatedAt: '2026-10-08T10:00:00.000Z', courseId: 'future-course' };
function memory(initial = null) { let data = initial; return { getItem: () => data, setItem: (_, value) => { data = value; } }; }
test('create, read after reload, update, sort and delete preserve optional links', async () => {
  const storage = memory(); const repo = new LocalNotesRepository(() => storage);
  assert.deepEqual(await repo.list(), []);
  await repo.save(note);
  const reloaded = new LocalNotesRepository(() => storage);
  assert.deepEqual(await reloaded.list(), [note]);
  await reloaded.save({ ...note, id: 'two', updatedAt: '2026-10-08T11:00:00.000Z' });
  await reloaded.save({ ...note, title: 'Changed', updatedAt: '2026-10-08T12:00:00.000Z' });
  const notes = await reloaded.list(); assert.equal(notes.length, 2); assert.equal(notes[0].title, 'Changed'); assert.equal(notes[0].courseId, 'future-course');
  await reloaded.remove('one'); assert.equal((await reloaded.list())[0].id, 'two');
});
test('invalid stored data cannot be overwritten', async () => {
  const storage = memory('{broken'); const repo = new LocalNotesRepository(() => storage);
  await assert.rejects(repo.list(), /kunde inte läsas/); await assert.rejects(repo.save(note)); assert.equal(storage.getItem(), '{broken');
});
test('blocked storage and quota errors are understandable', async () => {
  await assert.rejects(new LocalNotesRepository(() => { throw new Error('blocked'); }).list(), /kunde inte läsas/);
  const repo = new LocalNotesRepository(() => ({getItem: () => '[]', setItem: () => {throw new Error('quota');}}));
  await assert.rejects(repo.save(note), /kunde inte sparas/); await assert.rejects(repo.remove('one'), /kunde inte sparas/);
});

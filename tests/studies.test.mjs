import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LocalStudiesRepository } from '../src/storage/LocalStudiesRepository.ts';
function memory() { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key,value) => values.set(key,value) }; }
const course = { id: 'c1', name: 'AI', description: '', isCurrent: true };
const project = { id: 'p1', name: 'Hub', description: '', courseId: 'c1' };
test('course and project CRUD, current course, persistence and detach', async () => {
  const storage = memory(); const repo = new LocalStudiesRepository(() => storage);
  await repo.courses.save(course); await repo.projects.save(project);
  await repo.projects.save({id:'p2',name:'Fristående',description:''});
  await repo.courses.save({...course,id:'c2',name:'Python'});
  assert.equal((await repo.courses.list()).find(c=>c.id==='c1').isCurrent,false);
  await repo.projects.save({...project,name:'Changed'});
  const reloaded = new LocalStudiesRepository(() => storage);
  assert.equal((await reloaded.projects.list()).find(p=>p.id==='p1').name,'Changed');
  await repo.courses.save({...course,name:'AI Developer',isCurrent:false,startDate:'2026-10-08'});
  assert.equal((await repo.courses.list()).find(c=>c.id==='c1').name,'AI Developer');
  await repo.courses.remove('c1');
  assert.equal((await repo.projects.list()).length,2);
  assert.equal((await repo.projects.list()).find(p=>p.id==='p1').courseId,undefined);
  await repo.projects.remove('p1'); assert.equal((await repo.projects.list()).length,1);
});
test('failed course deletion is atomic and leaves projects linked', async () => {
  const storage = memory(); const repo = new LocalStudiesRepository(() => storage);
  await repo.courses.save(course); await repo.projects.save(project);
  const blocked = new LocalStudiesRepository(() => ({getItem:storage.getItem,setItem:()=>{throw new Error('quota');}}));
  await assert.rejects(blocked.courses.remove('c1'), /kunde inte sparas/);
  const data = await repo.load(); assert.equal(data.courses.length,1); assert.equal(data.projects[0].courseId,'c1');
});
test('required names, valid dates and course links', async () => {
  const repo = new LocalStudiesRepository(() => memory());
  await assert.rejects(repo.courses.save({...course,name:' '}));
  await assert.rejects(repo.courses.save({...course,startDate:'2026-02-30'}));
  await assert.rejects(repo.courses.save({...course,startDate:'2026-10-09',endDate:'2026-10-08'}));
  await assert.rejects(repo.projects.save({...project,name:''}));
  await assert.rejects(repo.projects.save(project), /Kursen finns inte/);
});
test('corrupt or unavailable storage never gets overwritten', async () => {
  let writes = 0;
  const repo = new LocalStudiesRepository(() => ({getItem:()=>'{broken',setItem:()=>{writes++;}}));
  await assert.rejects(repo.load(), /kunde inte läsas/); await assert.rejects(repo.courses.save(course)); assert.equal(writes,0);
  await assert.rejects(new LocalStudiesRepository(()=>{throw new Error('blocked');}).load(), /kunde inte läsas/);
});

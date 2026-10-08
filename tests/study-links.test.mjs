import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LocalNotesRepository } from '../src/storage/LocalNotesRepository.ts';
import { LocalTasksRepository } from '../src/storage/LocalTasksRepository.ts';
import { LocalStudiesRepository } from '../src/storage/LocalStudiesRepository.ts';
import { removeStudyAndLinks } from '../src/storage/removeStudyAndLinks.ts';
import { selectedLink, validLink, linkValue } from '../src/features/studies/studyLinks.ts';
function memory() { const data=new Map(); return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)}; }
const c={id:'c',name:'Course',description:'',isCurrent:true};
const p={id:'p',name:'Project',description:'',courseId:'c'};
const n={id:'n',title:'Note',text:'Keep me',createdAt:'2026-10-08T10:00:00.000Z',updatedAt:'2026-10-08T10:00:00.000Z',courseId:'c'};
const t={id:'t',title:'Task',status:'later',createdAt:n.createdAt,updatedAt:n.updatedAt,projectId:'p'};
async function setup() {const storage=memory(); const notes=new LocalNotesRepository(()=>storage);const tasks=new LocalTasksRepository(()=>storage);const studies=new LocalStudiesRepository(()=>storage);await studies.courses.save(c);await studies.projects.save(p);await notes.save(n);await tasks.save(t);return {storage,notes,tasks,studies};}
test('link to course/project, change, remove and reload without duplicate data', async()=>{
 const {storage,notes,tasks}=await setup();
 assert.equal((await notes.list())[0].courseId,'c');assert.equal((await tasks.list())[0].projectId,'p');
 await notes.save({...n,...selectedLink('project:p')});assert.equal((await notes.list())[0].courseId,undefined);
 await notes.save({...n,...selectedLink('')});assert.equal((await new LocalNotesRepository(()=>storage).list())[0].projectId,undefined);
 await tasks.save({...t,...selectedLink('course:c')});assert.equal((await tasks.list())[0].projectId,undefined);
 await tasks.save({...t,...selectedLink('')});assert.equal((await tasks.list()).length,1);
});
test('course removal detaches direct content and projects but preserves project links',async()=>{
 const {storage,notes,tasks,studies}=await setup();await removeStudyAndLinks('course','c',storage);
 assert.equal((await notes.list())[0].text,n.text);assert.equal((await notes.list())[0].courseId,undefined);
 assert.equal((await tasks.list())[0].projectId,'p');assert.equal((await studies.projects.list())[0].courseId,undefined);assert.equal((await studies.courses.list()).length,0);
 await removeStudyAndLinks('project','p',storage);assert.equal((await tasks.list())[0].projectId,undefined);assert.equal((await tasks.list())[0].status,'later');
 assert.equal((await new LocalNotesRepository(()=>storage).list()).length,1);
});
test('a failed deletion restores earlier writes and preserves references',async()=>{
 const {storage,notes,studies}=await setup();const failing={...storage,setItem:(key,value)=>{if(key==='education-hub.studies.v1')throw new Error('quota');storage.setItem(key,value);}};
 await assert.rejects(removeStudyAndLinks('course','c',failing),/Ingen ändring/);
 assert.equal((await notes.list())[0].courseId,'c');assert.equal((await studies.courses.list()).length,1);
});
test('legacy unlinked content stays unchanged and broken references resolve consistently',async()=>{
 const {storage,notes}=await setup();await notes.save({...n,id:'legacy',courseId:undefined});await removeStudyAndLinks('project','p',storage);
 assert.equal((await notes.list()).find(n=>n.id==='legacy').text,'Keep me');
 assert.equal(linkValue(validLink({courseId:'missing'},[c],[p])), '');
 assert.deepEqual(validLink({courseId:'c',projectId:'p'},[c],[p]),{courseId:undefined,projectId:'p'});
});

test('repositories reject two direct links',async()=>{
 const {notes,tasks}=await setup();
 await assert.rejects(notes.save({...n,projectId:'p'}),/högst en/);
 await assert.rejects(tasks.save({...t,courseId:'c'}),/högst en/);
});

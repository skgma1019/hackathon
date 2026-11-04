import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';

const content = {
  storyboard: [{ scene: 1, visual: '발표 장면', caption: '우리의 프로젝트' }],
  cardNews: [{ page: 1, title: '첫 발표', body: '함께 만든 작품' }],
  hashtags: ['#세명한컷'],
};
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');

async function withServer(t, generateContent) {
  const server = createApp({ generateContent }).listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  return (path, options) => fetch(base + path, options);
}
const json = (body) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
function photoForm(bytes = png, type = 'image/png') {
  const form = new FormData();
  form.set('description', '프로젝트 발표');
  form.set('photo', new Blob([bytes], { type }), 'photo.png');
  return { method: 'POST', body: form };
}

test('반 정보, 없는 반, CORS', async (t) => {
  const request = await withServer(t);
  for (const id of ['ai', 'game', 'web']) {
    const res = await request(`/api/classes/${id}`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('access-control-allow-origin'), '*');
    assert.equal((await res.json()).id, id);
  }
  const res = await request('/api/classes/missing');
  assert.equal(res.status, 404);
  assert.deepEqual(Object.keys(await res.json()), ['error']);
});

test('질문에 반 설명 전달, answer만 반환', async (t) => {
  const request = await withServer(t, async (input) => {
    assert.match(input.instruction, /인공지능의 기초/);
    assert.equal(input.parts[0].text, '무엇을 배우나요?');
    return { answer: 'AI를 배웁니다.', extra: true };
  });
  const res = await request('/api/guide/ask', json({ classId: 'ai', question: '무엇을 배우나요?' }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { answer: 'AI를 배웁니다.' });
});

test('질문 검증과 잘못된 JSON 뒤에도 서버 동작', async (t) => {
  const request = await withServer(t);
  for (const body of [{ classId: 'ai', question: '' }, { classId: 'ai', question: '  ' }, { question: '안녕' }]) {
    const res = await request('/api/guide/ask', json(body));
    assert.equal(res.status, 400);
    assert.equal(typeof (await res.json()).error, 'string');
  }
  assert.equal((await request('/api/guide/ask', json({ classId: 'missing', question: '안녕' }))).status, 404);
  const malformed = await request('/api/guide/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(malformed.status, 400);
  assert.deepEqual(Object.keys(await malformed.json()), ['error']);
  assert.equal((await request('/api/classes/ai')).status, 200);
});

test('사진과 설명을 Gemini에 전달하고 콘텐츠 JSON 반환', async (t) => {
  const request = await withServer(t, async (input) => {
    assert.equal(input.parts[0].text, '프로젝트 발표');
    assert.equal(input.parts[1].inlineData.mimeType, 'image/png');
    assert.equal(input.parts[1].inlineData.data, png.toString('base64'));
    return content;
  });
  const res = await request('/api/oneshot', photoForm());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), content);
});

test('사진 누락, 위장 파일, 30MB 초과, 여러 줄 설명 거부', async (t) => {
  const request = await withServer(t);
  const missing = await request('/api/oneshot', json({ description: '발표' }));
  assert.equal(missing.status, 400);
  const fake = await request('/api/oneshot', photoForm(Buffer.from('not a photo')));
  assert.equal(fake.status, 400);
  const oversized = await request('/api/oneshot', photoForm(Buffer.alloc(30 * 1024 * 1024 + 1)));
  assert.equal(oversized.status, 413);
  assert.deepEqual(Object.keys(await oversized.json()), ['error']);
  const options = photoForm();
  options.body.set('description', '첫 줄\n다음 줄');
  assert.equal((await request('/api/oneshot', options)).status, 400);
  assert.equal((await request('/api/classes/ai')).status, 200);
});

test('AI 실패와 잘못된 결과는 JSON 오류, 이후 요청 정상 처리', async (t) => {
  const request = await withServer(t, async () => { throw new Error('secret upstream details'); });
  const res = await request('/api/guide/ask', json({ classId: 'ai', question: '안녕' }));
  assert.equal(res.status, 500);
  const result = await res.json();
  assert.deepEqual(Object.keys(result), ['error']);
  assert.doesNotMatch(result.error, /secret/);
  assert.equal((await request('/api/classes/ai')).status, 200);
  const invalid = await withServer(t, async () => ({}));
  assert.equal((await invalid('/api/oneshot', photoForm())).status, 502);
});

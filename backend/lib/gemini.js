export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const wait = (attempt) => new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1)));

export async function generate({ model, instruction, parts, schema }) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === 'your_gemini_api_key') {
    throw new HttpError(503, '서버에 GEMINI_API_KEY를 설정해 주세요.');
  }

  const attempts = Number(process.env.GEMINI_RETRIES) || 3;
  let response;
  for (let attempt = 1; ; attempt += 1) {
    const retriable = attempt < attempts;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          signal: AbortSignal.timeout(60000),
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: instruction }] },
            contents: [{ role: 'user', parts }],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: schema,
            },
          }),
        },
      );
    } catch (error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        throw new HttpError(504, 'AI 응답 시간이 초과되었습니다. 다시 시도해 주세요.');
      }
      if (retriable) { await wait(attempt); continue; }
      throw new HttpError(502, 'AI 서비스에 연결할 수 없습니다.');
    }
    if (response.ok) break;

    const detail = await response.text().catch(() => '');
    console.error(`Gemini ${response.status} (시도 ${attempt}/${attempts}): ${detail.slice(0, 500)}`);
    if (response.status === 503 && retriable) { await wait(attempt); continue; }
    if (response.status === 429) throw new HttpError(429, 'AI 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.');
    if (response.status === 402) throw new HttpError(502, 'AI 서비스의 크레딧이 소진되었습니다. Google AI Studio의 결제 설정을 확인해 주세요.');
    if (response.status === 503) throw new HttpError(502, 'AI 모델이 혼잡합니다. 잠시 후 다시 시도해 주세요.');
    throw new HttpError(502, 'AI 요청에 실패했습니다. 서버의 API 키와 모델 설정을 확인해 주세요.');
  }
  try {
    const payload = await response.json();
    const text = payload.candidates?.[0]?.content?.parts
      ?.filter((part) => !part.thought && typeof part.text === 'string')
      .map((part) => part.text).join('');
    return JSON.parse(text);
  } catch {
    throw new HttpError(502, 'AI가 올바른 JSON 응답을 반환하지 않았습니다.');
  }
}

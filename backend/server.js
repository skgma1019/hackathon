import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 3010;
const server = createApp().listen(port, () => {
  console.log(`서버 실행: http://localhost:${port}`);
});
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? `${port}번 포트가 이미 사용 중입니다.`
      : "서버를 시작하지 못했습니다.",
  );
  process.exitCode = 1;
});

import { randomUUID } from "node:crypto";
import { createServer } from "node:http";

const port = Number(process.env.E2E_RESEND_PORT ?? 3101);
const messages = [];

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);

  if (request.method === "GET" && url.pathname === "/health") {
    response.writeHead(200).end("ok");
    return;
  }

  if (request.method === "GET" && url.pathname === "/messages") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(messages));
    return;
  }

  if (request.method === "DELETE" && url.pathname === "/messages") {
    messages.length = 0;
    response.writeHead(204).end();
    return;
  }

  if (request.method === "POST" && url.pathname === "/emails") {
    const chunks = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    messages.push(JSON.parse(Buffer.concat(chunks).toString("utf8")));

    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ id: randomUUID() }));
    return;
  }

  response.writeHead(404).end();
});

server.listen(port, "127.0.0.1");

const close = () => {
  server.close(() => process.exit(0));
  server.closeAllConnections();
};
process.on("SIGINT", close);
process.on("SIGTERM", close);

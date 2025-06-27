import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { streamSSE, streamText } from "hono/streaming";
import { cors } from "hono/cors";

const app = new Hono();
app.use(cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const text =
  "日本国民は、正当に選挙された国会における代表者を通じて行動し、われらとわれらの子孫のために、諸国民との協和による成果と、わが国全土にわたつて自由のもたらす恵沢を確保し、政府の行為によつて再び戦争の惨禍が起ることのないやうにすることを決意し、ここに主権が国民に存することを宣言し、この憲法を確定する。";

app.get("/stream-text", (c) => {
  let index = 0;

  return streamText(c, async (stream) => {
    while (index < text.length) {
      // 2~5文字ずつ返す
      const randomLength = Math.floor(Math.random() * 4) + 2;
      console.log(text.slice(index, index + randomLength));

      // writeだと逐次レスポンスが返らなかった
      // await stream.write(text.slice(index, index + randomLength));
      await stream.writeln(text.slice(index, index + randomLength));
      index += randomLength;
      await stream.sleep(100);
    }

    await stream.close();
  });
});

app.get("/sse", (c) => {
  return streamSSE(c, async (stream) => {
    let index = 0;

    while (index < text.length) {
      // 2~5文字ずつ返す
      const randomLength = Math.floor(Math.random() * 4) + 2;
      console.log(text.slice(index, index + randomLength));

      await stream.writeSSE({
        data: text.slice(index, index + randomLength),
        event: "update",
      });
      index += randomLength;
      await stream.sleep(100);
    }
    await stream.close();
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

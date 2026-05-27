import http from "node:http";
import { Transform } from "node:stream";
class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    console.log(transformed);

    callback(null, Buffer.from(String(transformed)));
  }
}

// Aqui estamos através de requisição acionando a Stream criada anteriormente para inverter a base que está sendo gerada em nossa API (arquivo 'fake-upload-to-http-stream')
const server = http.createServer((req, res) => {
  return req.pipe(new InverseNumberStream()).pipe(res);
});

server.listen(3334);

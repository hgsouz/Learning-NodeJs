import http from "node:http";
import { duplexPair, Transform } from "node:stream";
class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    console.log(transformed);

    callback(null, Buffer.from(String(transformed)));
  }
}

// Aqui estamos através de requisição acionando a Stream criada anteriormente para inverter a base que está sendo gerada em nossa API (arquivo 'fake-upload-to-http-stream')
const server = http.createServer(async (req, res) => {
  const buffers = [];

  // Ao utilizar o await em streams nós iremos esperar que cada pedaço da stream seja retornado para que só assim façamos algo, ou seja, a stream so retorna após ela ter completado todo o seu ciclo

  // obs.: esse modelo é muito utilizado pois em certas situações (como o recebimento/leitura de um JSON) é necessário aguardar que toda a mensagem seja recebida para que só assim ela nos seja util
  for await (const chunk of req) {
    // Aqui nós captamos cada pedaço que é retornado da stream e introduzimos no array Buffers
    buffers.push(chunk);
  }

  const fullStreamContent = Buffer.concat(buffers).toString();

  console.log(fullStreamContent);

  return res.end(fullStreamContent);
});

server.listen(3334);

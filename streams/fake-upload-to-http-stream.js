import { Readable } from "node:stream";

class OneToHundredStream extends Readable {
  index = 1;

  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 100) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));

        this.push(buf);
      }
    }, 1000);
  }
}

// Versões atualizadas do node aceitam a utilização de fetch para criação de APIs nativas, nesse caso estamos fazendo requisições locais para outro arquivo
fetch("http://localhost:3334", {
  method: "POST",
  body: Readable.toWeb(new OneToHundredStream()), // A versão mais nova do Node necessita fazer essa transformação
  duplex: "half", // E também e necessário a adição de um duplex
});

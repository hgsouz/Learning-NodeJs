// O conceito de Streams se baseia em poder trabalhar com um dado mesmo que ele ainda não tenha sido totalmente carregado pela nossa aplicação

// Em um case de importação de um CSV de 1gb para inserção em banco de dados há duas vertentes:
//  - Sem Stream - Espera nosso servidor receber os 1gb de arquivo para só depois inserir no banco
//  - Com Stream - A cada segundo que ele recebe os dados eles já insere no nosso banco

// Importante: No node toda porta de entrada e saída é uma Stream nativamente

// Temos 3 vertentes principais de Streams:
//  - Readable: Leitura de dados
//  - Writable: Escrita de dados
//  - Transform: Edita de dados

// Esse pequeno bloco basicamente recebe a informação digitada e retorna ao usuário
//process.stdin // -> "stdin" são todas as entradas realizadas através do terminal (readable stream)
//  .pipe(process.stdout); // -> "stdout" podemos traduzir como a saída de dados (writable stream)

// Criação de Stream do zero (pouco utilizado)
import { Readable, Writable, Transform } from "node:stream";

class OneToHundredStream extends Readable {
  index = 1;

  // Toda Stream readable possuí um metódo padrão, o "_read"
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 100) {
        this.push(null);
      } else {
        // Em Streams não podemos trabalhar com stings/numbers direto, por isso transformamos esses dados em Buffer
        // Buffer é o modelo de dados que o Node usa para transicionar dados entre Streams
        const buf = Buffer.from(String(i));

        this.push(buf);
      }
    }, 1000);
  }
}

class InverseNumberStream extends Transform {
  // E seguindo o mesmo padrão aqui nosso metódo é o "_transform"
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    callback(null, Buffer.from(String(transformed)));
  }
}

class MultiplyByTenStream extends Writable {
  // Aqui o nosso metódo padrão é o "_write" e nesse caso passamos 3 parâmetros:
  // - chunk: Esse é o pedaço que estamos lendo da Stream de leitura
  // - encoding: Aqui nós vemos como essa informação está codificada
  // - callback: Função que é chamada ao finalizar o que era preciso

  // importante salientar que Writable Streams não rertornam nada, apenas leem e processam
  _write(chunk, enconding, callback) {
    console.log(Number(chunk.toString()) * 10);
    callback();
  }
}

// Através dessa chamada podemos ver a atuação real de uma Stream onde os dados estão sendo lidos, processados e transformadsos (mesmo antes da finalização completa da leitura desses dados)
new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream());

import http from "node:http";

// Para ser consumida nossa API precisa de diversas rotas, dentre elas:
//  - Criar usuários
//  - Listagem de usuários
//  - Edição de usuários
//  - Remoção de usuários

// As rotas são compostas por:
//  - Método/verbo HTTP
//  - URL

// Tipos de aplicação:
// Statefull - guarda dados em memória que são perdidos em caso de parar a aplicação.
// Stateless - guarda dados em arquivos externos como BD ou TXT, e não são perdidos em caso de parar a aplicação.

// Headers - São os cabeçalhos onde o server pode entender o tipo de dado com o qual ele está recebendo

// HTTP Status Code - São respostas do servidor de acordo com o que foi solicitado

const users = [];

const server = http.createServer((request, response) => {
  const { method, url } = request;

  if (method == "GET" && url == "/users") {
    return (
      response
        // Enviando Metadados para que nosso post retorne em um formato adequado de acordo com seu cabeçalho
        .setHeader("Content-type", "application/json")

        // Transformando nosso array em um JSON, pois nosso server não retorna array
        .end(JSON.stringify(users))
    );
  }

  if (method == "POST" && url == "/users") {
    users.push({
      id: 1,
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    // Agora ao criar o usúario nós retornamos o status code 201:created após finalizar o POST
    return response.writeHead(201).end();
  }

  // Aqui adicionamos o status code 404:not found caso a url digitada esteja incorreta
  return response
    .writeHead(404)
    .end(
      "Opsss... Não encontramos o que procura, verifique se a URL está correta",
    );
});

// Comando utilizado para que o servidor apenas leia a porta 3333 do localhost
server.listen(3333);

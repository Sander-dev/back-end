Visão Geral, este projeto é uma aplicação que utiliza Node.js para o back-end, PostgreSQL como banco de dados e Prisma como ORM.

Pré-requisitos
Antes de iniciar, verifique se você possui os seguintes softwares instalados:

Node.js (v14 ou superior)
PostgreSQL (v13 ou superior)
Prisma CLI (instalado globalmente via npm)
Configuração do Ambiente
1. Clone o Repositório: 

git clone https://github.com/Sander-dev/fbenevides-back-end.git

   cd fbenevides-back-end

2. Instale as Dependências.
Execute o comando abaixo para instalar todas as dependências do projeto:
   
npm install

3. Configure o Banco de Dados
Crie um banco de dados no PostgreSQL:

Acesse o PostgreSQL e crie um banco de dados:

CREATE DATABASE nome_do_banco;

Configure as Variáveis de Ambiente:

Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:

DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

Substitua usuario, senha e nome_do_banco pelos valores apropriados.

4. Configure o Prisma
Instale o Prisma CLI:

npm install -g prisma

Execute as Migrações:

Para aplicar as migrações e criar as tabelas no banco de dados:

npx prisma migrate dev --name init

5. Inicie o Servidor
Para iniciar o servidor, execute o seguinte comando:

npm run dev

O servidor estará disponível em http://localhost:4000.

6. Teste o Servidor
Certifique-se de que o servidor está funcionando corretamente acessando a URL mencionada ou utilizando uma ferramenta como o Postman para testar as rotas da API.

O Swagger está configurado para documentar a API. Você pode acessá-lo em http://localhost:4000/api-docs/.


Scripts Disponíveis
npm run dev: Inicia o servidor em modo de desenvolvimento.
npx prisma migrate dev: Aplica as migrações e atualiza o banco de dados.

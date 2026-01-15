# FutControl Backend

Backend do projeto FutControl desenvolvido com NestJS seguindo Clean Architecture.

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture, organizando o código em camadas:

- **Domain**: Entidades e interfaces de repositórios (regras de negócio puras)
- **Application**: Casos de uso, DTOs e interfaces (lógica de aplicação)
- **Infrastructure**: Implementações concretas (banco de dados, estratégias JWT, guards)
- **Presentation**: Controllers (camada de apresentação)

## 🚀 Tecnologias

- **NestJS**: Framework Node.js
- **TypeORM**: ORM para TypeScript
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação baseada em tokens
- **Docker Compose**: Orquestração do banco de dados

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação

1. Navegue até o diretório `api` e instale as dependências:

```bash
cd api
npm install
```

2. Volte para a raiz do projeto e crie um arquivo `.env` baseado no `env.example`:

```bash
cd ..
cp env.example .env
```

3. Configure as variáveis de ambiente no arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=futcontrol

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development
```

4. Inicie o banco de dados PostgreSQL com Docker Compose (na raiz do projeto):

```bash
docker compose up -d
```

**Nota**: Se você estiver usando WSL 2, certifique-se de que a integração WSL está ativada no Docker Desktop. Alternativamente, use `docker compose` (sem hífen) que é a versão mais recente do Docker Compose.

5. Execute o servidor (dentro do diretório `api`):

```bash
cd api
npm run start:dev
```

O servidor estará disponível em `http://localhost:3000`

## 📡 Endpoints de Autenticação

### Registrar Usuário

```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "Nome do Usuário"
  }
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "Nome do Usuário"
  }
}
```

### Obter Perfil do Usuário (Protegido)

```http
GET /users/me
Authorization: Bearer {access_token}
```

**Resposta:**
```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "name": "Nome do Usuário"
}
```

## 🔒 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer {seu_token_jwt}
```

Rotas públicas (como `/auth/register` e `/auth/login`) não requerem autenticação e são marcadas com o decorator `@Public()`.

## 🗄️ Banco de Dados

O PostgreSQL é executado via Docker Compose na raiz do projeto. Para parar o banco de dados:

```bash
docker compose down
```

Para remover os volumes (apaga os dados):

```bash
docker compose down -v
```

## 📝 Scripts Disponíveis

Execute os scripts dentro do diretório `api`:

- `npm run start`: Inicia o servidor em modo produção
- `npm run start:dev`: Inicia o servidor em modo desenvolvimento (watch mode)
- `npm run start:debug`: Inicia o servidor em modo debug
- `npm run build`: Compila o projeto TypeScript
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes unitários
- `npm run test:e2e`: Executa os testes end-to-end

## 🏛️ Estrutura do Projeto

```
backend/
├── api/                      # Aplicação NestJS
│   ├── src/
│   │   ├── domain/          # Camada de domínio
│   │   │   ├── entities/    # Entidades do domínio
│   │   │   └── repositories/# Interfaces de repositórios
│   │   ├── application/     # Camada de aplicação
│   │   │   ├── dtos/        # Data Transfer Objects
│   │   │   ├── interfaces/  # Interfaces da aplicação
│   │   │   └── use-cases/   # Casos de uso
│   │   ├── infrastructure/  # Camada de infraestrutura
│   │   │   ├── database/    # Configuração do banco
│   │   │   ├── decorators/  # Decorators customizados
│   │   │   ├── guards/      # Guards de autenticação
│   │   │   ├── repositories/# Implementações de repositórios
│   │   │   └── strategies/  # Estratégias do Passport
│   │   ├── presentation/   # Camada de apresentação
│   │   │   └── controllers/ # Controllers REST
│   │   └── modules/         # Módulos NestJS
│   │       ├── auth/        # Módulo de autenticação
│   │       └── user/        # Módulo de usuário
│   └── package.json
├── docker-compose.yml        # Configuração do PostgreSQL
├── .env                      # Variáveis de ambiente (criar)
└── env.example              # Exemplo de variáveis de ambiente
```

## 🔐 Segurança

- Senhas são hasheadas usando bcrypt antes de serem armazenadas
- Tokens JWT têm expiração configurável
- Validação de dados de entrada usando class-validator
- Proteção contra SQL injection através do TypeORM

## 📄 Licença

Este projeto é privado e não possui licença pública.

# Projeto Monorepo

Este repositório é um monorepo que centraliza múltiplas aplicações e pacotes compartilhados, facilitando o desenvolvimento, manutenção e reutilização de código entre diferentes projetos.

## 📦 Pacotes e Aplicações

- **`crud-api`**: API RESTful com operações básicas de Create, Read, Update e Delete. Utiliza Node.js, TypeScript e Drizzle ORM.
- **`quasar-project`**: Aplicação frontend desenvolvida com Quasar Framework (Vue.js), voltada para interação com as APIs do monorepo.
- **`utils`**: Conjunto de utilitários TypeScript reutilizáveis compartilhados entre diferentes projetos.


## 🚀 Tecnologias Utilizadas

- **Monorepo:** [Turborepo](https://turbo.build/repo)
- **Gerenciador de Pacotes:** [PNPM](https://pnpm.io/)
- **Backend:** [tRPC](https://trpc.io/)
- **Frontend:** [Quasar Framework](https://quasar.dev/) (Vue.js)
- **Testes:** [Vitest](https://vitest.dev/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Análise e Formatação de Código:** [Biome](https://biomejs.dev/)
- **CI/CD:** GitHub Actions

## 📋 Comandos Úteis

- Instalar dependências:
  ```bash
  pnpm install
  ```

- Rodar a API:
  ```bash
  pnpm --filter crud-api dev
  ```

- Rodar o frontend (Quasar):
  ```bash
  pnpm --filter quasar-project dev
  ```

- Rodar testes:
  ```bash
  pnpm test
  ```

- Lint com Biome:
  ```bash
  pnpm check
  ```

- Format com Biome:
  ```bash
  pnpm format .
  ```

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

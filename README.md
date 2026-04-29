# StockHub — Gestão de Estoque

> Sistema web para cadastro de sellers, login e gerenciamento de estoque.

## Sobre o projeto

StockHub é uma aplicação React + Vite para gerenciar sellers, produtos e movimentações de estoque de forma simples e centralizada.

### Funcionalidades
- Tela inicial com navegação intuitiva
- Cadastro de novos sellers (nome, email, telefone, CNPJ, empresa, endereço, senha)
- Login de usuários
- Integração com backend para cadastro de sellers

## Como rodar o projeto

1. Acesse a pasta `react-front`:
	```bash
	cd react-front
	```
2. Instale as dependências:
	```bash
	npm install
	```
3. Inicie o servidor de desenvolvimento:
	```bash
	npm run dev
	```
4. Acesse [http://localhost:5173](http://localhost:5173) no navegador.

> **Obs:** Para cadastro de sellers, é necessário que o backend esteja rodando em `http://localhost:5000`.

## Estrutura de pastas

- `src/App.jsx` — Configuração das rotas principais
- `src/Home.jsx` — Tela inicial
- `src/CadastroSeller.jsx` — Cadastro de sellers
- `src/Login.jsx` — Tela de login

## Tecnologias
- React 19
- Vite
- React Router DOM
- ESLint

---
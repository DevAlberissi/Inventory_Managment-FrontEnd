# API Reference — Inventory Management

Base URL: `http://localhost:5000`

Rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

---

## Autenticação

### POST `/auth/login`

Autentica um seller e retorna um JWT.

**Auth:** Não

**Body (JSON):**
| Campo    | Tipo   | Obrigatório |
|----------|--------|-------------|
| email    | string | Sim         |
| password | string | Sim         |

**Resposta 200:**
```json
{
  "mensagem": "Login realizado",
  "token": "<jwt>"
}
```

**Erros:**
| Status | Mensagem           | Causa                                   |
|--------|--------------------|-----------------------------------------|
| 400    | Dados inválidos    | email ou password ausente               |
| 401    | `<motivo>`         | Credenciais incorretas ou conta inativa |

---

## Sellers (Usuários)

### POST `/users`

Cadastra um novo seller. Envia o código de ativação via WhatsApp (Twilio).

**Auth:** Não

**Body (JSON):**
| Campo    | Tipo   | Obrigatório |
|----------|--------|-------------|
| name     | string | Sim         |
| email    | string | Sim         |
| password | string | Sim         |
| cnpj     | string | Sim         |
| celular  | string | Não         |

**Resposta 201:**
```json
{
  "mensagem": "Seller cadastrado. Código enviado no WhatsApp",
  "usuarios": { ...seller }
}
```

**Erros:**
| Status | Mensagem              | Causa                              |
|--------|-----------------------|------------------------------------|
| 400    | Missing required fields | name, email, password ou cnpj ausente |

---

### PATCH `/users/activate`

Ativa a conta do seller usando o código de 4 dígitos recebido via WhatsApp.

**Auth:** Não

**Body (JSON):**
| Campo | Tipo   | Obrigatório |
|-------|--------|-------------|
| email | string | Sim         |
| code  | string | Sim         |

**Resposta 200:**
```json
{
  "mensagem": "Conta ativada com sucesso"
}
```

**Erros:**
| Status | Mensagem        | Causa                         |
|--------|-----------------|-------------------------------|
| 400    | Dados inválidos | email ou code ausente         |
| 400    | Código inválido | Código incorreto ou expirado  |

---

### PATCH `/users/me`

Atualiza os dados do seller autenticado.

**Auth:** JWT

**Body (JSON):** Qualquer subconjunto dos campos abaixo:
| Campo    | Tipo   |
|----------|--------|
| name     | string |
| email    | string |
| password | string |
| cnpj     | string |
| celular  | string |

**Resposta 200:**
```json
{
  "mensagem": "Atualização realizada com sucesso!",
  "usuarios": { ...seller }
}
```

**Erros:**
| Status | Mensagem              | Causa                   |
|--------|-----------------------|-------------------------|
| 404    | Usuário não encontrado | seller_id não existe    |

---

## Produtos

> Todas as rotas de produtos usam `multipart/form-data`. O `seller_id` é extraído do JWT — nunca envie no body.

### POST `/products`

Cria um novo produto para o seller autenticado.

**Auth:** JWT

**Body (form-data):**
| Campo    | Tipo    | Obrigatório | Padrão |
|----------|---------|-------------|--------|
| name     | string  | Sim         | —      |
| price    | number  | Sim         | —      |
| quantity | integer | Não         | 0      |
| status   | boolean | Não         | true   |
| image    | file    | Não         | —      |

Formatos de imagem aceitos: `png`, `jpg`, `jpeg`, `gif`, `webp`.

**Resposta 201:**
```json
{
  "mensagem": "Produto cadastrado com sucesso",
  "produto": { ...produto }
}
```

**Erros:**
| Status | Mensagem                        | Causa                          |
|--------|---------------------------------|--------------------------------|
| 400    | Campos obrigatórios: name, price | name ou price ausente          |
| 400    | price e quantity devem ser numéricos | Valor não numérico         |

---

### GET `/products`

Lista todos os produtos do seller autenticado.

**Auth:** JWT

**Resposta 200:**
```json
{
  "produtos": [ { ...produto }, ... ]
}
```

---

### GET `/products/<id>`

Retorna os detalhes de um produto específico.

**Auth:** JWT

**Path param:**
| Param | Tipo    |
|-------|---------|
| id    | integer |

**Resposta 200:**
```json
{
  "produto": { ...produto }
}
```

**Erros:**
| Status | Mensagem              | Causa                                  |
|--------|-----------------------|----------------------------------------|
| 404    | Produto não encontrado | id não existe                         |
| 403    | Acesso não autorizado  | Produto pertence a outro seller        |

---

### PATCH `/products/<id>`

Atualiza os dados de um produto. Envie apenas os campos que deseja alterar.

**Auth:** JWT

**Path param:**
| Param | Tipo    |
|-------|---------|
| id    | integer |

**Body (form-data):** Qualquer subconjunto:
| Campo    | Tipo    |
|----------|---------|
| name     | string  |
| price    | number  |
| quantity | integer |
| status   | boolean |
| image    | file    |

**Resposta 200:**
```json
{
  "mensagem": "Produto atualizado com sucesso",
  "produto": { ...produto }
}
```

**Erros:**
| Status | Mensagem              | Causa                           |
|--------|-----------------------|---------------------------------|
| 400    | price deve ser numérico | Valor não numérico             |
| 400    | quantity deve ser numérico | Valor não numérico          |
| 404    | Produto não encontrado | id não existe                  |
| 403    | Acesso não autorizado  | Produto pertence a outro seller |

---

### PATCH `/products/<id>/deactivate`

Inativa um produto (define `status = false`).

**Auth:** JWT

**Path param:**
| Param | Tipo    |
|-------|---------|
| id    | integer |

**Resposta 200:**
```json
{
  "mensagem": "Produto inativado com sucesso"
}
```

**Erros:**
| Status | Mensagem              | Causa                           |
|--------|-----------------------|---------------------------------|
| 404    | Produto não encontrado | id não existe                  |
| 403    | Acesso não autorizado  | Produto pertence a outro seller |

---

## Resumo das Rotas

| Método | Rota                        | Auth | Descrição                        |
|--------|-----------------------------|------|----------------------------------|
| POST   | /auth/login                 | Não  | Login do seller                  |
| POST   | /users                      | Não  | Cadastro de seller               |
| PATCH  | /users/activate             | Não  | Ativar conta com código WhatsApp |
| PATCH  | /users/me                   | JWT  | Atualizar dados do seller        |
| POST   | /products                   | JWT  | Criar produto                    |
| GET    | /products                   | JWT  | Listar produtos do seller        |
| GET    | /products/\<id\>            | JWT  | Detalhar produto                 |
| PATCH  | /products/\<id\>            | JWT  | Atualizar produto                |
| PATCH  | /products/\<id\>/deactivate | JWT  | Inativar produto                 |

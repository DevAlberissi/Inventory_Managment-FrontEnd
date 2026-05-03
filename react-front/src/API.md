# API Reference — Inventory Management

Base URL: `http://localhost:5000`

Rotas marcadas com **JWT** exigem o header:
```
Authorization: Bearer <token>
```

---

## Autenticação

### POST /auth/login
Autentica um usuário e retorna um JWT.

**Body (JSON)**
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| email | string | sim |
| password | string | sim |

**Resposta 200**
```json
{
  "mensagem": "Login realizado",
  "token": "<jwt>"
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 400 | Dados inválidos (campos faltando) |
| 401 | Credenciais incorretas |

---

## Usuários

### POST /users
Registra um novo seller. Envia código de ativação via WhatsApp.

**Body (JSON)**
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| name | string | sim |
| email | string | sim |
| cnpj | string | sim |
| password | string | sim |
| celular | string | não |

**Resposta 201**
```json
{
  "mensagem": "Seller cadastrado. Código enviado no WhatsApp",
  "usuarios": { ...user }
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 400 | Campos obrigatórios ausentes |

---

### PATCH /users/activate
Ativa a conta do usuário usando o código recebido via WhatsApp.

**Body (JSON)**
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| email | string | sim |
| code | string | sim |

**Resposta 200**
```json
{
  "mensagem": "Conta ativada com sucesso"
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 400 | Dados inválidos ou código incorreto |

---

### PATCH /users/me — **JWT**
Atualiza os dados do usuário autenticado.

**Body (JSON)** — enviar apenas os campos a alterar
| Campo | Tipo |
|-------|------|
| name | string |
| email | string |
| cnpj | string |
| celular | string |
| password | string |

**Resposta 200**
```json
{
  "mensagem": "Atualização realizada com sucesso!",
  "usuarios": { ...user }
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 404 | Usuário não encontrado |

---

## Produtos

### POST /products — **JWT**
Cria um novo produto para o seller autenticado.

**Body (multipart/form-data)**
| Campo | Tipo | Obrigatório | Padrão |
|-------|------|-------------|--------|
| name | string | sim | — |
| price | number | sim | — |
| quantity | integer | não | 0 |
| status | boolean (string) | não | true |

**Resposta 201**
```json
{
  "mensagem": "Produto cadastrado com sucesso",
  "produto": { ...product }
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 400 | Campos obrigatórios ausentes ou tipos inválidos |
| 401 | Token ausente ou inválido |

---

### GET /products — **JWT**
Lista todos os produtos do seller autenticado.

**Resposta 200**
```json
{
  "produtos": [
    {
      "id": 1,
      "name": "Produto A",
      "price": 19.99,
      "quantity": 10,
      "status": true,
      "seller_id": 3,
      "imagens": [
        { "id": 7, "nome_arquivo": "foto.png", "mime_type": "image/png", "url": "/documentos/7" }
      ],
      "documentos": [
        { "id": 7, "nome_arquivo": "foto.png", "mime_type": "image/png", "url": "/documentos/7" },
        { "id": 8, "nome_arquivo": "manual.pdf", "mime_type": "application/pdf", "url": "/documentos/8" }
      ]
    }
  ]
}
```

> `imagens` é um atalho que filtra apenas os documentos com `mime_type` iniciado em `image/`. O campo `documentos` continua retornando todos os arquivos do produto.

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |

---

### GET /products/{product_id} — **JWT**
Retorna um produto específico do seller autenticado.

**Parâmetros de rota**
| Parâmetro | Tipo |
|-----------|------|
| product_id | integer |

**Resposta 200**
```json
{
  "produto": { ...product }
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 403 | Produto pertence a outro seller |
| 404 | Produto não encontrado |

---

### PATCH /products/{product_id} — **JWT**
Atualiza os dados de um produto.

**Parâmetros de rota**
| Parâmetro | Tipo |
|-----------|------|
| product_id | integer |

**Body (multipart/form-data)** — enviar apenas os campos a alterar
| Campo | Tipo |
|-------|------|
| name | string |
| price | number |
| quantity | integer |
| status | boolean (string) |

**Resposta 200**
```json
{
  "mensagem": "Produto atualizado com sucesso",
  "produto": { ...product }
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 400 | Tipos inválidos |
| 401 | Token ausente ou inválido |
| 403 | Produto pertence a outro seller |
| 404 | Produto não encontrado |

---

### PATCH /products/{product_id}/deactivate — **JWT**
Inativa um produto.

**Parâmetros de rota**
| Parâmetro | Tipo |
|-----------|------|
| product_id | integer |

**Resposta 200**
```json
{
  "mensagem": "Produto inativado com sucesso"
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 403 | Produto pertence a outro seller |
| 404 | Produto não encontrado |

---

## Documentos

### POST /products/{product_id}/documentos — **JWT**
Faz upload de um documento vinculado a um produto.

**Parâmetros de rota**
| Parâmetro | Tipo |
|-----------|------|
| product_id | integer |

**Body (multipart/form-data)**
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| conteudo | file | sim |

**Resposta 201**
```json
{
  "mensagem": "Documento enviado com sucesso",
  "documento": { ...documento }
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 400 | Campo `conteudo` ausente ou arquivo inválido |
| 401 | Token ausente ou inválido |
| 403 | Produto pertence a outro seller |
| 404 | Produto não encontrado |

---

### GET /products/{product_id}/documentos — **JWT**
Lista todos os documentos de um produto.

**Parâmetros de rota**
| Parâmetro | Tipo |
|-----------|------|
| product_id | integer |

**Resposta 200**
```json
{
  "documentos": [ { ...documento } ]
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 403 | Produto pertence a outro seller |
| 404 | Produto não encontrado |

---

### GET /documentos/{documento_id} — **JWT**
Retorna o arquivo binário de um documento.

**Parâmetros de rota**
| Parâmetro | Tipo |
|-----------|------|
| documento_id | integer |

**Resposta 200**
Retorna o arquivo com `Content-Type` original e `Content-Disposition: inline; filename="<nome>"`.

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 403 | Produto do documento pertence a outro seller |
| 404 | Documento não encontrado |

---

### DELETE /documentos/{documento_id} — **JWT**
Remove um documento.

**Parâmetros de rota**
| Parâmetro | Tipo |
|-----------|------|
| documento_id | integer |

**Resposta 200**
```json
{
  "mensagem": "Documento removido com sucesso"
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 403 | Produto do documento pertence a outro seller |
| 404 | Documento não encontrado |

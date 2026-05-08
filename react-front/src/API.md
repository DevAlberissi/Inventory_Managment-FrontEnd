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

---

## Dashboard

### GET /dashboards — **JWT**
Retorna KPIs agregados de produtos, resumo de vendas e as últimas 6 vendas do seller autenticado.

**Resposta 200**
```json
{
  "total_produtos": 12,
  "produtos_ativos": 10,
  "estoque_baixo": 3,
  "valor_estoque": 4850.00,
  "resumo_vendas": {
    "total_vendido": 12400.00,
    "ticket_medio": 310.00,
    "unidades_vendidas": 87,
    "num_vendas": 40
  },
  "ultimas_vendas": [
    {
      "id": 1,
      "produto_id": 3,
      "produto_nome": "Camiseta",
      "quantidade": 2,
      "preco_unitario": 49.90,
      "total": 99.80,
      "created_at": "2026-05-07T10:00:00"
    }
  ]
}
```

> `estoque_baixo` conta produtos com `quantity < 5`.
> `ticket_medio` é a média do valor por linha de venda (`quantidade × preco_unitario`).
> `ultimas_vendas` retorna no máximo 6 vendas, ordenadas da mais recente para a mais antiga.

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |

---

## Vendas

### POST /vendas — **JWT**
Registra uma nova venda, descontando o estoque do produto.

**Body (JSON)**
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| produto_id | integer | sim |
| quantidade | integer | sim |

**Resposta 201**
```json
{
  "mensagem": "Venda registrada com sucesso",
  "venda": {
    "id": 1,
    "produto_id": 5,
    "seller_id": 3,
    "quantidade": 2,
    "preco_unitario": 19.99,
    "created_at": "2026-05-07T14:30:00"
  }
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 400 | Body ausente, campos obrigatórios faltando ou tipos inválidos |
| 401 | Token ausente ou inválido |
| 403 | Seller inativo, produto pertence a outro seller ou produto inativo |
| 404 | Produto não encontrado |
| 422 | Estoque insuficiente para a quantidade solicitada |

---

### GET /vendas — **JWT**
Lista todas as vendas do seller autenticado.

**Resposta 200**
```json
{
  "vendas": [
    {
      "id": 1,
      "produto_id": 5,
      "seller_id": 3,
      "quantidade": 2,
      "preco_unitario": 19.99,
      "created_at": "2026-05-07T14:30:00",
      "produto": {
        "id": 5,
        "name": "Camiseta",
        "imagens": [
          {
            "id": 1,
            "product_id": 5,
            "nome_arquivo": "camiseta.jpg",
            "mime_type": "image/jpeg"
          }
        ]
      }
    }
  ]
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |

---

### GET /vendas/{venda_id} — **JWT**
Retorna uma venda específica do seller autenticado.

**Parâmetros de rota**
| Parâmetro | Tipo |
|-----------|------|
| venda_id | integer |

**Resposta 200**
```json
{
  "venda": {
    "id": 1,
    "produto_id": 5,
    "seller_id": 3,
    "quantidade": 2,
    "preco_unitario": 19.99,
    "created_at": "2026-05-07T14:30:00"
  }
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 403 | Venda pertence a outro seller |
| 404 | Venda não encontrada |

---

### DELETE /vendas/{venda_id} — **JWT**
Cancela uma venda e devolve a quantidade ao estoque do produto.

**Parâmetros de rota**
| Parâmetro | Tipo |
|-----------|------|
| venda_id | integer |

**Resposta 200**
```json
{
  "mensagem": "Venda cancelada com sucesso"
}
```

**Erros**
| Status | Descrição |
|--------|-----------|
| 401 | Token ausente ou inválido |
| 403 | Venda pertence a outro seller |
| 404 | Venda não encontrada |

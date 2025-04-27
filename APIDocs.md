# Documentação da API Paraamin

Esta documentação descreve os endpoints disponíveis na API do projeto Paraamin.

## Estilo e Design

### Tema
- **Conceito**: Romântico e minimalista, com transições suaves e animações delicadas.
- **Elementos visuais**: Elementos com bordas arredondadas, sombras suaves e transições animadas para criar uma sensação de fluidez e delicadeza.

### Paleta de Cores
- **Rosa (#FD5E83, #FF87AB)**: Cor principal, utilizada em títulos, botões e elementos de destaque.
- **Dourado (#D4AF37, #FFD700)**: Utilizado em detalhes, bordas e elementos decorativos.
- **Branco (#FFFFFF, #F8F9FA)**: Cor de fundo principal, transmite leveza e elegância.
- **Vermelho Suave (#FF9999, #FFCCCB)**: Utilizado para alertas, notificações e elementos interativos secundários.

### Tipografia
- **Títulos**: Fonte serif (Playfair Display) para transmitir elegância e romantismo.
- **Corpo de texto**: Fonte sans-serif leve (Raleway) para manter a legibilidade e transmitir suavidade.

### Componentes
- **Botões**: Bordas arredondadas, preferencialmente em formato pill (rounded-full), com transições suaves ao passar o mouse.
- **Cards**: Cantos arredondados com sombras suaves, elementos de hover delicados.
- **Modais**: Animações de entrada e saída suaves, fundo levemente desfocado.
- **Formulários**: Campos com bordas suaves, feedback visual suave ao focar.

### Animações
- **Transições**: Duração de 200-300ms para criar uma sensação de suavidade.
- **Hover**: Escalas sutis (1.03-1.05) e transições de cor gradual.
- **Page transitions**: Fade-in/fade-out com pequenos movimentos para adicionar profundidade.

## Estrutura do Banco de Dados

O projeto utiliza as seguintes tabelas:

### Photos
- `url`: string - URL da imagem armazenada
- `caption`: string - Legenda da foto
- `date`: number - Data de upload da foto
- `storageId`: ID de referência para o storage

### TimelineEvents
- `title`: string - Título do evento
- `description`: string - Descrição do evento
- `date`: number - Data do evento
- `type`: "event" | "motivation" - Tipo do evento
- `imageStorageId`: opcional, ID de referência para a imagem associada

## Endpoints Convex

### Photos

#### generateUploadUrl
- **Método**: POST
- **Descrição**: Gera uma URL para upload de fotos
- **Argumentos**: Nenhum
- **Retorno**: URL para upload

#### savePhoto
- **Método**: POST
- **Descrição**: Salva uma foto no banco de dados
- **Argumentos**:
  - `storageId`: ID do storage (_storage)
  - `caption`: Legenda da foto (string)
  - `date`: Data do upload (número)
- **Retorno**: ID da foto inserida

#### listPhotos
- **Método**: GET
- **Descrição**: Lista todas as fotos ordenadas por data (decrescente)
- **Argumentos**: Nenhum
- **Retorno**: Lista de objetos de fotos

### Timeline

#### addEvent
- **Método**: POST
- **Descrição**: Adiciona um evento na timeline
- **Argumentos**:
  - `title`: Título do evento (string)
  - `description`: Descrição do evento (string)
  - `date`: Data do evento (número)
  - `type`: Tipo do evento ('event' ou 'motivation')
  - `imageStorageId`: ID do storage da imagem (opcional)
- **Retorno**: ID do evento inserido

#### listEvents
- **Método**: GET
- **Descrição**: Lista todos os eventos da timeline ordenados por data (crescente)
- **Argumentos**: Nenhum
- **Retorno**: Lista de objetos de eventos

## Supabase API

A aplicação também utiliza o Supabase como backend para armazenamento de dados, autenticação e gerenciamento de usuários.

### Configuração do Supabase
- **URL do Projeto**: https://rfoxovjukfzmffcocdyt.supabase.co
- **API Key Anônima**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmb3hvdmp1a2Z6bWZmY29jZHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Njk1MDQsImV4cCI6MjA2MTM0NTUwNH0.RN-spvfBPRd2aJ9b_iz5qykRzvK6jE8QCE2ADPk7T58

### Estrutura do Banco de Dados Supabase

#### Tabela: profiles
- `id`: uuid (referência para auth.users.id, primary key)
- `created_at`: timestamp with time zone
- `updated_at`: timestamp with time zone
- `full_name`: text
- `avatar_url`: text
- `birthday`: date
- `relationship_date`: date
- `bio`: text

#### Tabela: messages
- `id`: uuid (primary key)
- `created_at`: timestamp with time zone
- `user_id`: uuid (foreign key para profiles.id)
- `content`: text
- `is_special`: boolean
- `read`: boolean
- `category`: text (pode ser 'love', 'memory', 'future_plans')

#### Tabela: relationship_milestones
- `id`: uuid (primary key)
- `created_at`: timestamp with time zone
- `title`: text
- `description`: text
- `date`: date
- `image_url`: text
- `importance`: integer (1-5 escala)

#### Tabela: special_dates
- `id`: uuid (primary key)
- `created_at`: timestamp with time zone
- `title`: text
- `date`: date
- `recurrence`: text (yearly, monthly, once)
- `reminder_days`: integer
- `description`: text

#### Tabela: wishlist
- `id`: uuid (primary key)
- `created_at`: timestamp with time zone
- `user_id`: uuid (foreign key para profiles.id)
- `item_name`: text
- `description`: text
- `link`: text
- `priority`: integer (1-3)
- `fulfilled`: boolean

### Funcionalidades do Supabase

#### Autenticação
O Supabase fornece um sistema completo de autenticação com:
- Autenticação por email e senha
- Autenticação por provedores OAuth (Google, Facebook, etc.)
- Gerenciamento de sessões

#### Gerenciamento de Usuários
- Criação, atualização e remoção de usuários
- Perfis de usuário personalizados
- Controle de acesso baseado em funções (RBAC)

#### Banco de Dados
- Armazenamento relacional PostgreSQL
- API RESTful para acesso às tabelas
- Consultas e filtragens complexas

#### RPC (Remote Procedure Call)
- Funções personalizadas no PostgreSQL
- Acesso seguro a funções do banco de dados

### Exemplo de uso da API Supabase no frontend:

```typescript
import { createClient } from '@supabase/supabase-js'

// Inicialização do cliente Supabase
const supabaseUrl = 'https://rfoxovjukfzmffcocdyt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmb3hvdmp1a2Z6bWZmY29jZHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Njk1MDQsImV4cCI6MjA2MTM0NTUwNH0.RN-spvfBPRd2aJ9b_iz5qykRzvK6jE8QCE2ADPk7T58'
const supabase = createClient(supabaseUrl, supabaseKey)

// Autenticação
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  return { data, error }
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Consulta ao banco de dados
async function fetchData(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
  return { data, error }
}

// Inserção de dados
async function insertData(tableName, data) {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
  return { result, error }
}

// Chamada a uma função RPC
async function callRpcFunction(functionName, params) {
  const { data, error } = await supabase
    .rpc(functionName, params)
  return { data, error }
}
```

## Integração entre Convex e Supabase

A aplicação utiliza o Convex para gerenciamento da timeline e fotos, enquanto o Supabase é utilizado para autenticação, gerenciamento de usuários e armazenamento adicional. O frontend da aplicação coordena as chamadas para ambas as APIs conforme necessário.

## Notas Adicionais

- Todas as datas são armazenadas como timestamps (números)
- Os IDs de storage são referências para arquivos armazenados no sistema de storage do Convex
- Os eventos na timeline são ordenados em ordem crescente por data
- As fotos são ordenadas em ordem decrescente por data
- O Supabase fornece recursos adicionais como armazenamento de arquivos, funções serverless e webhooks

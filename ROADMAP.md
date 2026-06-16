# 🔒 Roadmap de Segurança

Este roadmap define a evolução de segurança do Nimbus em etapas progressivas, desde o MVP até um Secrets Manager completo.

---

## Etapa 1 — MVP Público

> **Objetivo:** Colocar online e permitir que outras pessoas testem.  
> **Senioridade:** Júnior → Pleno

### Já implementado

- ✅ HTTPS
- ✅ Criptografia dos `.env`
- ✅ Senha com bcrypt ou Argon2
- ✅ JWT
- ✅ UUID
- ✅ Rate Limit
- ✅ CORS
- ✅ Validação por Schema
- ✅ Isolamento por usuário

### Adicionar

- [ ] JWT com expiração
- [ ] Revisão dos logs para garantir que nenhum segredo apareça
- [ ] Tratamento padronizado de erros
- [ ] Página 404

**Valor agregado:** ⭐⭐⭐⭐⭐ — Pouco esforço e muito ganho de segurança.

---

## Etapa 2 — Produto Utilizável

> **Objetivo:** Eu confiaria meus próprios `.env` nele.  
> **Senioridade:** Pleno

### Adicionar

- [ ] Auditoria mínima
- [ ] Logout
- [ ] Backup diário
- [ ] Recuperação de senha
- [ ] Verificação de e-mail
- [ ] Cookie HttpOnly

### Auditoria mínima

Tabela `audit_logs`:

| Campo         | Descrição                   |
| ------------- | --------------------------- |
| `id`          | Identificador único         |
| `user_id`     | Usuário que executou a ação |
| `action`      | Tipo de evento              |
| `resource_id` | Recurso afetado             |
| `created_at`  | Data/hora do evento         |

Eventos:

```
CREATE_SECRET
UPDATE_SECRET
DELETE_SECRET
VIEW_SECRET
```

**Valor agregado:** ⭐⭐⭐⭐⭐ — Grande aumento de confiabilidade.

---

## Etapa 3 — SaaS de Verdade

> **Objetivo:** Começar a cobrar pelo produto.  
> **Senioridade:** Pleno Forte

### Adicionar

- [ ] Refresh Token
- [ ] Sessões persistentes
- [ ] Revogação de sessão
- [ ] Múltiplos dispositivos
- [ ] Monitoramento
- [ ] Health Checks
- [ ] Logs estruturados

### Exemplo — Sessões ativas

```
Chrome     ✅ Ativa
Firefox    ✅ Ativa   → [Revogar]
Android    ✅ Ativa
```

**Valor agregado:** ⭐⭐⭐⭐ — Melhora experiência e segurança.

---

## Etapa 4 — Produto Profissional

> **Objetivo:** Atender pequenas empresas.  
> **Senioridade:** Sênior Backend

### Adicionar

- [ ] MFA (2FA)
- [ ] Versionamento dos segredos
- [ ] Soft Delete
- [ ] Recuperação de segredos apagados
- [ ] Exportação segura
- [ ] Histórico de alterações
- [ ] Alertas de segurança

### Exemplo — Versionamento

```
DATABASE_URL
  v1  2024-01-10
  v2  2024-02-15
  v3  2024-03-20  ← atual
  v4  2024-04-01  → [Restaurar]
```

**Valor agregado:** ⭐⭐⭐⭐ — Muito útil para equipes e ambientes reais.

---

## Etapa 5 — Secrets Manager

> **Objetivo:** Competir com soluções especializadas.  
> **Senioridade:** Sênior Forte

### Adicionar

- [ ] Compartilhamento de segredos
- [ ] Organizações
- [ ] Times
- [ ] RBAC
- [ ] Ambientes

### Estrutura

```
Empresa
├── Produção
├── Staging
└── Desenvolvimento
```

Permissões:

```
Admin   → Leitura + Escrita + Gerenciamento
Editor  → Leitura + Escrita
Viewer  → Leitura
```

**Valor agregado:** ⭐⭐⭐⭐⭐ — Transforma o projeto em produto comercial robusto.

---

## Etapa 6 — Engenharia de Segurança

> **Objetivo:** Atender requisitos corporativos.  
> **Senioridade:** Staff Engineer

### Adicionar

- [ ] Rotação de chave
- [ ] Chave por usuário
- [ ] Chave por organização
- [ ] Criptografia Envelope
- [ ] Integração KMS
- [ ] MFA obrigatório
- [ ] Alertas de acesso suspeito
- [ ] SIEM
- [ ] Trilha de auditoria imutável

### Exemplo — Criptografia Envelope

```
Hoje:     Master Key → Todos os segredos

Futuro:   Master Key → Data Key → Segredo
```

**Valor agregado:** ⭐⭐⭐ — Complexidade alta, normalmente voltada para clientes corporativos.

---

## Ordem Recomendada de Implementação

| Prioridade                        | Itens                                                                 |
| --------------------------------- | --------------------------------------------------------------------- |
| **Agora**                         | JWT com expiração, Cookie HttpOnly, Logout, Auditoria mínima          |
| **Depois**                        | Backup automático, Recuperação de senha, Verificação de e-mail        |
| **Quando tiver usuários**         | Refresh Token, Sessões, Revogação de sessão                           |
| **Quando tiver clientes pagando** | MFA, Versionamento dos segredos, Histórico de alterações              |
| **Ignorar por enquanto**          | KMS, HSM, Rotação automática de chaves, SIEM, Criptografia por tenant |

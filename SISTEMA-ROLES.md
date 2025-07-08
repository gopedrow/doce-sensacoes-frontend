# Sistema de Controle de Acesso Baseado em Roles - Doce Sensações

## 📋 Visão Geral

Este sistema implementa controle de acesso baseado em tipos de usuário (administrador e cliente) para a página de perfil do sistema web Doce Sensações. A funcionalidade verifica o tipo de perfil do usuário logado e exibe funcionalidades específicas apenas para administradores.

## 🎯 Funcionalidades Implementadas

### 👑 Perfil de Administrador
- **Cadastro de Produtos**: Adicionar, editar e excluir produtos do catálogo
- **Promoções**: Criar e gerenciar cupons de desconto e campanhas promocionais
- **Dashboard Administrativo**: Relatórios de vendas, produtos mais vendidos e feedbacks

### 👤 Perfil de Cliente
- Acesso apenas às funcionalidades padrão da conta de cliente
- Sem acesso aos recursos administrativos

## 🏗️ Arquitetura do Sistema

### Frontend
- `frontend/assets/js/role-manager.js` - Sistema principal de gerenciamento de roles
- `frontend/assets/css/admin-styles.css` - Estilos específicos para elementos administrativos
- `frontend/perfil.html` - Página principal integrada com o sistema de roles

### Backend
- `backend/src/middleware/auth.js` - Middleware de verificação de permissões
- `backend/scripts/create-admin.js` - Script para criar usuários administradores

## 🔧 Configuração e Instalação

### 1. Criar Usuário Administrador

Execute o script para criar um usuário administrador:

```bash
cd backend
node scripts/create-admin.js create
```

Credenciais padrão:
- **Email**: admin@doce-sensacoes.com
- **Senha**: admin123
- **Tipo**: admin

### 2. Listar Usuários Administradores

```bash
cd backend
node scripts/create-admin.js list
```

### 3. Verificar Sistema de Roles

O sistema verifica automaticamente se o usuário logado tem permissões de administrador e renderiza os elementos apropriados.

## 🔐 Sistema de Permissões

### Tipos de Usuário
- `admin` - Acesso completo a todas as funcionalidades
- `client` - Acesso limitado às funcionalidades de cliente

### Permissões por Tipo

#### Administrador
```javascript
[
  'manage_products',    // Gerenciar produtos
  'manage_promotions',  // Gerenciar promoções
  'view_dashboard',     // Visualizar dashboard admin
  'manage_orders',      // Gerenciar pedidos
  'view_reports',       // Visualizar relatórios
  'manage_users'        // Gerenciar usuários
]
```

#### Cliente
```javascript
[
  'view_products',      // Visualizar produtos
  'place_orders',       // Fazer pedidos
  'view_profile',       // Visualizar perfil
  'view_orders'         // Visualizar pedidos
]
```

## 🎨 Interface do Usuário

### Elementos Visuais para Administradores

1. **Badge de Administrador**: Indicador visual no perfil do usuário
2. **Seção Administrativa no Menu**: Itens específicos para admin
3. **Cards Administrativos**: Design diferenciado com bordas e cores especiais
4. **Ícones Específicos**: Ícones distintos para funcionalidades administrativas

### Responsividade
- Menu desktop com texto completo
- Menu mobile com apenas ícones
- Layout adaptativo para diferentes tamanhos de tela

## 🔒 Segurança

### Validações Implementadas

1. **Verificação de Sessão**: Valida se o usuário está autenticado
2. **Verificação de Token**: Valida o token JWT no servidor
3. **Verificação de Permissões**: Verifica se o usuário tem permissão para acessar recursos
4. **Middleware de Proteção**: Bloqueia acesso a rotas administrativas

### Middleware de Autenticação

```javascript
// Verifica se é administrador
const requireAdmin = (req, res, next) => {
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
    });
  }
  next();
};
```

## 📱 Funcionalidades Administrativas

### 1. Cadastro de Produtos
- **Adicionar Produto**: Formulário completo com validação
- **Editar Produto**: Modificar informações existentes
- **Excluir Produto**: Remover produtos do catálogo
- **Listagem**: Visualização em grid responsivo

### 2. Gerenciamento de Promoções
- **Criar Cupons**: Códigos de desconto personalizados
- **Calendário de Campanhas**: Configurar datas de início e fim
- **Estatísticas de Engajamento**: Métricas de uso de cupons
- **Relatórios**: Descontos aplicados e conversões

### 3. Dashboard Administrativo
- **Relatórios de Vendas**: Receita mensal e total de pedidos
- **Produtos Mais Vendidos**: Ranking de produtos populares
- **Feedbacks de Clientes**: Avaliações e comentários
- **Métricas de Performance**: Indicadores de sucesso

## 🚀 Como Usar

### Para Desenvolvedores

1. **Verificar Permissões**:
```javascript
if (window.RoleManager.isAdmin()) {
  // Código específico para administradores
}
```

2. **Verificar Permissão Específica**:
```javascript
if (window.RoleManager.hasPermission('manage_products')) {
  // Mostrar funcionalidade de gerenciar produtos
}
```

3. **Renderizar Conteúdo Condicional**:
```javascript
if (window.RoleManager.isAdmin()) {
  const adminContent = window.RoleManager.renderAdminContent('dashboard-admin');
  // Renderizar conteúdo administrativo
}
```

### Para Administradores

1. Faça login com credenciais de administrador
2. Acesse a página de perfil
3. Visualize os itens administrativos no menu lateral
4. Acesse as funcionalidades específicas:
   - Cadastro de Produtos
   - Promoções
   - Dashboard Administrativo

## 🐛 Troubleshooting

### Problemas Comuns

1. **Elementos administrativos não aparecem**:
   - Verifique se o usuário tem `user_type: 'admin'`
   - Confirme se o token está válido
   - Verifique se o arquivo `role-manager.js` foi carregado

2. **Erro de acesso negado**:
   - Verifique as permissões do usuário no backend
   - Confirme se o middleware `requireAdmin` está funcionando

3. **Estilos não aplicados**:
   - Verifique se o arquivo `admin-styles.css` foi carregado
   - Confirme se as classes CSS estão sendo aplicadas

### Logs de Debug

```javascript
// Habilitar logs de debug
console.log('Usuário atual:', window.RoleManager.getCurrentUser());
console.log('É admin?', window.RoleManager.isAdmin());
console.log('Tem permissão?', window.RoleManager.hasPermission('manage_products'));
```

## 📈 Próximas Melhorias

1. **Sistema de Logs**: Registrar ações administrativas
2. **Auditoria**: Histórico de mudanças em produtos e promoções
3. **Notificações**: Sistema de alertas para administradores
4. **Relatórios Avançados**: Gráficos e análises detalhadas
5. **Gestão de Usuários**: Interface para gerenciar clientes

## 🤝 Contribuição

Para contribuir com o sistema:

1. Mantenha a segurança como prioridade
2. Teste todas as funcionalidades em ambos os tipos de usuário
3. Documente novas funcionalidades
4. Siga os padrões de código estabelecidos

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique a documentação do sistema
- Consulte os logs de erro
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido para Doce Sensações** 🍰
*Sistema de controle de acesso seguro e escalável* 
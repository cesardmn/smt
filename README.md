# SMT Formater

Conversor e validador de planilhas Excel para o formato CSV do Sistema de Mensagens Telemáticas dos Correios (SMT).

## Visão Geral

O **SMT Formater** é uma aplicação web que automatiza a preparação de arquivos para o envio de telegramas via SMT dos Correios. O sistema realiza a validação, padronização e divisão de dados, garantindo conformidade com as regras do serviço e facilitando o processo para empresas e profissionais.

## Funcionalidades

- **Conversão automática:** Transforma planilhas `.xlsx` em arquivos `.csv` compatíveis com o SMT.
- **Validação de dados:** Verifica campos obrigatórios, formatos e CEPs válidos via integração com a API ViaCEP.
- **Tratamento de erros:** Registros inválidos são separados e disponibilizados para revisão.
- **Divisão de arquivos:** Gera múltiplos arquivos CSV quando o volume excede 200 registros.
- **Modelo de planilha:** Disponibiliza template atualizado para preenchimento.
- **Interface amigável:** Upload por arrastar e soltar, logs de processamento e download simplificado dos resultados.

## Como Utilizar

1. **Baixe o modelo de planilha:**  
   [template_modelo_smt.xlsx](public/docs/template_modelo_smt.xlsx)
2. **Preencha os dados conforme instruções do modelo.**
3. **Faça upload do arquivo `.xlsx` na interface web.**
4. **Aguarde o processamento e baixe os arquivos gerados:**
   - Arquivos `.csv` válidos (em partes de até 200 registros)
   - Arquivo `.xlsx` com registros inválidos (se houver)

Para detalhes sobre o preenchimento, consulte o [manual oficial do SMT](public/docs/02_Manual_do_Usuário_-_SMT_2.27_-_Telegrama.pdf).

## Instalação e Execução

### Pré-requisitos

- Node.js >= 18
- npm >= 9

### Passos

```sh
git clone https://github.com/cesardmn/smt.git
cd smt
npm install
npm run dev
```

Acesse [http://localhost:3000/smt/](http://localhost:3000/smt/) no navegador.

## Scripts

- `npm run dev` — Inicia o ambiente de desenvolvimento
- `npm run build` — Gera a build de produção
- `npm run preview` — Visualiza a build localmente
- `npm run lint` — Executa análise estática de código
- `npm run format` — Formata o código e executa o linter

## Estrutura do Projeto

- [`src/components/`](src/components/) — Componentes React da interface
- [`src/hooks/useFileProcessor`](src/hooks/useFileProcessor.jsx) — Hook principal de processamento de arquivos
- [`src/utils/`](src/utils/) — Utilitários de leitura, formatação, geração de CSV e validação
- [`public/docs/`](public/docs/) — Documentação e modelo de planilha
- [`public/img/`](public/img/) — Imagens e ícones

## Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SheetJS/xlsx](https://sheetjs.com/)
- [jszip](https://stuk.github.io/jszip/)
- [react-icons](https://react-icons.github.io/react-icons/)

## Licença

MIT © 2025 Cesar Dimi

---

uma ferramenta [autoflux](https://autoflux.app.br/)

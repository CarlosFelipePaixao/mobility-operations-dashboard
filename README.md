# Mobility Operations Dashboard

Este é um dashboard frontend para acompanhar operações de mobilidade urbana, como corridas e entregas.

Criei este projeto para praticar e demonstrar alguns pontos importantes de desenvolvimento Frontend: TypeScript, JavaScript puro, CSS, consumo de dados via `fetch`, filtros, ordenação, responsividade e organização de código.

A ideia foi construir uma interface parecida com algo que poderia ser usado por uma empresa de mobilidade para visualizar operações em andamento, concluídas, pendentes ou canceladas.

## Preview

Em breve adicionarei aqui o link do projeto publicado.

## Funcionalidades

* Dashboard com indicadores das operações
* Listagem de corridas e entregas
* Busca por motorista, cliente, origem ou destino
* Filtro por status
* Filtro por cidade
* Ordenação por data ou valor
* Painel lateral com detalhes da operação
* Estado de carregamento
* Mensagem quando nenhum resultado é encontrado
* Layout responsivo para desktop e mobile
* Consumo de dados usando uma API simulada em JSON

## Tecnologias utilizadas

* HTML
* CSS puro
* TypeScript
* JavaScript Vanilla
* Fetch API
* Vite
* Git e GitHub

## Por que fiz este projeto

Meu objetivo com este projeto foi criar algo mais próximo de uma situação real de trabalho, em vez de apenas uma tela estática.

Por isso, além da parte visual, também trabalhei com:

* busca e filtros dinâmicos;
* ordenação dos dados;
* renderização dos cards com TypeScript;
* separação entre tipos, API, utilitários e estilos;
* tratamento de estados da interface;
* layout responsivo;
* interação com painel de detalhes.

Também optei por usar JavaScript/TypeScript sem frameworks de interface, para reforçar a base de Frontend e mostrar domínio dos fundamentos.

## Estrutura do projeto

```txt
mobility-operations-dashboard/
├── public/
│   └── api/
│       └── rides.json
├── src/
│   ├── api/
│   │   └── mobilityApi.ts
│   ├── assets/
│   ├── styles/
│   │   └── main.css
│   ├── types/
│   │   └── ride.ts
│   ├── utils/
│   │   └── formatters.ts
│   └── main.ts
├── index.html
├── package.json
└── README.md
```

## Como rodar o projeto

Clone o repositório:

```bash
git clone https://github.com/CarlosFelipePaixao/mobility-operations-dashboard.git
```

Entre na pasta do projeto:

```bash
cd mobility-operations-dashboard
```

Instale as dependências:

```bash
npm install
```

Rode o projeto localmente:

```bash
npm run dev
```

Depois acesse no navegador:

```txt
http://localhost:5173
```

## Build

Para gerar a versão de produção:

```bash
npm run build
```

Para visualizar a versão de produção localmente:

```bash
npm run preview
```

## O que aprendi/reforcei com este projeto

Durante o desenvolvimento, trabalhei principalmente com:

* organização de um projeto Frontend com Vite;
* tipagem de dados com TypeScript;
* manipulação do DOM sem framework;
* consumo de dados com `fetch`;
* criação de filtros e ordenação;
* renderização dinâmica de componentes;
* responsividade com CSS puro;
* versionamento com Git;
* melhoria da experiência do usuário com estados de loading, lista vazia e painel de detalhes.

## Próximos passos

Algumas melhorias que pretendo adicionar:

* publicar o projeto em uma plataforma de deploy;
* adicionar screenshots no README;
* melhorar a acessibilidade do painel de detalhes;
* adicionar mais dados simulados;
* criar testes simples para as funções de filtro e ordenação.

# Deck API

Esse é o backend do projeto Deck, um projeto de uma aplicação que servirá como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.

## Requisitos Funcionais (RF's)

### 1. Cadastrar Usuário

- [x]  RF01 - Deve ser possível se cadastrar como estudante.

### 2. Autenticar Usuário

- [x]  RF02 - Deve ser possível fazer login como estudante.

### 3. Gerenciar Projetos

- [x]  RF05 - Deve ser possível publicar um projeto;
- [x]  RF06 - Deve ser possível editar um projeto;
- [x]  RF07 - Deve ser possível excluir um projeto.

### 4. Exibir Projetos

- [x]  RF08 - Deve ser possível visualizar o feed com as publicações;
- [x]  RF09 - Deve ser possível visualizar os detalhes de um projeto;
- [x]  RF10 - Deve ser possível filtrar as publicações;
- [x]  RF11 - Deve ser possível pesquisar publicações.

### 5. Interagir com Projetos

- [x]  RF12 - Deve ser possível comentar em um projeto;
- [x]  RF13 - Deve ser possível excluir um comentário;
- [x]  RF14 - Deve ser possível denunciar um comentário.

### 6. Gerenciar Perfil

- [x]  RF15 - Deve ser possível visualizar o perfil de um estudante;
- [x]  RF16 - Deve ser possível pesquisar estudantes;
- [x]  RF17 - Deve ser possível editar um perfil.

### 7. Exportar Portfólio:

- [ ]  RF18 - Deve ser possível exportar o portfólio de um estudante;

## Regras de Negócio (RN's)

### 1. Cadastrar Usuário

- [x]  RN01 - O estudante deve conter um email institucional da UFC (@alu.ufc.br);
- [x]  RN02 - O estudante não pode se cadastrar com um email já cadastrado;
- [x]  RN03 - O estudante deve conter um nome de usuário único;
- [x]  RN04 - O estudante deve conter uma senha com no mínimo 6 caracteres;
- [ ]  RN05 - O nome do estudante deve ser composto apenas por letras;
- [x]  RN06 - O estudante deve fazer parte de um semestre.

### 2. Autenticar Usuário

- [x]  RN07 - O usuário deve ser autenticado com um email e senha válidos.

### 3. Gerenciar Projetos

- [x]  RN08 - O projeto deve conter um banner;
- [ ]  RN09 - O projeto deve conter obrigatoriamente título, descrição uma trilha, um semestre e o ano de publicação.

### 4. Exibir Projetos

- [ ]  RN10 - Se o usuário for um estudante logado, o feed deve ser ordenado com projetos alinhados com o semestre do usuário (se o usuário estiver no 4º semestre, os projetos do 4º semestre devem aparecer primeiro, depois os do 5º, 6º, e assim por diante, até o 1º semestre);
- [x]  RN11 - Se o usuário não estiver logado, o feed deve ser disposto por data da publicação.

### 5. Interagir com Projetos

- [ ]  RN12 - O comentário não pode conter palavras ofensivas;
- [ ]  RN13 - O comentário não pode ser feito em um projeto com os comentários desativados;
- [x]  RN14 - Somente estudantes logados podem comentar em projetos;
- [x]  RN15 - Um comentário só pode ser excluído pelo seu autor ou pelo autor do projeto.

### 6. Gerenciar Perfil

- [x]  RN16 - O usuário só pode editar o seu próprio perfil.

### 7. Exportar Portfólio

- ...

## Requisitos Não Funcionais (RNF's)

### Segurança

- [x]  RNF01 - A senha do usuário deve ser criptografada;
- [x]  RNF02 - O usuário deve ser autenticado com JWT.

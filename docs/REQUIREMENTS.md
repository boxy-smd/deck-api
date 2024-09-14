# Deck API

Esse é o backend do projeto Deck, um projeto de uma aplicação que servirá como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.

## Requisitos Funcionais (RF's)

### 1. Cadastrar Usuário

- [x] RF01 - Deve ser possível se cadastrar como estudante;
- [x] RF02 - Deve ser possível fazer o upload de uma foto de perfil.

### 2. Autenticar Usuário

- [x] RF03 - Deve ser possível fazer login como estudante.

### 3. Gerenciar Projetos

- [x] RF04 - Deve ser possível publicar um projeto;
- [x] RF05 - Deve ser possível fazer o upload de um banner para o projeto;
- [x] RF06 - Deve ser possível editar um projeto em rascunho;
- [x] RF07 - Deve ser possível excluir um projeto.

### 4. Exibir Projetos

- [x] RF08 - Deve ser possível visualizar o feed com os projetos publicados;
- [ ] RF09 - Deve ser possível visualizar o feed de acordo com o semestre do usuário;
- [x] RF10 - Deve ser possível visualizar os detalhes de um projeto;
- [x] RF11 - Deve ser possível filtrar projetos por trilha, semestre, ano e disciplina;
- [ ] RF12 - Deve ser possível pesquisar projetos por título, professor e tags;
- [x] RF13 - Deve ser possível visualizar os projetos de um usuário.

### 5. Interagir com Projetos

- [x] RF14 - Deve ser possível comentar em um projeto;
- [x] RF15 - Deve ser possível excluir o seu comentário em um projeto;
- [ ] RF16 - Deve ser possível excluir o comentário de outro usuário no seu projeto.

### 6. Gerenciar Perfil

- [x] RF17 - Deve ser possível visualizar o seu perfil;
- [x] RF18 - Deve ser possível visualizar o perfil de outro usuário;
- [x] RF19 - Deve ser possível pesquisar usuários por nome;
- [x] RF20 - Deve ser possível editar o seu perfil.

### 7. Exportar Portfólio:

- ...

## Regras de Negócio (RN's)

### 1. Cadastrar Usuário

- [x] RN01 - O usuário deve conter um email institucional da UFC (@alu.ufc.br);
- [x] RN02 - O usuário não pode se cadastrar com um email já cadastrado;
- [x] RN03 - O usuário deve conter um nome de usuário único;
- [x] RN04 - O usuário deve conter uma senha com no mínimo 6 caracteres.

### 2. Autenticar Usuário

- [x] RN05 - O usuário deve ser autenticado com um email e senha válidos.

### 3. Gerenciar Projetos

- [ ] RN06 - O projeto deve conter um título com no máximo xxx caracteres;
- [ ] RN07 - O projeto deve conter uma descrição com no máximo xxx caracteres;
- [x] RN08 - O projeto deve conter obrigatoriamente uma trilha, um semestre e o ano de publicação.

### 4. Exibir Projetos

- [ ] RN09 - O feed deve ser ordenado com projetos alinhados com o semestre do usuário (se o usuário estiver no 4º semestre, os projetos do 4º semestre devem aparecer primeiro, depois os do 5º, 6º, e assim por diante, até o 1º semestre).

### 5. Interagir com Projetos

- [ ] RN10 - O comentário não pode conter palavras ofensivas;
- [ ] RN11 - O comentário não pode ser feito em um projeto com os comentários desativados;
- [ ] RN12 - O usuário só pode excluir o seu próprio comentário.

### 6. Gerenciar Perfil

- [x] RN13 - O usuário só pode editar o seu próprio perfil.

### 7. Exportar Portfólio

- ...

## Requisitos Não Funcionais (RNF's)

- [ ] RNF01 - A senha do usuário deve ser criptografada;
- [ ] RNF02 - O usuário deve ser autenticado com JWT.

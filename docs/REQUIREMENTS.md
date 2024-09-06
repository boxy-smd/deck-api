# Deck API

Esse é o backend do projeto "Boxy", um projeto de uma aplicação que servirá como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.

## Requisitos Funcionais (RF's)

### Usuário

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar.

### Projeto

- [x] Deve ser possível publicar um projeto;
- [ ] Deve ser possível editar um projeto;
- [ ] Deve ser possível excluir um projeto;
- [ ] Deve ser possível visualizar os projetos que você publicou;
- [ ] Deve ser possível visualizar os projetos de um usuário específico;
- [ ] Deve ser possível visualizar os projetos em um feed;
- [ ] Deve ser possível pesquisar por projetos por título;
- [ ] Deve ser possível filtrar projetos por tags e ano.

### Perfil

- [x] Deve ser possível visualizar o seu perfil;
- [x] Deve ser possível editar o seu perfil;
- [x] Deve ser possível visualizar o perfil de outro usuário.

### Comentários

- [ ] Deve ser possível comentar em um projeto;
- [ ] Deve ser possível excluir o seu comentário em um projeto;
- [ ] Deve ser possível excluir o comentário de outro usuário no seu projeto;
- [x] Deve ser possível desativar os comentários do seu projeto.

### Portfólio

- [ ] Deve ser possível exportar um portfólio em PDF com os seus projetos e perfil.

## Regras de Negócio (RN's)

### Usuário

- [x] O usuário deve conter um email institucional da UFC (@alu.ufc.br);
- [x] O usuário não pode se cadastrar com um email já cadastrado;
- [x] O usuário deve conter um nome de usuário único;
- [x] O usuário deve conter uma senha com no mínimo 6 caracteres.

### Projeto

- [ ] O projeto deve conter um título com no máximo xxx caracteres;
- [ ] O projeto deve conter uma descrição com no máximo xxx caracteres;
- [x] O projeto deve conter obrigatoriamente uma trilha, um semestre e o ano de publicação;
- [ ] O feed deve ser ordenado com projetos alinhados com o semestre do usuário (se o usuário estiver no 4º semestre, os projetos do 4º semestre devem aparecer primeiro, depois os do 5º, 6º, e assim por diante, até o 1º semestre).

### Comentários

- [x] O comentário deve ser feito por um usuário autenticado;
- [ ] O comentário não pode conter palavras ofensivas;
- [ ] O comentário não pode ser feito em um projeto com os comentários desativados.

## Requisitos Não Funcionais (RNF's)

- [x] A senha do usuário deve ser criptografada;
- [x] O usuário deve ser identificado por um token JWT.

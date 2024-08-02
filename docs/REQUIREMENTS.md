# "Boxy" Backend

Esse é o backend do projeto "Boxy", um projeto de uma aplicação que servirá como repositório de trabalhos realizados por alunos do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.

## Requisitos Funcionais (RF's)

### Usuário

- [ ] Deve ser possível se cadastrar;
- [ ] Deve ser possível enviar um email de confirmação ao usuário cadastrado;
- [ ] Deve ser possível se autenticar.

### Perfil

- [ ] Deve ser possível visualizar o seu perfil;
- [ ] Deve ser possível editar o seu perfil;
- [ ] Deve ser possível visualizar o perfil de outro usuário;
- [ ] Deve ser possível denunciar o perfil de outro usuário.

### Projeto

- [ ] Deve ser possível publicar um projeto;
- [ ] Deve ser possível editar um projeto;
- [ ] Deve ser possível excluir um projeto;
- [ ] Deve ser possível denunciar um projeto;
- [ ] Deve ser possível visualizar os projetos que você publicou;
- [ ] Deve ser possível visualizar os projetos de um usuário específico;
- [ ] Deve ser possível visualizar os projetos em um feed;
- [ ] Deve ser possível pesquisar por projetos;
- [ ] Deve ser possível filtrar projetos por tags.

### Comentários

- [ ] Deve ser possível comentar em um projeto;
- [ ] Deve ser possível excluir o seu comentário em um projeto;
- [ ] Deve ser possível excluir o comentário de outro usuário no seu projeto;
- [ ] Deve ser possível denunciar um comentário;
- [ ] Deve ser possível desativar os comentários do seu projeto.

### Portfólio

- [ ] Deve ser possível exportar um portfólio em PDF com os seus projetos e perfil.

### Moderação

- [ ] Deve ser possível um moderador visualizar todas as denúncias;
- [ ] Deve ser possível um moderador excluir um projeto denunciado;
- [ ] Deve ser possível um moderador excluir um comentário denunciado;
- [ ] Deve ser possível um moderador banir um usuário denunciado;
- [ ] Deve ser possível um moderador desbanir um usuário banido;
- [ ] Deve ser possível um moderador desativar um projeto denunciado;
- [ ] Deve ser possível um moderador desativar um comentário denunciado.

## Regras de Negócio (RN's)

### Usuário

- [ ] O usuário deve conter um email institucional da UFC (@alu.ufc.br);
- [ ] O usuário não pode se cadastrar com um email já cadastrado;
- [ ] O usuário deve conter um nome de usuário único;
- [ ] O usuário deve conter uma senha com no mínimo 6 caracteres.

### Projeto

- [ ] O projeto deve conter um título com no máximo 100 caracteres;
- [ ] O projeto deve conter uma descrição com no máximo 500 caracteres;
- [ ] O projeto deve conter uma tag de trilha e uma tag de semestre;
- [ ] O feed deve ser ordenado com projetos alinhados com o semestre do usuário (se o usuário estiver no 4º semestre, os projetos do 4º semestre devem aparecer primeiro, depois os do 3º e 5º, e assim por diante).

### Comentários

- [ ] O comentário deve ser feito por um usuário autenticado;
- [ ] O comentário deve conter no máximo 500 caracteres;
- [ ] O comentário não pode conter palavras ofensivas;
- [ ] O comentário não pode ser feito em um projeto com os comentários desativados.

### Denúncia

- [ ] A denúncia deve ser feita por um usuário autenticado;
- [ ] A denúncia deve conter um motivo;
- [ ] A denúncia não pode ser feita em um projeto, comentário ou usuário já denunciado;
- [ ] A denúncia deve ser analisada por um moderador.

### Moderação

- [ ] O moderador deve ser um usuário autenticado;
- [ ] O moderador deve ser um usuário com a role de moderador;
- [ ] O moderador deve excluir o projeto, comentário ou banir o usuário denunciado se a denúncia for procedente;
- [ ] O moderador deve notificar o usuário denunciado sobre a denúncia e a ação tomada;
- [ ] O moderador deve notificar o usuário denunciante sobre a ação tomada.

## Requisitos Não Funcionais (RNF's)

- [ ] A senha do usuário deve ser criptografada;
- [ ] Todas as listas precisam estar paginadas com 20 items por página;
- [ ] O usuário deve ser identificado por um token JWT;
- [ ] O backend deve ser hospedado no [Render](https://render.com/);
- [ ] O banco de dados deve ser hospedado no [Railway](https://railway.app/);
- [ ] As imagens dos projetos devem ser armazenadas no [Cloudfare R2](https://www.cloudflare.com/pt-br/developer-platform/r2/).

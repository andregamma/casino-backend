### 📚 Descrição

A principal ideia por trás desse repositório é criar uma plataforma de apostas para o servidor de FiveM, [RPRP](https://rprp.city/). Entretanto, percebi que há diversas questões a serem aprendidas por mim para chegar a um resultado concreto, então o repositório será usado mais como estudo, pois não tenho certeza se um dia concluirei a plataforma.

O backend será desenvolvido utilizando [NestJS](https://nestjs.com/) com Fastify (até o momento) e socket-io para os jogos. Utilizei um boilerplate para a construção da estrutura base, o mesmo aparenta usar algumas bibliotecas já descontinuadas e pretendo substituí-las.

Até o momento temos:
- Autenticação usando Passport
- CRUD de perfil (pretendo modificar algumas coisas)
- Um sistema de permissões ao qual pretendo integrar ao banco de dados.
- Uma tentativa de criar um jogo de dados (WIP)

Sou desenvolvedor front-end e esse projeto me ajudará a entender conceitos de back-end.

Se você tem sugestões, crie uma issue, ficarei grato.

O readme original do boilerplate com instruções de deploy está disponível [aqui](BOILERPLATE_README.md).
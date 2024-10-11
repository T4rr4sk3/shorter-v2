drop schema if exists coppetec cascade;

create schema coppetec;

create table coppetec.shortLinks (
  id serial primary key,
  url text not null,
  nome text not null,
  codigo text not null,
  visitas int not null default 0,
  criado_em timestamp not null default CURRENT_TIMESTAMP,
  expira_em timestamp
)
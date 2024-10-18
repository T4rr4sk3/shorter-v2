drop schema if exists coppetec cascade;

-- Cópia do banco real --

create schema coppetec;

create table coppetec.shortLinks_grupos (
  id serial primary key,
  nome text not null unique,
  criado_em timestamp not null default CURRENT_TIMESTAMP,
  grupo_id int null, -- parent

  constraint fk_grupo foreign key (grupo_id)
  references coppetec.shortLinks_grupos(id) on delete set null
);

create table coppetec.shortLinks (
  id serial primary key,
  url text not null,
  nome text not null unique,
  codigo text not null unique,
  visitas int not null default 0,
  criado_em timestamp not null default CURRENT_TIMESTAMP,
  expira_em timestamp null,
  grupo_id int null,

  constraint fk_grupo foreign key (grupo_id)
  references coppetec.shortLinks_grupos(id) on delete set null
);

create table coppetec.shortLinks_tags (
  id serial primary key,
  nome text not null unique,
  criado_em timestamp not null default CURRENT_TIMESTAMP
);

create table coppetec.shortLinks_link_has_tags (
  shortLink_id int not null,
  shortLink_tag_id int not null,

  constraint fk_tag foreign key (shortLink_tag_id)
  references coppetec.shortLinks_tags(id) on delete cascade,

  constraint fk_link foreign key (shortLink_id)
  references coppetec.shortLinks(id) on delete cascade
);
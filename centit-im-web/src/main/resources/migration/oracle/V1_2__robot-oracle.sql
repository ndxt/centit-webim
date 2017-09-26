create table question_and_answer
(
  question_id VARCHAR(100) not null primary key,
  os_id VARCHAR(32),
  opt_Id VARCHAR(32),
  key_words VARCHAR(1000),
  question_title VARCHAR(1000),
  question_url   VARCHAR(1000),
  question_answer      clob ,
  creator     VARCHAR(100),
  create_time  DATE,
  last_update_time  DATE,
  delete_sign   CHAR(1)
);

-- Add comments to the columns
comment on column question_and_answer.question_id
is 'uuid';
comment on column question_and_answer.key_words
is '主题词 多个主题词用空格分开';
comment on column question_and_answer.question_title
is '问题';
comment on column question_and_answer.question_url
is '问题url链接';
comment on column question_and_answer.question_answer
is '回答';
comment on column question_and_answer.creator
is '创建人';
comment on column question_and_answer.create_time
is '创建时间';
comment on column question_and_answer.last_update_time
is '更新时间';
comment on column question_and_answer.delete_sign
is '是否删除志位 T/F';
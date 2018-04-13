create table F_QUESTION_AND_ANSWER
(
  question_id VARCHAR(48) not null primary key comment 'uuid',
  os_id VARCHAR(32),
  opt_Id VARCHAR(32),
  key_words VARCHAR(1000) comment '主题词 多个主题词用空格分开',
  question_title VARCHAR(1000) comment '问题',
  question_url   VARCHAR(1000) comment '问题',
  question_answer      TEXT comment '回答',
  creator     VARCHAR(100) comment '创建人',
  create_time  DATE comment '创建时间',
  last_update_time  DATE comment '更新时间',
  delete_sign   CHAR(1) comment '是否删除 T/F'
);

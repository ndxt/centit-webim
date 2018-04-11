DROP TABLE IF EXISTS F_WEB_IM_GROUP;
DROP TABLE IF EXISTS F_WEB_IM_GROUP_MEMBER;
DROP TABLE IF EXISTS F_WEB_IM_GROUP_MEMBER;

CREATE TABLE F_WEB_IM_GROUP
(
   GROUP_ID             VARCHAR(32) NOT NULL,
   OS_ID                varchar(20) NOT NULL,
   GROUP_TYPE           CHAR NOT NULL COMMENT 'U  unit机构群不能删除，不能退出  G Group 普通群',
   GROUP_NAME           VARCHAR(100) NOT NULL COMMENT '群名称',
   CREATOR              VARCHAR(32) NOT NULL,
   CREATE_TIME          DATETIME COMMENT '创建时间',
   GROUP_NOTICE         VARCHAR(1000) COMMENT '群描述',
   PRIMARY KEY (GROUP_ID)
);

CREATE TABLE F_WEB_IM_GROUP_MEMBER
(
   OS_ID                varchar(20) NOT NULL,
   USER_CODE            varchar(32) NOT NULL,
   UNIT_CODE            varchar(32) NOT NULL,
   GROUP_MEMO           varchar(1000) COMMENT '用户对群的备注' ,
   GROUP_ALIAS          varchar(100) COMMENT '用户在群中的昵称' ,
   JOIN_TIME            DATETIME NOT NULL,
   LAST_PUST_TIME       DATETIME NOT NULL COMMENT '最后阅读时间' ,
   PRIMARY KEY (USER_CODE, UNIT_CODE)
);


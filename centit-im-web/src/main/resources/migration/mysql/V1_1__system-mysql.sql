-- mysql -h 192.168.131.6 -u webim -p webim
use webim;

DROP TABLE IF EXISTS F_WEB_IM_CUSTOMER;
DROP TABLE IF EXISTS F_WEB_IM_MESSAGE;
DROP TABLE IF EXISTS F_WEB_IM_GROUP_MEMBER;
DROP VIEW IF EXISTS F_V_UNREAD_CHAT_MSG;
DROP VIEW IF EXISTS F_V_UNREAD_GROUP_MSG;

CREATE TABLE F_WEB_IM_CUSTOMER
(
   OS_ID                varchar(20) NOT NULL,
   USER_CODE            varchar(32) NOT NULL COMMENT '用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性生产一个唯一的编号',
   USER_NAME            varchar(100) NOT NULL,
   USER_TYPE            CHAR COMMENT 'C 客户， U 一般用户 ，S 客服 ，P 外部专家',
   HEAD_SCULPTURE       varchar(200),
   SERVICE_OPTS         varchar(1000),
   CUSTOMER_SERVICE     varchar(32),
   CREATOR              VARCHAR(32),
   CREATE_TIME          DATETIME,
   LAST_ACTIVE_DATE     DATETIME,
   PRIMARY KEY (USER_CODE)
);
ALTER TABLE F_WEB_IM_CUSTOMER COMMENT '匿名用户（ 用于客服模式）用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性';

CREATE TABLE F_WEB_IM_MESSAGE
(
   MSG_ID               VARCHAR(32) NOT NULL,
   OS_ID                varchar(20) NOT NULL,
   MSG_TYPE             CHAR NOT NULL COMMENT 'C chat  G Group',
   SENDER               VARCHAR(32) NOT NULL,
   SENDER_NAME          varchar(100),
   RECEIVER             VARCHAR(32) NOT NULL,
   SEND_TIME            TIME,
   MSG_STATE            CHAR COMMENT 'U 未读 C  已读',
   CONTENT_TYPE         VARCHAR(20),
   CONTENT              VARCHAR(1000),
   PRIMARY KEY (MSG_ID)
);

CREATE TABLE F_WEB_IM_GROUP_MEMBER
(
   OS_ID                varchar(20) NOT NULL,
   USER_CODE            varchar(32) NOT NULL,
   UNIT_CODE            varchar(32) NOT NULL,
   LAST_PUSH_TIME       DATETIME NOT NULL,
   PRIMARY KEY (USER_CODE, UNIT_CODE)
);
ALTER TABLE F_WEB_IM_GROUP_MEMBER COMMENT '用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息';

CREATE TABLE F_WEB_IM_CUSTOMER_PRAISE (
   PRAISE_ID varchar(32) NOT NULL,
   OS_ID varchar(20) NOT NULL,
   USER_CODE varchar(32) DEFAULT NULL,
   CUSTOMER_CODE varchar(32) NOT NULL,
   SERVICE_SUMMARY varchar(200),
   SERVICE_SCORE DECIMAL(10,4) NOT NULL,
   CREATE_TIME DATETIME,
   PRIMARY KEY (PRAISE_ID)
) ;

CREATE TABLE F_WEB_IM_FRIEND_MEMO (
   USER_CODE   varchar(32) NOT NULL,
   FRIEND_CODE varchar(32) NOT NULL,
   OS_ID       varchar(20) NOT NULL,
   LAST_UPDATE_TIME DATETIME NOT NULL,
   FRIEND_ALIAS   varchar(100),
   FRIEND_MEMO    varchar(1000),
   PRIMARY KEY (USER_CODE,FRIEND_CODE)
);

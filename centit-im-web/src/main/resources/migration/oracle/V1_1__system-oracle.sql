


CREATE TABLE F_WEB_IM_CUSTOMER
(
   OS_ID                varchar2(20) NOT NULL,
   USER_CODE            varchar2(32) NOT NULL ,
   USER_NAME            varchar2(50) NOT NULL,
   USER_TYPE            CHAR,
   HEAD_SCULPTURE       varchar(200),
   SERVICE_OPTS         varchar(1000),
   CUSTOMER_SERVICE     varchar(32),
   CREATOR              VARCHAR(32),
   CREATE_TIME          DATE,
   LAST_ACTIVE_DATE     DATE,
   PRIMARY KEY (USER_CODE)
);
-- Add comments to the columns
comment on column F_WEB_IM_CUSTOMER.USER_TYPE
    is 'C 客户， U 一般用户 ，S 客服 ，P 外部专家';

COMMENT on TABLE F_WEB_IM_CUSTOMER is '匿名用户（ 用于客服模式）用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性';

CREATE TABLE F_WEB_IM_MESSAGE
(
   MSG_ID               varchar2(32) NOT NULL,
   OS_ID                varchar2(20) NOT NULL,
   MSG_TYPE             CHAR NOT NULL ,
   SENDER               varchar2(32) NOT NULL,
   SENDER_NAME          varchar2(100),
   RECEIVER             varchar2(32) NOT NULL,
   SEND_TIME            date,
   MSG_STATE            CHAR ,
   CONTENT_TYPE         VARCHAR(20),
   CONTENT              varchar2(1000),
   PRIMARY KEY (MSG_ID)
);

CREATE TABLE F_WEB_IM_GROUP_MEMBER
(
   OS_ID                varchar2(20) NOT NULL,
   USER_CODE            varchar2(32) NOT NULL,
   UNIT_CODE            varchar2(32) NOT NULL,
   LAST_PUSH_TIME       DATE NOT NULL,
   PRIMARY KEY (USER_CODE, UNIT_CODE)
);
COMMENT on TABLE F_WEB_IM_GROUP_MEMBER is  '用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息';


CREATE TABLE F_WEB_IM_CUSTOMER_PRAISE (
    PRAISE_ID varchar2(32) NOT NULL,
    OS_ID varchar2(20) NOT NULL,
    USER_CODE varchar2(32) DEFAULT NULL,
    CUSTOMER_CODE varchar2(32) NOT NULL,
    SERVICE_SUMMARY varchar2(200) DEFAULT NULL,
    SERVICE_SCORE NUMBER(10,4) NOT NULL,
    CREATE_TIME date DEFAULT NULL,
    PRIMARY KEY (PRAISE_ID)
) ;

CREATE TABLE F_WEB_IM_FRIEND_MEMO (
    USER_CODE varchar2(32) NOT NULL,
    FRIEND_CODE varchar2(32) NOT NULL,
    OS_ID varchar2(20) NOT NULL,
    LAST_UPDATE_TIME date NOT NULL,
    FRIEND_ALIAS varchar2(100) DEFAULT NULL,
    FRIEND_MEMO varchar2(1000) DEFAULT NULL,
    PRIMARY KEY (USER_CODE,FRIEND_CODE)
);
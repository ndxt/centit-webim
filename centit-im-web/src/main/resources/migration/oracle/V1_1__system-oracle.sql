CREATE TABLE f_customer_praise (
  PRAISE_ID varchar2(32) NOT NULL,
  OS_ID varchar2(20) NOT NULL,
  USER_CODE varchar2(32) DEFAULT NULL,
  CUSTOMER_CODE varchar2(32) NOT NULL,
  SERVICE_SUMMARY varchar2(200) DEFAULT NULL,
  SERVICE_SCORE int NOT NULL,
  CREATE_TIME date DEFAULT NULL,
  PRIMARY KEY (PRAISE_ID)
) ;

CREATE TABLE f_friend_memo (
  USER_CODE varchar2(32) NOT NULL,
  FRIEND_CODE varchar2(32) NOT NULL,
  OS_ID varchar2(20) NOT NULL,
  LAST_UPDATE_TIME date NOT NULL,
  FRIEND_ALIAS varchar2(100) DEFAULT NULL,
  FRIEND_MEMO varchar2(1000) DEFAULT NULL,
  PRIMARY KEY (USER_CODE,FRIEND_CODE)
) ;


CREATE TABLE F_WEB_IM_CUSTOMER
(
   OS_ID                varchar2(20) NOT NULL,
   USER_CODE            varchar2(32) NOT NULL ,
   USER_NAME            varchar2(50) NOT NULL,
   CUSTOMER_SERVICE     varchar2(32),
   CREATOR              varchar2(32),
   CREATE_TIME          DATE,
   PRIMARY KEY (OS_ID, USER_CODE)
);
COMMENT on TABLE F_WEB_IM_CUSTOMER is '匿名用户（ 用于客服模式）用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性';

CREATE TABLE F_WEB_IM_MESSAGE
(
   MSG_ID               varchar2(32) NOT NULL,
   OS_ID                varchar2(20) NOT NULL,
   MSG_TYPE             CHAR NOT NULL ,
   SENDER               varchar2(32) NOT NULL,
   RECEIVER             varchar2(32) NOT NULL,
   SEND_TIME            date,
   MSG_STATE            CHAR ,
   CONTENT              varchar2(1000),
   PRIMARY KEY (MSG_ID)
);

CREATE TABLE F_WEB_IM_READ_GROUP
(
   OS_ID                varchar2(20) NOT NULL,
   USER_CODE            varchar2(32) NOT NULL,
   UNIT_CODE            varchar2(32) NOT NULL,
   LAST_PUST_TIME       DATE NOT NULL,
   PRIMARY KEY (OS_ID, USER_CODE, UNIT_CODE)
);
COMMENT on TABLE F_WEB_IM_READ_GROUP is  '用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息';


 CREATE VIEW F_V_UNREAD_CHAT_MSG AS
select OS_ID,RECEIVER,count(1) as UNREAD_SUM 
from F_WEB_IM_MESSAGE
where MSG_TYPE = 'C' and MSG_STATE = 'U'
group by OS_ID,RECEIVER;


 CREATE VIEW F_V_UNREAD_GROUP_MSG AS
select a.OS_ID, b.USER_CODE,count(1) as UNREAD_SUM 
from F_WEB_IM_MESSAGE a join F_WEB_IM_READ_GROUP b on(a.OS_ID=b.OS_ID and a.RECEIVER = b.UNIT_CODE)
where a.MSG_TYPE = 'G' and a.send_time > LAST_PUST_TIME 
group by a.OS_ID, b.USER_CODE;

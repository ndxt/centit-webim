FROM java:8
MAINTAINER hzf "hzf@centit.com"
ADD ./centit-im-boot-demo/target/*.jar im.jar
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
EXPOSE 10085
CMD ["java","-jar","im.jar"]
FROM mcr.microsoft.com/java/jdk:8u202-zulu-centos
MAINTAINER hzf "hzf@centit.com"
ADD ./centit-im-web/target/*.jar /home/im.jar
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
EXPOSE 10085
CMD ["java","-jar","/home/im.jar"]
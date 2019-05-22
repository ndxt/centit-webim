package com.centit.im.robot.test;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.core.dao.ExtendedQueryPool;
import com.centit.im.po.RobotAnswer;
import com.centit.im.po.RobotAnswerItem;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.impl.IntelligentRobotEsImpl;
import com.centit.search.service.ESServerConfig;
import com.centit.search.service.Impl.ESIndexer;
import com.centit.search.service.Indexer;
import com.centit.search.service.IndexerSearcherFactory;
import com.centit.support.algorithm.StringBaseOpt;
import com.centit.support.database.utils.DBType;
import com.centit.support.database.utils.DataSourceDescription;
import com.centit.support.database.utils.DatabaseAccess;
import com.centit.support.database.utils.DbcpConnectPools;
import org.dom4j.DocumentException;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.network.InetAddresses;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.TransportAddress;


import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Created by codefan on 2017/9/26.
 */
public class ImportQuestionToEs {

    public static void main(String [] arg)throws UnknownHostException

    {
        /*RobotAnswer answer = searchEs("发电项目");
        for(RobotAnswerItem item : answer.getOptions()){
            System.out.println(item.getLabel());
        }
        System.out.println(answer.getMessage());*/
//        Settings esSettings = Settings.builder()
//                .put("cluster.name", "elasticsearch") //设置ES实例的名称
//                .put("client.transport.sniff", true) //自动嗅探整个集群的状态，把集群中其他ES节点的ip添加到本地的客户端列表中
//                .build();
//        TransportClient client = new PreBuiltTransportClient(esSettings);//初始化client较老版本发生了变化，此方法有几个重载方法，初始化插件等。
//        //此步骤添加IP，至少一个，其实一个就够了，因为添加了自动嗅探配置
//        TransportAddress transportAddress =
//                new TransportAddress(
//                        InetAddresses.forString("127.0.0.1"),9300);
//        client.addTransportAddress(transportAddress);
//
//        Settings settings = Settings.builder()
//                .put("cluster.name", "myClusterName").build();
//        TransportClient client2 = new PreBuiltTransportClient(settings)
//                .addTransportAddress(new TransportAddress(InetAddress.getByName("127.0.0.1"), 9300));
        //继续添加其他地址
        //on shutdown
//        client.close();
        try {
            importDataToEs();
            RobotAnswer answer = searchEs("6");
            for(RobotAnswerItem item : answer.getOptions()){
                System.out.println(item.getLabel());
            }
            System.out.println(answer.getMessage());
            System.out.println("done!");
        } catch (SQLException | IOException| DocumentException e) {
            e.printStackTrace();
        }

    }

    public static void importDataToEs() throws SQLException,
            IOException, DocumentException {

        DataSourceDescription dataSource = new DataSourceDescription();
        dataSource.setConnUrl("jdbc:mysql://192.168.128.32:3306/webim");
        dataSource.setUsername("webim");
        dataSource.setPassword("webim");

        ExtendedQueryPool.loadExtendedSqlMap(
                ImportQuestionToEs.class.getResourceAsStream("/ExtendedSqlMap.xml"),
                DBType.MySql);

        Connection conn = DbcpConnectPools.getDbcpConnect(dataSource);

        ESServerConfig esServerConfig =
        IndexerSearcherFactory.loadESServerConfigFormProperties("/system.properties");

        Indexer indexer = IndexerSearcherFactory.obtainIndexer(
                esServerConfig, QuestAndAnswer.class);

        String sql = ExtendedQueryPool.getExtendedSql("QUERY_QUESTION_FOR_IM_ROBOT");

        JSONArray ja = DatabaseAccess.findObjectsAsJSON(conn,sql);

        for(Object obj : ja){
            if(obj instanceof JSONObject){
                JSONObject jo =(JSONObject)obj;
                QuestAndAnswer qa = new QuestAndAnswer();
                qa.setQuestionId(StringBaseOpt.objectToString(jo.get("questionId")));
                qa.setKeyWords(StringBaseOpt.objectToString(jo.get("keyWords")));
                qa.setQuestionTitle(StringBaseOpt.objectToString(jo.get("questionTitle")));
                qa.setQuestionAnswer(StringBaseOpt.objectToString(jo.get("questionAnswer")));
                indexer.mergeDocument(qa);
            }
        }
    }

    public static RobotAnswer searchEs(String question){
        IntelligentRobotEsImpl intelligentRobot = new IntelligentRobotEsImpl();
        return intelligentRobot.askQuestion("userCode",question);
    }

}

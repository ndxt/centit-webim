package com.centit.im.robot.test;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.core.dao.ExtendedQueryPool;
import com.centit.im.po.RobotAnswer;
import com.centit.im.po.RobotAnswerItem;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.impl.IntelligentRobotEsImpl;
import com.centit.search.service.ESServerConfig;
import com.centit.search.service.Indexer;
import com.centit.search.service.IndexerSearcherFactory;
import com.centit.support.algorithm.StringBaseOpt;
import com.centit.support.database.utils.DBType;
import com.centit.support.database.utils.DataSourceDescription;
import com.centit.support.database.utils.DatabaseAccess;
import com.centit.support.database.utils.DbcpConnectPools;
import org.dom4j.DocumentException;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Created by codefan on 2017/9/26.
 */
public class ImportQuestionToEs {

    public static void main(String [] arg){
        /*RobotAnswer answer = searchEs("发电项目");
        for(RobotAnswerItem item : answer.getOptions()){
            System.out.println(item.getLabel());
        }
        System.out.println(answer.getMessage());*/
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

        ESServerConfig esServerConfig = new  ESServerConfig();/*IndexerSearcherFactory.loadESServerConfigFormProperties(
                SysParametersUtils.loadProperties())*/

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

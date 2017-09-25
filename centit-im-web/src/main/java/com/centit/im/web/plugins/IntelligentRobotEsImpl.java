package com.centit.im.web.plugins;

import com.centit.framework.common.SysParametersUtils;
import com.centit.im.po.RobotAnswer;
import com.centit.im.service.IntelligentRobot;
import com.centit.search.service.ESServerConfig;
import com.centit.search.service.IndexerSearcherFactory;
import com.centit.search.service.Searcher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by codefan on 17-6-19.
 */
@Service("intelligentRobot")
public class IntelligentRobotEsImpl implements IntelligentRobot {

    private ESServerConfig esServerConfig;

    @Override
    public RobotAnswer sayHello(String custUserCode) {
        return RobotAnswer.createTestAnswer();
    }

    @Override
    public RobotAnswer sayBoodbye(String custUserCode) {
        return RobotAnswer.createTestAnswer();
    }

    @Override
    public RobotAnswer askQuestion(String custUserCode, String question) {
        if(esServerConfig == null){
            esServerConfig = IndexerSearcherFactory.loadESServerConfigFormProperties(
                    SysParametersUtils.loadProperties());
        }
        Searcher searcher = IndexerSearcherFactory.obtainSearcher(esServerConfig , QuestDocument.class);
        List<Map<String, Object>> questiosns = searcher.search(question,1,10);
        return RobotAnswer.createTestAnswer();
    }
}

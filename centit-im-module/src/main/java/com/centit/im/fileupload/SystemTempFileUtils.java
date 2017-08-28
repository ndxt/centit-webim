package com.centit.im.fileupload;

import com.centit.framework.common.SysParametersUtils;
import com.centit.support.algorithm.UuidOpt;
import com.centit.support.file.FileMD5Maker;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;


public class SystemTempFileUtils {
	private static Logger log = LoggerFactory.getLogger(SystemTempFileUtils.class);
	
	public static String getTempFilePath(String fileMd5, long size){
		return SysParametersUtils.getTempHome()
					+ File.separatorChar + fileMd5 +"_"+size+".tmp";
	}
	
	public static String getTempDirectory(){
		return SysParametersUtils.getTempHome()
					+ File.separatorChar ;
	}
	
	public static String getRandomTempFilePath(){
		return SysParametersUtils.getTempHome()
					+ File.separatorChar + UuidOpt.getUuidAsString32() +".tmp";
	}
	
	public static long checkTempFileSize(String filePath){
		File f = new File(filePath);
		if(!f.exists()) return 0;
		return f.length();
	}
	
	public static boolean checkFileCompleted(String filePath, String fileMd5){
		try {
			return StringUtils.equals(fileMd5,
					FileMD5Maker.makeFileMD5(new File(filePath)));
		} catch (IOException e) {
			log.error(e.getMessage());
			return false;
		}
	}

}
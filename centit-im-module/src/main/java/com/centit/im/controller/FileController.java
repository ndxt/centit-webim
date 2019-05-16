package com.centit.im.controller;

import com.alibaba.fastjson.JSONObject;
import com.centit.fileserver.utils.*;
import com.centit.framework.common.JsonResultUtils;
import com.centit.framework.common.ObjectException;
import com.centit.framework.common.ResponseData;
import com.centit.framework.core.controller.BaseController;
import com.centit.support.algorithm.NumberBaseOpt;
import com.centit.support.file.FileIOOpt;
import com.centit.support.file.FileMD5Maker;
import com.centit.support.file.FileSystemOpt;
import com.centit.support.file.FileType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.util.HtmlUtils;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.SocketException;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/file")
@Api(value = "上传文件接口", tags = "上传文件接口")
public class FileController extends BaseController {

    private static  Logger log = LoggerFactory.getLogger(FileController.class);

    @Autowired
    protected FileStore fileStore;

    private static String encodeFilename(String paramName) {
        String downloadChineseFileName = "";
        try {
            downloadChineseFileName = new String(
                    HtmlUtils.htmlUnescape(paramName).getBytes("GBK"), "ISO8859-1");
        } catch (UnsupportedEncodingException e) {
            log.error(e.getMessage(),e);
        }
        return downloadChineseFileName;
    }

    /**
     *
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     * @param inputStream InputStream
     * @param fSize long
     * @param fileName String
     * @throws IOException IOException
     */
    private static void downFileRange(HttpServletRequest request, HttpServletResponse response,
                                      InputStream inputStream, long fSize, String fileName)
            throws IOException {
//        UploadDownloadUtils.downFileRange(request, response,
//                inputStream, fSize, encodeFilename(fileName));

        response.setContentType(FileType.getFileMimeType(fileName)+";charset=ISO8859-1");
        //"application/octet-stream"); //application/x-download "multipart/form-data"
        //String isoFileName = this.encodeFilename(proposeFile.getName(), request);
        response.setHeader("Accept-Ranges", "bytes");
        //这个需要设置成真正返回的长度
        //response.setHeader("Content-Length", String.valueOf(fSize));
        String s = request.getParameter("downloadType");
        response.setHeader("Content-Disposition",
                ("inline".equalsIgnoreCase(s)?"inline": "attachment")+"; filename="
                        + UploadDownloadUtils.encodeDownloadFilename(fileName));
        long pos = 0;

        FileRangeInfo fr = FileRangeInfo.parseRange(request.getHeader("Range"));

        if(fr == null){
            fr = new FileRangeInfo(0,fSize - 1,fSize);
        }else{
            if(fr.getRangeEnd()<=0)
                fr.setRangeEnd(fSize - 1);
            fr.setFileSize(fSize);
            pos = fr.getRangeStart();
            if(fr.getPartSize() < fr.getFileSize()) //206
                response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
        }

        response.setHeader("Content-Length", String.valueOf(fr.getPartSize()));
        // Content-Range: bytes 500-999/1234
        response.setHeader("Content-Range", fr.getResponseRange());
        //logger.debug("Content-Range :" + contentRange);
        try(ServletOutputStream out = response.getOutputStream();
            BufferedOutputStream bufferOut = new BufferedOutputStream(out)){

            if(pos>0) {
                inputStream.skip(pos);
            }
            byte[] buffer = new byte[64 * 1024];
            int needSize = new Long(fr.getPartSize()).intValue(); //需要传输的字节
            int length = 0;
            while ((needSize > 0) && ((length = inputStream.read(buffer, 0, buffer.length)) != -1)) {
                int writeLen =  needSize > length ? length: needSize;
                bufferOut.write(buffer, 0, writeLen);
                bufferOut.flush();
                needSize -= writeLen;
            }
            //bufferOut.flush();
            //bufferOut.close();
            //out.close();
        } catch (SocketException e){
//            logger.info("客户端断开链接："+e.getMessage(), e);
        }
    }


    /**
     * 根据文件的 MD5码 下载不受保护的文件，不需要访问文件记录
     * 如果是通过 store 上传的需要指定 extName 扩展名
     * @param md5SizeExt 文件的Md5码和文件的大小 格式为 MD5_SIZE.EXT
     * @param fileName 文件的名称包括扩展名，如果这个不为空， 上面的 md5SizeExt 可以没有 .Ext 扩展名
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     * @throws IOException
     */
    @RequestMapping(value= "/download/{md5SizeExt}", method=RequestMethod.GET)
    public void downloadUnprotectedFile(@PathVariable("md5SizeExt") String md5SizeExt,
                                        String fileName,
                                        HttpServletRequest request,
                                        HttpServletResponse response) throws IOException {
        //FileStoreInfo stroeInfo = fileStoreInfoManager.getObjectById(md5);
        //downloadFile(stroeInfo,request,response);
        String uri = request.getRequestURI();
        String [] urips = uri.split("/");
        int n=urips.length;
        if(StringUtils.isBlank(fileName)){
            fileName = urips[n-1];
        }


        String fileMd5 =  md5SizeExt.substring(0,32);
        int pos = md5SizeExt.indexOf('.');
        //String extName = md5SizeExt.substring(pos);
        long fileSize = pos<0? NumberBaseOpt.parseLong(md5SizeExt.substring(33),0l)
                : NumberBaseOpt.parseLong(md5SizeExt.substring(33,pos),0l);

        String filePath = fileStore.getFileStoreUrl(fileMd5, fileSize);
        InputStream inputStream = fileStore.loadFileStream(filePath);
        downFileRange(request,  response,
                inputStream, fileSize,
                fileName);
    }


    /**
     * 判断文件是否存在，如果文件已经存在可以实现秒传
     *
     * @param token String
     * @param size  size
     * @param response HttpServletResponse
     * @throws IOException IOException
     */
    @CrossOrigin(origins = "*", allowCredentials = "true", maxAge = 86400,
            allowedHeaders = "*", methods = RequestMethod.GET)
    @RequestMapping(value = "/exists", method = RequestMethod.GET)
    public void checkFileExists(String token, long size, HttpServletResponse response)
            throws IOException {
        JsonResultUtils.writeOriginalObject(fileStore.checkFile(token, size), response);
    }

    /**
     * 获取文件 断点位置，前端根据断点位置续传
     *
     * @param token String
     * @param size  size
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     * @throws IOException IOException
     */
    @CrossOrigin(origins = "*", allowCredentials = "true", maxAge = 86400, methods = RequestMethod.GET)
    @RequestMapping(value = "/range", method = {RequestMethod.GET})
    public void checkFileRange(String token, long size,
                               HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        //FileRangeInfo fr = new FileRangeInfo(token,size);
        Pair<String, InputStream> fileInfo = fetchInputStreamFromRequest(request);

        long tempFileSize = 0;
        // 如果文件已经存在则完成秒传，无需再传
        if (fileStore.checkFile(token, size)) {//如果文件已经存在 系统实现秒传
            //添加完成 后 相关的处理  类似与 uploadRange
            completedStoreFile(fileStore, token, size, fileInfo.getLeft(), response);
            tempFileSize = size;
        } else {
            //检查临时目录中的文件大小，返回文件的其实点
            //String tempFilePath = FileUploadUtils.getTempFilePath(token, size);
            tempFileSize = SystemTempFileUtils.checkTempFileSize(
                    SystemTempFileUtils.getTempFilePath(token, size));
        }

        JsonResultUtils.writeOriginalJson(
                UploadDownloadUtils.makeRangeUploadJson(tempFileSize).toJSONString(), response);
    }


    /*
     * 保存文件
     */

    private void completedStoreFile(FileStore fs, String fileMd5, long size,
                                    String fileName, HttpServletResponse response) {
        try {

            String fileId =  fileMd5 +"_"+String.valueOf(size)+"."+
                    FileType.getFileExtName(fileName);
            String filePath = fs.getFileStoreUrl(fileMd5,size);
            // 返回响应
            JSONObject json = new JSONObject();
            /*json.put("start", size);
            json.put("name", fileName);
            json.put("token", fileMd5);
            json.put("success", true);
            json.put("fileId", fileId);*/
            Map<String,String> json1 = new HashMap<>();
            json1.put("src","file/download/"+fileId+"?fileName="+fileName);
            json1.put("fileId", fileId);
            json1.put("token", fileMd5);
            json1.put("name", fileName);
            json.put(ResponseData.RES_CODE_FILED, 0);
            json.put(ResponseData.RES_MSG_FILED, "上传成功");
            json.put(ResponseData.RES_DATA_FILED, json1);

            JsonResultUtils.writeOriginalJson(json.toString(), response);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
            JsonResultUtils.writeHttpErrorMessage(
                    FileServerConstant.ERROR_FILE_PRETREAT,
                    "文件上传成功，但是在保存前：" + e.getMessage(), response);
        }
    }

//Springboot无法使用CommonsMultipartResolver，换成StandardServletMultipartResolver
    private Pair<String, InputStream> fetchInputStreamFromRequest(HttpServletRequest request) throws IOException {
        String fileName = request.getParameter("name");
        if(StringUtils.isBlank(fileName))
            fileName = request.getParameter("fileName");
        boolean isMultipart = ServletFileUpload.isMultipartContent(request);
        if (!isMultipart)
            return new ImmutablePair<>(fileName, request.getInputStream());

       // MultipartResolver resolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        MultipartResolver resolver = new StandardServletMultipartResolver();
        MultipartHttpServletRequest multiRequest = resolver.resolveMultipart(request);
//		MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
        Map<String, MultipartFile> map = multiRequest.getFileMap();
        InputStream fis = null;

        for (Map.Entry<String, MultipartFile> entry : map.entrySet()) {
            MultipartFile cMultipartFile = entry.getValue();
            fileName = cMultipartFile.getResource().getFilename();
            fis = cMultipartFile.getInputStream();
        }
        return  new ImmutablePair<>(fileName, fis);
    }

    /**
     * 续传文件（range） 如果文件已经传输完成 对文件进行保存
     *
     * @param token String
     * @param size  size
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     * @throws IOException IOException
     */
    @CrossOrigin(origins = "*", allowCredentials = "true", maxAge = 86400, methods = RequestMethod.POST)
    @RequestMapping(value = "/range", method = {RequestMethod.POST})
    public void uploadRange(
            String token, long size,
            HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        Pair<String, InputStream> fileInfo = fetchInputStreamFromRequest(request);
        String tempFilePath = SystemTempFileUtils.getTempFilePath(token, size);

        if (fileStore.checkFile(token, size)) {// 如果文件已经存在则完成秒传，无需再传。
            completedStoreFile(fileStore, token, size, fileInfo.getLeft(), response);
            return;
        }

        try {
            long uploadSize = UploadDownloadUtils.uploadRange(tempFilePath, fileInfo.getRight(), token, size, request);
            if(uploadSize==0){
                fileStore.saveFile(tempFilePath, token, size);
                completedStoreFile(fileStore, token, size, fileInfo.getLeft(), response);
                FileSystemOpt.deleteFile(tempFilePath);
                return;
            }else if( uploadSize>0){

                JsonResultUtils.writeOriginalJson(UploadDownloadUtils.
                        makeRangeUploadJson(uploadSize).toJSONString(), response);
            }

        }catch (ObjectException e){
            log.error(e.getMessage(),e);
            JsonResultUtils.writeHttpErrorMessage(e.getExceptionCode(),
                    e.getMessage(), response);
        }
    }

    /**
     * 上传整个文件适用于IE8
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     * @throws IOException IOException
     */
    @CrossOrigin(origins = "*", allowCredentials = "true", maxAge = 86400, methods = RequestMethod.POST)
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ApiOperation(value = "1上传文件")
    public void uploadFile(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        request.setCharacterEncoding("utf8");
        String tempFilePath = SystemTempFileUtils.getRandomTempFilePath();
        try {
            Pair<String, InputStream> fileInfo = fetchInputStreamFromRequest(request);
            int fileSize = FileIOOpt.writeInputStreamToFile(fileInfo.getRight() , tempFilePath);
            String fileMd5 = FileMD5Maker.makeFileMD5(new File(tempFilePath));

            fileStore.saveFile(tempFilePath);
            completedStoreFile(fileStore, fileMd5, fileSize, fileInfo.getLeft(), response);
            FileSystemOpt.deleteFile(tempFilePath);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
            JsonResultUtils.writeErrorMessageJson(e.getMessage(), response);
        }
    }
}

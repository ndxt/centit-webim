import apiCore from "@centit/api-core";
import axios from "axios";
const api = apiCore.create("chat");

export function getCust(id) {
  return api.get(`im/webimcust/cust/${id}?lastServiceDate=1949-10-1`);
}
export function getHistoryMessage(userA, userB) {
  return api.get(
    `im/webimmsg/historyMessage/${userA}/${userB}?pageNo=1&pageSize=1000000`
  );
}
export function fileUpload(file) {
  let data = new FormData()
  data.append('file', file)
  return axios.post(`/locode/api/fileserver/fileserver/upload/file`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

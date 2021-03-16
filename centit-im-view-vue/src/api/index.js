import apiCore from '@centit/api-core'
const api = apiCore.create('chat')

export function getCust(id) {
    return api.get(`im/webimcust/cust/${id}?lastServiceDate=1949-10-1`)
}
export function getHistoryMessage(userA, userB) {
    return api.get(`im/webimmsg/historyMessage/${userA}/${userB}?pageNo=1&lastReadDate=2021-3-11&pageSize=1000000`)
}
export function fileUpload(file, params) {
    return api.post(`im/file/upload`, file, {
        params: {
            token: file.token,
            name: file.name,
            size: file.size,
            ...params,
        },
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    })
}

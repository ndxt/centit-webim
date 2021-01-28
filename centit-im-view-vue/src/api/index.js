import apiCore from '@centit/api-core'
const api = apiCore.create('chat')

export function getCust(id) {
    return api.get(`im/webimcust/cust/${id}?lastServiceDate=1949-10-1`)
}
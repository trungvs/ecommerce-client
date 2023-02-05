import { instance } from "../Auth/AuthAxiosCommon";
import ConstantList from "../../appConfig";
import axios from "axios";

const API_PATH = ConstantList.API_ENDPOINT + '/product'

export const addProduct = (data) => {
    const url = API_PATH
    return instance.post(url, data)
}

export const getProduct = () => {
    const url = API_PATH
    return instance.get(url)
}
export const editProduct = (data) => {
    const url = API_PATH + `/${data.id}`
    return instance.put(url, data)
}

export const deleteProduct = (id) => {
    const url = API_PATH + `/${id}`
    return instance.delete(url)
}

export const getVariant = (id) => {
    const url = API_PATH + `/variant/${id}`
    return instance.get(url)
}

export const searchProduct = (searchObj) => {
    const url = API_PATH + '/search'
    return instance.post(url, searchObj)
}

export const createGroup = (data) => {
    const url = API_PATH + '/group'
    return instance.post(url, data)
}

export const deleteGroup = (data) => {
    const url = API_PATH + '/group/delete'
    return instance.post(url, data)
}

export const getDetailProduct = id => {
    const url = API_PATH + '/' + id
    return axios.get(url)
}
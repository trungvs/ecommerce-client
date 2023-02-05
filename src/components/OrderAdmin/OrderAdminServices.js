import axios from "axios";
import { instance } from '../Auth/AuthAxiosCommon'
import ConstantList from "../../appConfig";

const API_PATH = ConstantList.API_ENDPOINT + "/order"

export const getAllOrder = (dto) => {
    const url = API_PATH + "/getAllOrder"
    return instance.post(url, dto)
}

export const updateOrderStatus = (dto) => {
    const url = API_PATH + "/updateOrderStatus"
    return instance.post(url, dto)
}

export const getOrder = (id) => {
    const url = API_PATH + `/${id}`
    return axios.get(url)
}
import axios from "axios";
import ConstantList from "../../appConfig";
import { instance } from '../Auth/AuthAxiosCommon'

const API_ENDPOINT = ConstantList.API_ENDPOINT + '/profile'

export const getInformation = () => {
    return instance.get(API_ENDPOINT)
}

export const editInformation = (data) => {
    const url = API_ENDPOINT + '/changeinfo'
    return instance.post(url, data)
}

export const getOrder = () => {
    const url = ConstantList.API_ENDPOINT + "/cart/getOrder"
    return instance.get(url) 
}
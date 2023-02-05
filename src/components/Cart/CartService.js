import { instance } from "../Auth/AuthAxiosCommon";
import ConstantList from "../../appConfig";
import axios from "axios";

const API_PATH = ConstantList.API_ENDPOINT + '/cart'

export const getInfoFromCart = (searchObj) => {
    const url = API_PATH
    return instance.post(url, searchObj)
}

export const addOrder = (data) => {
    const url = API_PATH + "/addOrder"
    return axios.post(url, data)
}
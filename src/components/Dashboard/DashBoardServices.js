import { instance } from '../Auth/AuthAxiosCommon'
import axios from 'axios'
import ConstantList from '../../appConfig'

const API_PATH = ConstantList.API_ENDPOINT + '/home'

export const getDashBoardData = (searchObj) => {
    const url = API_PATH + "/dashboard"
    return instance.post(url, searchObj)
}
import { instance } from '../Auth/AuthAxiosCommon'
import ConstantList from '../../appConfig'

const API_PATH = ConstantList.API_ENDPOINT + '/banner'

export const getBanner = () => {
    const url = API_PATH
    return instance.get(url)
}

export const addBanner = (data) => {
    const url = API_PATH
    return instance.post(url, data)
}

export const editBanner = (data) => {
    const url = API_PATH + `/${data.id}`
    return instance.put(url, data)
}

export const deleteBanner = (id) => {
    const url = API_PATH + `/${id}`
    return instance.delete(url)
}
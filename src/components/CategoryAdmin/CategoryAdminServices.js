import { instance } from '../Auth/AuthAxiosCommon'
import axios from 'axios'
import ConstantList from '../../appConfig'

const API_PATH = ConstantList.API_ENDPOINT + '/category'

export const getAllCategory = () => {
    const url = API_PATH
    return instance.get(url)
}

export const createCategory = (data) => {
    const url = API_PATH
    return instance.post(url, data)
}

export const deleteCategory = (id) => {
    const url = API_PATH + `/${id}`
    return instance.delete(url)
}

export const editCategory = (data) => {
    const url = API_PATH + `/${data.id}`
    return instance.put(url, data)
}

export const addSubCategory = (data) => {
    const url = API_PATH + '/sub'
    return instance.post(url, data)
}

export const editSubCategory = (data) => {
    const url = API_PATH + `/sub/${data.id}`
    return instance.put(url, data)
}

export const deleteSubCategory = (id) => {
    const url = API_PATH + `/sub/${id}`
    return instance.delete(url)
}
import { instance } from '../Auth/AuthAxiosCommon'
import axios from 'axios'
import ConstantList from '../../appConfig'

const API_PATH = ConstantList.API_ENDPOINT + '/users'

export const getAllUser = () => {
    return instance.get(API_PATH)
} 

export const deleteUser = (id) => {
    return instance.delete(API_PATH + `/${id}`)
}
import ConstantList from "../../appConfig";
import axios from "axios"

const API_ENPOINT = ConstantList.API_ENDPOINT

export const userLogin = (username, password) => {
    const url = API_ENPOINT + '/users/authenticate'
    return axios.post(url, {username, password})
}

export const userSignup = (user) => {
    const url = API_ENPOINT + '/users/signup'
    return axios.post(url, user)
}
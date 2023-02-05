import axios from "axios"
import ConstantList from "../../appConfig"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

export var access_token = localStorage.getItem("access_token")

export function SetAccess() {
    const isAuth = useSelector(state => state.auth.auth)
    useEffect(() => {
        access_token = localStorage.getItem("access_token")
    }, [isAuth])
}

export const instance = axios.create({
    baseURL: ConstantList.API_ENDPOINT
})

instance.defaults.headers.common['Authorization'] = access_token ? `Bearer ${access_token}` : ''

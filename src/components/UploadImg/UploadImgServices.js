import axios from "axios"
export const uploadImg = (file) => {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("album", "UcaliT5")
    formData.append("client_secret", "a8b3c965ccd7a2dd0b08a1a62577eb101c550a88")
    return axios("https://api.imgur.com/3/image/", {
        method: "post",
        headers: {
            Authorization: "Bearer a675b6f5662af79e6d5d462df11c473b49a7f979"
        },
        data: formData
    })
}

export const getToken = () => {
    const formData = new FormData()
    formData.append("album", "UcaliT5")
    formData.append("client_secret", "a8b3c965ccd7a2dd0b08a1a62577eb101c550a88")

}

export const deleteImg = (id) => {
    const formData = new FormData()
    return axios(`https://api.imgur.com/3/image/${id}`, {
        method: "delete",
        headers: {
            Authorization: "Bearer a675b6f5662af79e6d5d462df11c473b49a7f979"
        },
        data: formData
    })
}

// https://imgur.com/#access_token=a675b6f5662af79e6d5d462df11c473b49a7f979&expires_in=315360000&token_type=bearer&refresh_token=9a7c95c965e00968a8ae04463b20f3fa95deb192&account_username=trungvs&account_id=38287868
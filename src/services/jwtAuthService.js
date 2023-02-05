import React from "react";
import axios from "axios";
import ConstantList from "../appConfig";

class jwtAuthService {
  async loginWithUserNameAndPassword(username, password) {
    let resLogin;
    let requestBody =
      "client_id=core_client&grant_type=password&client_secret=secret";
    requestBody =
      requestBody + "&username=" + username + "&password=" + password;
    const res = await axios
      .post(ConstantList.API_ENPOINT + "/oauth/token", requestBody)
      .then((response) => {
        var dateObj = new Date(Date.now() * 10000);
        localStorage.setItem("token_expire_time", JSON.stringify(dateObj));
        this.setSession(response.data.access_token);
        resLogin =  response
      })
    return resLogin;
  }

  setSession(token) {
    if (token) {
      localStorage.setItem("jwt_token", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("token_expire_time");
      delete axios.defaults.headers.common["Authorization"];
    }
  }

  logout(){
    this.setSession(null)
    let url = ConstantList.API_ENPOINT + "/auth/logout";
    axios.delete(url);
  }
}
export default new jwtAuthService();

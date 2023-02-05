import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Switch,
  useParams,
  useHistory,
} from "react-router-dom";
import { useSelector } from "react-redux";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import "./Profile.scss";

import ProfileInfo from "./ProfileInfo";
import ProfileOrders from "./ProfileOrders";
import AuthForm from "../Auth/AuthNormal";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Profile() {
  const history = useHistory();
  const username = useSelector((state) => state.profile.username);
  const isAuth = useSelector((state) => state.auth.auth);
  const { url } = useParams();
  const [active, setActive] = useState("info")
  // const [value, setValue] = useState(10)

  const handleLogOut = () => {
    localStorage.removeItem("access_token")
    history.push("/")
    window.location.reload()
  }

  useEffect(() => {
    console.log(url);
  }, []);

  return (
    <Router>
      <div className="profile-wrapper">
        {isAuth && (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4} lg={4}>
                <h2 className="user-name">{username}</h2>
                <ul className="user-action">
                  <li
                    className={
                      active === "info" ? "user-info active" : "user-info"
                    }
                    onClick={() => setActive("info")}
                  >
                    <NavLink exact to="/profile">
                      Thông tin cá nhân
                    </NavLink>
                  </li>
                  <li
                    className={
                      active === "orders" ? "user-orders active" : "user-orders"
                    }
                    onClick={() => setActive("orders")}
                  >
                    <NavLink to="/profile/orders">Danh sách đơn hàng</NavLink>
                  </li>
                  <li
                    className={
                      active === "review" ? "user-review active" : "user-review"
                    }
                    onClick={() => setActive("review")}
                  >
                    <NavLink to="/profile/reviews">Đánh giá</NavLink>
                  </li>
                  <li
                    className={
                      active === "routine"
                        ? "user-routine active"
                        : "user-routine"
                    }
                    onClick={() => setActive("routine")}
                  >
                    <NavLink to="/profile/routine">Tủ đồ định kỳ</NavLink>
                  </li>
                  <li
                    className={
                      active === "voucher"
                        ? "user-voucher active"
                        : "user-voucher"
                    }
                    onClick={() => setActive("voucher")}
                  >
                    <NavLink to="/profile/voucher">Ví Voucher</NavLink>
                  </li>
                  <li
                    className={
                      active === "feedback"
                        ? "user-feedback active"
                        : "user-feedback"
                    }
                    onClick={() => setActive("feedback")}
                  >
                    <NavLink to="/profile/feedback">
                      Gửi ý kiến cho Coolmate
                    </NavLink>
                  </li>
                  <li
                    className={
                      active === "logout" ? "user-logout active" : "user-logout"
                    }
                    onClick={() => handleLogOut()}
                  >
                    <NavLink exact to="/profile/logout">
                      Thoát
                    </NavLink>
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <Switch>
                  <Route exact path="/profile">
                    <ProfileInfo />
                  </Route>
                  <Route exact path="/profile/orders">
                    <ProfileOrders />
                  </Route>
                  <Route exact path="/profile/:url">
                    {/* <ProfileInfo /> */}
                  </Route>
                </Switch>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* {
          isAuth && (
            <div className="profile-wrapper-menu">

            </div>
          )
        } */}

        {!isAuth && <AuthForm />}
      </div>
    </Router>
  );
}

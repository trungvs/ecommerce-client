import './App.scss';
import axios from 'axios';
import NavBar from './components/NavBar/NavBar';
import HomePage from './components/HomePage/HomePage';
import Loading from './components/Loading/Loading';
import AdminCP from './components/AdminCP/AdminCP';

import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { openLoading, closeLoading, selectLoading } from "./components/Loading/loadingSlice";
import toast, { Toaster } from 'react-hot-toast';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { instance } from './components/Auth/AuthAxiosCommon';

function App() {

  const dispatch = useDispatch()
  const loading = useSelector(state => state.loading.open)
  const history = useHistory()
  const isAdmin = useSelector(state => state.profile.isAdmin)

  axios.interceptors.request.use(function (config) {
    dispatch(openLoading())
    return config;
  }, function (error) {
    dispatch(closeLoading())
    return Promise.reject(error);
  });

  axios.interceptors.response.use(function (response) {
    dispatch(closeLoading())
    if (response.data.code === 401 || 403) {
      // toast.warning(response.data.message)s
    }
    return response;
  }, function (error) {
    dispatch(closeLoading())
    return Promise.reject(error);
  });

  instance.interceptors.request.use(function (config) {
    dispatch(openLoading())
    return config;
  }, function (error) {
    dispatch(closeLoading())
    return Promise.reject(error);
  });

  instance.interceptors.response.use(function (response) {
    dispatch(closeLoading())
    if (response.data.code === 401 || 403) {
      // toast.warning(response.data.message)s
    }
    return response;
  }, function (error) {
    dispatch(closeLoading())
    return Promise.reject(error);
  });


  return (
    <div className="App">
      <Toaster position="top-right" />
      <Loading />

      <Router>
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/admincp">
            <AdminCP />
          </Route>
      </Router>

      {
        isAdmin && (
          <Fab
            // size="large"
            type="button"
            variant="contained"
            color="primary"
            style={{ position: "fixed", bottom: "50px", right: "50px"}}
            onClick={() => window.location.href = "/admincp"}
            >
            <AdminPanelSettingsIcon />
        </Fab>
        )
      }
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuth, removeAuth, setLoginSuccess } from './authSlice'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import toast, { Toaster } from 'react-hot-toast';

import './Auth.scss'

import { userLogin, userSignup } from './AuthServices'

export default function Auth({ closeForm, isAdmin }) {

    const history = useHistory()
    const dispatch = useDispatch()
    const isLogin = useSelector(state => state.auth.auth)

    // useEffect(() => {
    //     if (isLogin) {
    //         history.goBack()
    //     }
    // },[isLogin])

    const [login, setLogin] = useState(true);
    const [signin, setSignIn] = useState(false)
    const [forget, setFotget] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleClickOpen = () => {
        formik.resetForm()
        setSignIn(false)
        setFotget(false)
        setLogin(true);
    };
    const handleClose = () => {
        // setLogin(false);
        closeForm()
    };

    const handleSignUpOpen = () => {
        formSignin.resetForm()
        setFotget(false)
        setLogin(false)
        setSignIn(true)
    }

    const handleForgetOpen = () => {
        formikForget.resetForm()
        setFotget(true)
        setLogin(false)
        setSignIn(false)
    }

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Vui l??ng nh???p t??i kho???n!"),
            password: Yup.string().required("Vui l??ng nh???p m???t kh???u!"),
        }),
        onSubmit: (values) => {
            let username = values.username;
            let password = values.password

            setLoading(true)
            userLogin(username, password)
            .then(res => {
                if (res.data.code === 200) {
                    dispatch(setAuth(res.data.data))
                    dispatch(setLoginSuccess(true))
                    toast.success("????ng nh???p th??nh c??ng")
                    // if (history.location.pathname === '/auth') {
                    //     history.push('/')
                    // } else {
                    //     history.goBack()
                    // }
                    handleClose()
                    window.location.reload()
                } else {
                    toast.error(res.data.message)
                }
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
                toast.error("????ng nh???p kh??ng th??nh c??ng")
            })
        }
    })

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const formSignin = useFormik({
        initialValues: {
            username: "",
            phone: "",
            email: "",
            password: "",
            confirm_password: ""
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Vui l??ng nh???p t??i kho???n"),
            phone: Yup.string()
                .matches(phoneRegExp, "S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng")
                .required("Vui l??ng nh???p S??? ??i???n tho???i"),
            email: Yup.string()
                .email("Email kh??ng ????ng ?????nh d???ng")
                .required("Vui l??ng nh???p Email"),
            password: Yup.string()
                .min(8, "M???t kh???u t???i thi???u 8 k?? t???")
                .required("Vui l??ng nh???p m???t kh???u"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password")], "M???t kh???u nh???p l???i kh??ng ch??nh x??c")
                .required("Vui l??ng nh???p l???i m???t kh???u")
        }),
        onSubmit: (values) => {
            userSignup(values)
            .then(res => {
                if (res.data.code === 200) {
                    toast.success(res.data.message)
                    window.location.reload()
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    })

    const formikForget = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Email kh??ng ????ng ?????nh d???ng")
                .required("Vui l??ng nh???p Email"),
        }),
        onSubmit: (values) => {
            console.log(values)
        }
    })

    const styles = {
        Dialog: {
            borderRadius: "20px !important",
            overflowY: "auto"
        },
        DialogTitle: {
            textAlign: "center",
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: 30
        },
        DialogContent: {
            textAlign: "center",
        },
        text: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            fontWeight: "600",
        }
    }
    useEffect(() => {
        if (isAdmin) {
            handleSignUpOpen()
        }
        formik.resetForm()
    }, [])

    return (
        <div className="auth-wrapper">
            <Toaster position="top-right" />

            {/* Login Form */}
            <Dialog open={login} onClose={handleClose} stlye={styles.Dialog} disableScrollLock>
                <DialogActions sx={{ p: 0, mt: 2 }}>
                    <Button onClick={() => closeForm()}><CloseIcon size="large" /></Button>
                </DialogActions>
                <DialogTitle style={styles.DialogTitle}>
                    ????ng Nh???p
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                    <DialogContentText style={styles.DialogContent}>
                    N???u ???? t???ng mua h??ng tr??n Website tr?????c ????y, b???n c?? th??? d??ng t??nh n??ng 
                    <span style={{ color: "blue"}}> "Qu??n m???t kh???u" </span>
                    ????? c?? th??? truy c???p v??o t??i kho???n b???ng email nh??.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="username"
                        label="Username"
                        type="text"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.errors.username && formik.touched.username}
                        helperText={formik.errors.username}
                        sx={{ mt: 2}}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.errors.password && formik.touched.password}
                        helperText={formik.errors.password}
                        sx={{mt: 2}}
                    />
                    <DialogActions sx={{ p: 0, mt: 2 }}>
                    {/* <LoadingButton variant="contained" size="large" type="submit" fullWidth sx={{p: 1.5}}>????ng Nh???p</LoadingButton> */}
                    <LoadingButton
                        size="large"
                        type="submit"
                        loading={loading}
                        variant="contained"
                        fullWidth
                        sx={{ p: 1.5 }}
                        >
                        ????ng Nh???p
                    </LoadingButton>
                    </DialogActions>
                    <DialogActions sx={{ p: 0, mt: 5, mb: 2 }} style={styles.text}>
                        <Link href="#" underline="none" onClick={handleSignUpOpen}>
                            ????ng k?? T??i kho???n
                        </Link>
                        <Link href="#" underline="none" onClick={handleForgetOpen}>
                            Qu??n m???t kh???u
                        </Link>
                    </DialogActions>
                    </DialogContent>
                </form>
            </Dialog>

            {/* Signin Form */}
            <Dialog open={signin} onClose={handleClose} stlye={styles.Dialog} disableScrollLock>
                <DialogActions sx={{ p: 0, mt: 2 }}>
                    <Button onClick={handleClose}><CloseIcon size="large" /></Button>
                </DialogActions>
                <DialogTitle style={styles.DialogTitle}>
                    ????ng K??
                </DialogTitle>
                <form onSubmit={formSignin.handleSubmit}>
                    <DialogContent>
                        {
                            !isAdmin && (
                                <DialogContentText style={styles.DialogContent}>
                                N???u ???? t???ng mua h??ng tr??n Website tr?????c ????y, b???n c?? th??? d??ng t??nh n??ng 
                                <span style={{ color: "blue"}}> "Qu??n m???t kh???u" </span>
                                ????? c?? th??? truy c???p v??o t??i kho???n b???ng email nh??.
                                </DialogContentText>
                            )
                        }
                    <TextField
                        margin="dense"
                        id="username"
                        label="Username"
                        type="text"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formSignin.values.username}
                        onChange={formSignin.handleChange}
                        error={formSignin.errors.username && formSignin.touched.username}
                        helperText={formSignin.errors.username}
                        sx={{ mt: 2}}
                    />
                    <TextField
                        margin="dense"
                        id="phone"
                        label="S??? ??i???n tho???i"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formSignin.values.phone}
                        onChange={formSignin.handleChange}
                        error={formSignin.errors.phone && formSignin.touched.phone}
                        helperText={formSignin.errors.phone}
                        sx={{ mt: 2}}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formSignin.values.email}
                        onChange={formSignin.handleChange}
                        error={formSignin.errors.email && formSignin.touched.email}
                        helperText={formSignin.errors.email}
                        sx={{ mt: 2}}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formSignin.values.password}
                        onChange={formSignin.handleChange}
                        error={formSignin.errors.password && formSignin.touched.password}
                        helperText={formSignin.errors.password}
                        sx={{mt: 2}}
                    />
                    <TextField
                        margin="dense"
                        id="confirm_password"
                        label="Nh???p l???i m???t kh???u"
                        type="password"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formSignin.values.confirm_password}
                        onChange={formSignin.handleChange}
                        error={formSignin.errors.confirm_password && formSignin.touched.confirm_password}
                        helperText={formSignin.errors.confirm_password}
                        sx={{mt: 2}}
                    />
                    <DialogActions sx={{ p: 0, mt: 2 }}>
                    <Button variant="contained" size="large" type="submit" fullWidth sx={{p: 1.5}}>????ng K??</Button>
                    </DialogActions>
                    {
                        !isAdmin && (
                            <DialogActions sx={{ p: 0, mt: 5, mb: 2 }} style={styles.text}>
                                <Link href="#" underline="none" onClick={handleClickOpen}>
                                    ????ng nh???p
                                </Link>
                                <Link href="#" underline="none" onClick={handleForgetOpen}>
                                    Qu??n m???t kh???u
                                </Link>
                            </DialogActions>
                        )
                    }
                    </DialogContent>
                </form>
            </Dialog>

            {/* Forget Form */}
            <Dialog open={forget} onClose={handleClose} stlye={styles.Dialog} disableScrollLock>
                <DialogActions sx={{ p: 0, mt: 2 }}>
                    <Button onClick={handleClose}><CloseIcon size="large" /></Button>
                </DialogActions>
                <DialogTitle style={styles.DialogTitle}>
                    Qu??n m???t kh???u
                </DialogTitle>
                <form onSubmit={formikForget.handleSubmit}>
                    <DialogContent>
                    <DialogContentText style={styles.DialogContent}>
                    N???u ???? t???ng mua h??ng tr??n Website tr?????c ????y, b???n c?? th??? d??ng t??nh n??ng 
                    <span style={{ color: "blue"}}> "Qu??n m???t kh???u" </span>
                    ????? c?? th??? truy c???p v??o t??i kho???n b???ng email nh??.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formikForget.values.email}
                        onChange={formikForget.handleChange}
                        error={formikForget.errors.email && formikForget.touched.email}
                        helperText={formikForget.errors.email}
                        sx={{ mt: 2}}
                    />
                    <DialogActions sx={{ p: 0, mt: 2 }}>
                    <Button variant="contained" size="large" type="submit" fullWidth sx={{p: 1.5}}>X??c nh???n</Button>
                    </DialogActions>
                    <DialogActions sx={{ p: 0, mt: 5, mb: 2 }} style={styles.text}>
                        <Link href="#" underline="none" onClick={handleSignUpOpen}>
                            ????ng k?? T??i kho???n
                        </Link>
                        <Link href="#" underline="none" onClick={handleClickOpen}>
                            ????ng nh???p
                        </Link>
                    </DialogActions>
                    </DialogContent>
                </form>
            </Dialog>

        </div>
    )
}
import React, { useEffect, useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { Autocomplete, DialogActions } from "@mui/material";
import Fab from '@mui/material/Fab';


import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

import axios from "axios";

import { userSignup } from '../Auth/AuthServices'
import { editInformation } from '../Profile/ProfileServices'

export default function UserEditorDialog({ handleClose, userID }) {

    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    const phoneRegExp = /(84|0[3|5|7|8|9|6])+([0-9]{8})\b/

    const formik = useFormik({
        initialValues: userID,
        validationSchema: 
            userID.id
            ? Yup.object({
                username: Yup.string().nullable().required("Vui lòng nhập Tài khoản!"),
                fullname: Yup.string().nullable().required("Vui lòng nhập Họ và tên!"),
                phone: Yup.string()
                    .nullable()
                    .matches(phoneRegExp, "Số điện thoại không đúng định dạng")
                    .required("Vui lòng nhập Số điện thoại!"),
                email: Yup.string()
                .nullable()
                    .email("Email không đúng định dạng")
                    .required("Vui lòng nhập Email!"),
                birthday: Yup.string()
                    .nullable()
                    .required("Vui lòng nhập ngày sinh"),
                detailAddress: Yup.string().nullable().required("Vui lòng nhập Địa chỉ!"),
                province: Yup.string().nullable().required("Vui lòng chọn Tỉnh!"),
                district: Yup.string().nullable().required("Vui lòng chọn Huyện!"),
                ward: Yup.string().nullable().required("Vui lòng chọn Xã!"),
            })
            : Yup.object({
                username: Yup.string().nullable().required("Vui lòng nhập Tài khoản!"),
                fullname: Yup.string().nullable().required("Vui lòng nhập Họ và tên!"),
                phone: Yup.string()
                    .nullable()
                    .matches(phoneRegExp, "Số điện thoại không đúng định dạng")
                    .required("Vui lòng nhập Số điện thoại!"),
                email: Yup.string()
                .nullable()
                    .email("Email không đúng định dạng")
                    .required("Vui lòng nhập Email!"),
                birthday: Yup.string()
                    .nullable()
                    .required("Vui lòng nhập ngày sinh"),
                detailAddress: Yup.string().nullable().required("Vui lòng nhập Địa chỉ!"),
                province: Yup.string().nullable().required("Vui lòng chọn Tỉnh!"),
                district: Yup.string().nullable().required("Vui lòng chọn Huyện!"),
                ward: Yup.string().nullable().required("Vui lòng chọn Xã!"),
                password: Yup.string()
                    .min(8, "Mật khẩu tối thiểu 8 ký tự")
                    .required("Vui lòng nhập mật khẩu"),
                confirm_password: Yup.string()
                    .oneOf([Yup.ref("password")], "Mật khẩu nhập lại không chính xác")
                    .required("Vui lòng nhập lại mật khẩu")
    
            })
        ,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (userID.id) {
                editInformation(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Sửa thông tin thành công")
                        handleClose()
                    } else {
                        toast.error(res.data.message)
                    }
                })
                .catch(err => {
                    toast.error("Thao tác thất bại")
                })
            } else {
                userSignup(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success(res.data.message)
                        handleClose()
                    } else {
                        toast.error(res.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }

        }
    })

    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/?depth=1")
        .then(res => {
            setProvinces(res.data)
            const selectedProvince = res.data.find(p => p.name === formik.values.province)?.code
            if (selectedProvince !== undefined) {
                axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(res => {
                    setDistricts(res.data.districts)
                    const selectedDistrict = res.data.districts.find(d => d.name === formik.values.district)?.code
                    axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                    .then(res => setWards(res.data.wards))
                })
            }
        })
    }, [])


    return (
        <Dialog open={true} onClose={handleClose} disableScrollLock maxWidth={"md"} fullWidth>
        <DialogTitle>
            {
                userID.id
                ? "Chỉnh sửa"
                : "Thêm mới"
            }
        </DialogTitle>
        <DialogContent>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 6, md: 12 }}>
                    <Grid item xs={12} sm={12} md={6}>
                    <TextField
                        margin="dense"
                        id="username"
                        type="text"
                        fullWidth
                        disabled={userID.id ? true : false}
                        size="small"
                        variant="outlined"
                        value={formik.values.username || ''}
                        onChange={formik.handleChange}
                        error={formik.errors.username && formik.touched.username}
                        helperText={formik.errors.username}
                        label="Tài khoản"
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                    <TextField
                        margin="dense"
                        id="fullname"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={formik.values.fullname || ''}
                        onChange={formik.handleChange}
                        error={formik.errors.fullname && formik.touched.fullname}
                        helperText={formik.errors.fullname}
                        label="Họ và tên"
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                    <TextField
                        margin="dense"
                        id="phone"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={formik.values.phone || ''}
                        onChange={formik.handleChange}
                        error={formik.errors.phone && formik.touched.phone}
                        helperText={formik.errors.phone}
                        label="Số điện thoại"
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                    <TextField
                        margin="dense"
                        id="email"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={formik.values.email || ''}
                        onChange={formik.handleChange}
                        error={formik.errors.email && formik.touched.email}
                        helperText={formik.errors.email}
                        label="Email"
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                    <TextField
                        margin="dense"
                        id="birthday"
                        type="date"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={formik.values.birthday || null}
                        onChange={formik.handleChange}
                        error={formik.errors.birthday && formik.touched.birthday}
                        helperText={formik.errors.birthday}
                    />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                    <TextField
                        margin="dense"
                        id="detailAddress"
                        type="text"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={formik.values.detailAddress || ''}
                        onChange={formik.handleChange}
                        error={formik.errors.detailAddress && formik.touched.detailAddress}
                        helperText={formik.errors.detailAddress}
                        label="Địa chỉ chi tiết"
                    />
                    </Grid>
                    {
                        !userID.id && (
                            <>
                            <Grid item xs={12} sm={12} md={6}>
                            <TextField
                                margin="dense"
                                id="password"
                                label="Mật khẩu"
                                type="password"
                                fullWidth
                                size="small"
                                variant="outlined"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.errors.password && formik.touched.password}
                                helperText={formik.errors.password}
                            />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6}>
                            <TextField
                                margin="dense"
                                id="confirm_password"
                                label="Nhập lại mật khẩu"
                                type="password"
                                fullWidth
                                size="small"
                                variant="outlined"
                                value={formik.values.confirm_password}
                                onChange={formik.handleChange}
                                error={formik.errors.confirm_password && formik.touched.confirm_password}
                                helperText={formik.errors.confirm_password}
                            />
                            </Grid>
                            </>
                        )

                    }
                </Grid>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={2} sm={4} md={4}>
                    <Autocomplete
                        value={formik.values.province || ''}
                        onChange={(event, newValue) => {
                        formik.setFieldValue("province", newValue?.name ? newValue.name : "")
                        axios.get(`https://provinces.open-api.vn/api/p/${newValue.code}?depth=2`)
                        .then(res => {
                            formik.setFieldValue("district", "")
                            formik.setFieldValue("ward", "")
                            setDistricts(res.data.districts)
                        })
                        .catch(err => console.log(err))
                        }}
                        inputValue={formik.values.province}
                        onInputChange={(event, newInputValue) => {
                        // formik.setFieldValue("province", newInputValue)
                        }}
                        isOptionEqualToValue={(option, value) => option.name === value }
                        getOptionLabel={(option) => option.name ? option.name : option}
                        id="controllable-states-demo"
                        options={provinces}
                        size="small"
                        sx={{mt: 2}}
                        renderInput={(params) => <TextField 
                            {...params} 
                            label="Tỉnh" 
                            fullWidth
                            error={formik.errors.province && formik.touched.province}
                            helperText={formik.errors.province}
                                />}
                    />
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                    <Autocomplete
                        value={formik.values.district || ''}
                        onChange={(event, newValue) => {
                        formik.setFieldValue("district", newValue?.name ? newValue.name : "")
                        axios.get(`https://provinces.open-api.vn/api/d/${newValue.code}?depth=2`)
                        .then(res => {
                            formik.setFieldValue("ward", "")
                            setWards(res.data.wards)
                        })
                        .catch(err => console.log(err))
                        }}
                        inputValue={formik.values.district}
                        onInputChange={(event, newInputValue) => {
                        // formik.setFieldValue("province", newInputValue)
                        }}
                        isOptionEqualToValue={(option, value) => option.name === value }
                        getOptionLabel={(option) => option.name ? option.name : option}
                        id="controllable-states-demo"
                        options={districts}
                        size="small"
                        sx={{mt: 2}}
                        renderInput={(params) => <TextField 
                            {...params} 
                            label="Huyện" 
                            fullWidth
                            error={formik.errors.district && formik.touched.district}
                            helperText={formik.errors.district}
                                />}
                    />
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                    <Autocomplete
                        value={formik.values.ward || ''}
                        onChange={(event, newValue) => {
                        formik.setFieldValue("ward", newValue?.name ? newValue.name : "")
                        }}
                        inputValue={formik.values.ward}
                        onInputChange={(event, newInputValue) => {
                        // formik.setFieldValue("ward", newInputValue)
                        }}
                        isOptionEqualToValue={(option, value) => option.name === value }
                        getOptionLabel={(option) => option.name ? option.name : option}
                        id="controllable-states-demo"
                        options={wards}
                        size="small"
                        sx={{mt: 2}}
                        renderInput={(params) => 
                        <TextField 
                        {...params} 
                        label="Xã" 
                        fullWidth
                        error={formik.errors.ward && formik.touched.ward}
                        helperText={formik.errors.ward} />}
                    />
                    </Grid>
                </Grid>
                <DialogActions>
                <Button
                    size="medium"
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2}}
                    onClick={handleClose}
                    >
                    Đóng
                </Button>
                <Button
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2}}
                    >
                    {
                        userID.id
                        ? "Cập nhật"
                        : "Thêm mới"
                    }
                </Button>
                </DialogActions>
            </form>
        </DialogContent>
    </Dialog>
    )
}
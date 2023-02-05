import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUsername } from './profileSlice'

import Grid from '@mui/material/Grid';

import './Profile.scss'

import { getInformation, editInformation } from './ProfileServices'

import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from '@mui/material/TextField';
import toast, { Toaster } from 'react-hot-toast';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import axios from "axios";
import { SetAccess } from "../Auth/AuthAxiosCommon";
import { Autocomplete, Button } from "@mui/material";


export default function ProfileInfo() {

    const history = useHistory()
    const dispatch = useDispatch()

    const isAuth = useSelector(state => state.auth.auth)
    const [render, setRender] = useState(true)
    const [data, setData] = useState({})
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    const phoneRegExp = /(84|0[3|5|7|8|9|6])+([0-9]{8})\b/

    const formik = useFormik({
        initialValues: data,
        validationSchema: Yup.object({
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

        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            editInformation(values)
            .then(res => {
                if (res.data.code === 200) {
                    toast.success("Sửa thông tin thành công")
                    setRender(!render)
                } else {
                    toast.warning(res.data.message)
                }
            })
            .catch(err => {
                toast.warning("Thao tác thất bại")
            })
        }
    })

    useEffect(() => {
        getInformation()
        .then(res => {
            setData(res.data.data)
            formik.setValues(res.data.data)
            formik.values.province = res.data.data.province
            formik.values.district = res.data.data.district
            formik.values.ward = res.data.data.ward
            dispatch(setUsername(res.data.data.fullname))
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
        })
        .catch(err => {
            console.log(err)
        })
        
    }, [render, isAuth])

    useEffect(() => {
        
    }, [])

    const styles = {
        input: {
            borderRadius: '10px'
        }
    }
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        MenuListProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
      };
    
    const handleClick = (e, type) => {
        const value = e.target.getAttribute("data-value")
        const valueID = e.target.getAttribute("id")
        if (type === "province") {
            setDistricts([])
            setWards([])
            formik.values.district = ""
            formik.values.ward = ""
            axios.get(`https://provinces.open-api.vn/api/p/${valueID}?depth=2`)
            .then(res => {
                setDistricts(res.data.districts)
            })
            .catch(err => console.log(err))
        }
        if (type === "district") {
            setWards([])
            formik.values.ward = ""
            axios.get(`https://provinces.open-api.vn/api/d/${valueID}?depth=2`)
            .then(res => {
                setWards(res.data.wards)
            })
            .catch(err => console.log(err))
        }
    }
    
    return (
        <div className="info-wrapper">
            <Toaster position="top-right" />
            <h2 className="info-name">
                Thông tin cá nhân
                {/* { data.role === "admin" && (
                    <a href="/admincp">
                    <Fab variant="extended" color="primary" size="meidum">
                            <NavigationIcon sx={{ mr: 1 }} />
                            ADMIN CP
                    </Fab>
                    </a>
                )} */}
                </h2>

            <div className="info-section">
                <div className="info-username">
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-control">
                        <span>Tài khoản</span>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="username"
                            type="text"
                            fullWidth
                            disabled
                            size="small"
                            variant="outlined"
                            value={formik.values.username || ''}
                            onChange={formik.handleChange}
                            error={formik.errors.username && formik.touched.username}
                            helperText={formik.errors.username}
                            sx={{ mt: 2 }}
                        />
                    </div>
                    <div className="form-control">
                        <span>Họ và tên</span>
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
                            sx={{ mt: 2}}
                            color=""
                        />
                    </div>
                    <div className="form-control">
                        <span>Số điện thoại</span>
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
                            sx={{ mt: 2}}
                        />
                    </div>
                    <div className="form-control">
                        <span>Email</span>
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
                            sx={{ mt: 2}}
                        />
                    </div>
                    <div className="form-control">
                        <span>Ngày sinh</span>
                        <TextField
                            margin="dense"
                            id="birthday"
                            type="date"
                            fullWidth
                            size="small"
                            variant="outlined"
                            value={formik.values.birthday || ''}
                            onChange={formik.handleChange}
                            error={formik.errors.birthday && formik.touched.birthday}
                            helperText={formik.errors.birthday}
                            sx={{ mt: 2}}
                        />
                    </div>
                    <div className="form-control">
                        <span>Địa chỉ</span>
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
                            sx={{ mt: 2}}
                        />
                    </div>
                    <div className="form-control">
                        <span>Tỉnh/Huyện/Xã</span>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid item xs={12} sm={4} md={4}>
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
                        <Grid item xs={12} sm={4} md={4}>
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
                        <Grid item xs={12} sm={4} md={4}>
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
                    </div>
                    <Button
                        size="medium"
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mr: 3 }}
                        >
                        Cập nhật tài khoản
                    </Button>
                    <Button
                        size="medium"
                        type="button"
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3 }}
                        onClick={() => setRender(!render)}
                        >
                        Huỷ thay đổi
                    </Button>
                </form>
                </div>
            </div>
        </div>
    )
}


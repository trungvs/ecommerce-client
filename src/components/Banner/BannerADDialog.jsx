import React, { useState } from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { addBanner, editBanner } from "./BannerServices";
import { InputAdornment } from "@mui/material";
import { UploadImgDialog } from "../UploadImg/UploadImgDialog";



export default function BannerADDialog({ open, handleClose, valueEdit, render }) {

    const [listDefault, setListDefault] = useState("")
    const [openUpload, setOpenUpload] = useState(false)
    const [checkPc, setCheckPc] = useState(false)

    const formik = useFormik({
        initialValues: valueEdit,
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required("Vui lòng nhập tên Banner!"),
            url: Yup.string().required("Vui lòng nhập link Banner!"),
            img: Yup.string().required("Vui lòng nhập link Banner trên PC!"),
            img_mobile: Yup.string().required("Vui lòng nhập link Banner trên Mobile!"),
        }),
        onSubmit: (values) => {
            if (values.id) {
                editBanner(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Thao tác thành công")
                        handleClose()
                        render()
                    } else {
                        toast.error(res.data.message)
                    }
                })
                .catch(err => toast.error("Thao tác thất bại"))
            } else {
                addBanner(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Thao tác thành công")
                        handleClose()
                        render()
                    } else {
                        toast.error(res.data.message)
                    }
                })
                .catch(err => toast.error("Thao tác thất bại"))
            }
        }
    })

    const handleSave = (data) => {
        if (checkPc) {
            formik.setFieldValue("img", data.toString())
        } else {
            formik.setFieldValue("img_mobile", data.toString())
        }
        setOpenUpload(false)
    }

    return (

        <div>
        { openUpload && (
        <UploadImgDialog
        handleClose={() => setOpenUpload(false)}
        handleSave={handleSave}
        listDefault={listDefault}
        singleSelect={true}
            />
            )}
        <Dialog fullWidth open={open} disableScrollLock onClose={() => {
            handleClose()
            formik.resetForm()
          }}>
            <form onSubmit={formik.handleSubmit}>
            <DialogTitle>{ valueEdit.id ? "Chỉnh sửa Banner" : "Thêm mới Banner"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Tên Banner"
                        type="text"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.errors.name && formik.touched.name}
                        helperText={formik.errors.name}
                        sx={{ mt: 2}}
                    />
                    <TextField
                        margin="dense"
                        id="url"
                        label="Link Banner"
                        type="text"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formik.values.url}
                        onChange={formik.handleChange}
                        error={formik.errors.url && formik.touched.url}
                        helperText={formik.errors.url}
                        sx={{mt: 2}}
                    />
                    <TextField
                        margin="dense"
                        id="img"
                        label="Link Ảnh (PC)"
                        type="text"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formik.values.img}
                        onChange={formik.handleChange}
                        error={formik.errors.img && formik.touched.img}
                        helperText={formik.errors.img}
                        sx={{mt: 2}}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end" onClick={() => {
                                    setListDefault(formik.values.img)
                                    setOpenUpload(true)
                                    setCheckPc(true)
                                }}>
                                <Button 
                                variant="contained"
                                >Chọn</Button>
                              </InputAdornment>
                                )
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="img_mobile"
                        label="Link Ảnh (Mobile)"
                        type="text"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        value={formik.values.img_mobile}
                        onChange={formik.handleChange}
                        error={formik.errors.img_mobile && formik.touched.img_mobile}
                        helperText={formik.errors.img_mobile}
                        sx={{mt: 2}}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end" onClick={() => {
                                    setListDefault(formik.values.img_mobile)
                                    setOpenUpload(true)
                                    setCheckPc(false)
                                }}>
                                <Button 
                                variant="contained"
                                >Chọn</Button>
                              </InputAdornment>
                                )
                        }}
                    />
                <DialogActions sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={handleClose}>Huỷ</Button>
                {
                    valueEdit.id
                    ? <Button variant="contained" type="submit" color="primary">Cập nhật</Button>
                    : <Button variant="contained" type="submit" color="primary">Thêm mới</Button>
                }
                </DialogActions>
                </DialogContent>
            </form>
          </Dialog>
        </div>

        
    )
}
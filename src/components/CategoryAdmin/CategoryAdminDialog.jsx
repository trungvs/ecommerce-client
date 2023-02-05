import React, {useState} from "react"

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useFormik } from "formik";
import * as Yup from "yup";

import { createCategory, editCategory, addSubCategory, editSubCategory } from './CategoryAdminServices'
import toast from "react-hot-toast";
import { InputAdornment } from "@mui/material";
import { UploadImgDialog } from "../UploadImg/UploadImgDialog";

export default function CategoryAdminDialog({ open, handleClose, valueEdit, render, openSub, parentData }) {

    const [age, setAge] = React.useState('');
    const [listDefault, setListDefault] = useState("")
    const [openUpload, setOpenUpload] = useState(false)

    const handleChange = (event) => {
      setAge(event.target.value);
    };

    const imgRegex = /(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png)/i

    const handleClick = (e) => {
        const id = e.target.getAttribute("data-value")
        const name = e.target.getAttribute("name")
        // formik.values.main_category = {
        //     id,
        //     name
        // }
        formik.values.main_category = id
    }

    const formik = useFormik({
        initialValues: valueEdit,
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required("Vui lòng nhập tên danh mục!"),
            image: Yup
                .string().required("Vui lòng nhập link ảnh danh mục!")
                .matches(imgRegex, "Định dạng ảnh không chính xác, sử dụng .png .jpg .jpeg")
        }),
        onSubmit: (values) => {
            if (values.id) {
                editCategory(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Sửa Danh mục thành công")
                        handleClose()
                        formik.resetForm()
                        render()
                    } else {
                        toast.warning(res.data.message)
                    }
                })
                .catch(err => toast.warning("Thao tác thất bại"))
            } else {
                createCategory(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Tạo Danh mục thành công")
                        handleClose()
                        formik.resetForm()
                        render()
                    } else {
                        toast.warning(res.data.message)
                    }
                })
                .catch(err => toast.warning("Thao tác thất bại"))
            }
        }
    })

    const formikSub = useFormik({
        initialValues: valueEdit,
        enableReinitialize: true,
        validationSchema: Yup.object({
            main_category: Yup.string().required("Vui lòng chọn danh mục lớn"),
            name: Yup.string().required("Vui lòng nhập tên danh mục!"),
            image: Yup
                .string().required("Vui lòng nhập link ảnh danh mục!")
                .matches(imgRegex, "Định dạng ảnh không chính xác, sử dụng .png .jpg .jpeg")
        }),
        onSubmit: (values) => {
            if (values.id) {
                editSubCategory(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Thao tác thành công")
                        handleClose()
                        formik.resetForm()
                        render()
                    } else {
                        toast.warning(res.data.message)
                    }
                })
                .catch(err => toast.warning("Thao tác không thành công"))
            } else {
                addSubCategory(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Thao tác thành công")
                        handleClose()
                        formik.resetForm()
                        render()
                    } else {
                        toast.warning(res.data.message)
                    }
                })
                .catch(err => toast.warning("Thao tác không thành công"))
            }
        }
    })

    const handleSave = (data) => {
        setOpenUpload(false)
        if (open) {
            formik.setFieldValue("image", data.toString())
        } else {
            formikSub.setFieldValue("image", data.toString())
        }
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
        <DialogTitle>{ valueEdit.id ? "Chỉnh sửa Danh Mục" : "Thêm mới Danh Mục"}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="name"
                    label="Tên Danh mục"
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
                    id="image"
                    label="Link Hình ảnh"
                    type="text"
                    fullWidth
                    size="medium"
                    variant="outlined"
                    value={formik.values.image}
                    onChange={formik.handleChange}
                    error={formik.errors.image && formik.touched.image}
                    helperText={formik.errors.image}
                    sx={{mt: 2}}
                    InputProps={{
                        readOnly: true,
                        endAdornment: (
                            <InputAdornment position="end" onClick={() => {
                                setListDefault(formik.values.image)
                                setOpenUpload(true)
                            }}>
                            <Button 
                            variant="contained"
                            >Chọn</Button>
                          </InputAdornment>
                            )
                    }}
                />
            <DialogActions sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => {
                handleClose()
                formik.resetForm()
            }}>Huỷ</Button>
            {
                valueEdit.id
                ? <Button variant="contained" type="submit" color="primary">Cập nhật</Button>
                : <Button variant="contained" type="submit" color="primary">Thêm mới</Button>
            }
            </DialogActions>
            </DialogContent>
        </form>
      </Dialog>

      <Dialog fullWidth open={openSub} disableScrollLock onClose={() => {
        handleClose()
        formikSub.resetForm()
      }} sx={{ width: "auto" }}>
        <DialogTitle>{ valueEdit.id ? "Chỉnh sửa Danh mục con" : "Thêm Danh mục con"}</DialogTitle>
        <form onSubmit={formikSub.handleSubmit}>
        <DialogContent sx={{ pt: 0 }}>
            <TextField
                select
                id="main_category"
                label="Danh mục Lớn"
                name="main_category"
                value={formikSub.values.main_category || ''}
                onChange={formikSub.handleChange}
                fullWidth
                sx={{mt: 2}}
                error={formikSub.errors.main_category && formikSub.touched.main_category}
                helperText={formikSub.errors.main_category}
                >
                    { parentData.filter(p => !p.main_category).map(parent => {
                        return <MenuItem value={parent.id} key={parent.id} name={parent.name} onClick={e => handleClick(e)}>{parent.name}</MenuItem>
                    })}

            </TextField>
            <TextField
                margin="dense"
                id="name"
                label="Tên Danh mục"
                type="text"
                fullWidth
                size="medium"
                variant="outlined"
                value={formikSub.values.name}
                onChange={formikSub.handleChange}
                error={formikSub.errors.name && formikSub.touched.name}
                helperText={formikSub.errors.name}
                sx={{ mt: 2}}
            />
            <TextField
                margin="dense"
                id="image"
                label="Link Hình ảnh"
                type="text"
                fullWidth
                size="medium"
                variant="outlined"
                value={formikSub.values.image}
                onChange={formikSub.handleChange}
                error={formikSub.errors.image && formikSub.touched.image}
                helperText={formikSub.errors.image}
                sx={{mt: 2}}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position="end" onClick={() => {
                            setListDefault(formikSub.values.image)
                            setOpenUpload(true)
                        }}>
                        <Button 
                        variant="contained"
                        >Chọn</Button>
                      </InputAdornment>
                        )
                }}
            />

            <DialogActions>
            <Button variant="outlined" onClick={() => {
                handleClose()
                formikSub.resetForm()
            }}>Huỷ</Button>
            {
                valueEdit.id
                ? <Button variant="contained" onClick={handleClose}>Cập nhật</Button>
                :<Button variant="contained" type="submit">Thêm mới</Button>
            }
            </DialogActions>
        </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
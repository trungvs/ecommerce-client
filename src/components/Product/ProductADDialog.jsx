import React, { useState, useEffect } from "react"

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AbcIcon from '@mui/icons-material/Abc';


import { useFormik, Formik, useFormikContext } from "formik";
import * as Yup from "yup";

import toast, { Toaster } from 'react-hot-toast';

import { default_colors, default_size } from './ProductVariant'
import { getAllCategory } from '../CategoryAdmin/CategoryAdminServices'
import { addProduct, editProduct, getVariant } from './ProductService'
import { InputAdornment } from "@mui/material";
import { UploadImgDialog } from "../UploadImg/UploadImgDialog";


export default function ProductADDialog({ open, handleClose, valueEdit, render }) {

    const initialState = [{
        id: Date.now(),
        size: 0,
        quantity: 0
    }]
    const [category, setCategory] = useState([])
    const [listSubcategory, setListSubCategory] = useState([])
    const [checked, setChecked] = useState(false)
    const [openVariant, setOpenVariant] = useState(false)
    const [listVariant, setListVariant] = useState(initialState)
    const [lengthVariant, setLengthVariant] = useState(0)
    const [colorName, setColorName] = useState('')
    const [openUpload, setOpenUpload] = useState(false)
    const [listSelected, setListSelected] = useState([])
    const [listDefault, setListDefault] = useState([])
    const formikProps = useFormikContext()

    const imgRegex = /(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png)/i

    const handleClick = (e, field) => {
        const id = e.target.getAttribute("data-value")
        console.log(id)
        if (field === "color") {
            formik.values.color = id
        }
        if (field === "main_category") {
            formik.values.main_category = id
            formik.values.sub_category = ''
        }
        if (field === "sub_category") {
            formik.values.sub_category = id
        }
        console.log(formik.values.main_category)
    }

    const handleChange = () => {
        setChecked(!checked)
    }

    const handleAddVariant = () => {
        if (listVariant.includes(7)) {
            toast.error("Không thể chọn phân loại khác khi chọn Không có size")
        } else {
            setListVariant([
                ...listVariant,
                {
                    id: Date.now(),
                    size: 0,
                    quantity: 0
                }
            ])
        }
    }

    const handleEditVariant = (e, id) => {
        let variant = listVariant.find(v => v.id === id)
        const filterVariant = listVariant.filter(v => v.id !== id)
        const filterSize = filterVariant.map(v => v.size)
        if (e.target.name === "size") {
            if (filterSize.includes(7)) {
                toast.error("Không thể chọn phân loại khác vì đã có phân loại Không có size")
            } else {
                if (filterSize.length !== 0 && e.target.value === 7) {
                    toast.error("Không thể chọn vì đã có phân loại đã có size")
                } else {
                    if (filterSize.includes(e.target.value)) {
                        toast.error("Đã tồn tại Size này")
                        return false
                    } else {
                        variant = {
                            ...variant,
                            [e.target.name]: e.target.value
                        }
                        if (filterVariant) {
                            const newList = listVariant.map(item => item.id === variant.id ? variant : item)
                            setListVariant(newList)
                            // setListVariant([
                            //     ...filterVariant,
                            //     variant
                            // ])
                        } else {
                            setListVariant([
                                variant
                            ])
                        }
                    }
                }
            }
        } else {
            variant = {
                ...variant,
                [e.target.name]: e.target.value
            }
            if (filterVariant) {
                const newList = listVariant.map(item => item.id === variant.id ? variant : item)
                setListVariant(newList)
                // setListVariant([
                //     ...filterVariant,
                //     variant
                // ])
            } else {
                setListVariant([
                    variant
                ])
            }
        }
        console.log(variant, e.target.name, e.target.value)
    }
    
    const handleDeleteVariant = (id) => {
        console.log(id)
        const newListVariant = listVariant.filter(variant => variant.id !== id)
        setListVariant(newListVariant)
    }

    const handleSave = (data) => {
        // formik.values.images = data.toString()
        setOpenUpload(false)
        formik.setFieldValue("images", data.toString())
        console.log(formik.values.images, data.toString())
    }

    const formik = useFormik({
        initialValues: {
            ...valueEdit,
            home_product: Boolean(Number(valueEdit.home_product)),
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required("Vui lòng nhập tên sản phẩm!"),
            description: Yup.string().required("Vui lòng nhập mô tả!"),
            images: Yup
                .string().required("Vui lòng chọn hình ảnh!")
                .matches(imgRegex, "Định dạng ảnh không chính xác, sử dụng .png .jpg .jpeg")
            ,
            price: Yup.number().required("Vui lòng nhập giá"),
            price_sale: Yup.number().required("Vui lòng nhập giá sale, mặc định là 0"),
            color: Yup.number().required("Vui lòng chọn màu"),
            main_category: Yup.string().required("Vui lòng chọn Thư mục chính!"),
            sub_category: Yup.string().required("Vui lòng chọn Thư mục con!")
        }),
        onSubmit: (values) => {
            formik.values.home_product = checked
            formik.values.variants = listVariant.filter(item => item.size !== 0)
            if (values.id) {
                editProduct(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Cập nhật thành công")
                        handleClose()
                        formik.resetForm()
                        render()
                    } else {
                        toast.error(res.data.message)
                    }
                })
                .catch(err => toast.error("Thao tác không thành công"))
            } else {
                addProduct(values)
                .then(res => {
                    if (res.data.code === 200) {
                        toast.success("Thao tác thành công")
                        handleClose()
                        formik.resetForm()
                        render()
                    } else {
                        toast.error(res.data.message)
                    }
                })
                .catch(err => toast.error("Thao tác không thành công"))
            }
        }
    })

    useEffect(() => {
        getAllCategory()
        .then(res => {
            if (res.data.code === 200) {
                setCategory(res.data.data)
            } else {
                toast.error("Không lấy được danh sách thư mục")
            }
        })
        .catch(err => toast.error("Không lấy được danh sách thư mục"))
        if (valueEdit.id) {
            setChecked(Boolean(Number(valueEdit.home_product)))
        } else {
            setChecked(false)
        }
    }, [])

    useEffect(() => {
        formik.values.sub_category = ''
    }, [formik.values.main_category])

    useEffect(() => {
        if (valueEdit.id) {
            getVariant(valueEdit.id)
            .then(res => {
                if (res.data.code === 200) {
                    setListVariant(res.data.data)
                    setLengthVariant(res.data.data.length)
                } else {
                    toast.error("Không lấy được danh sách phân loại")
                }
            })
            .catch(err => toast.error("Không lấy được danh sách phân loại"))
        }
    }, [])

  return (
    <div>

        {
            openUpload && (
                <UploadImgDialog
                handleClose={() => setOpenUpload(false)}
                handleSave={handleSave}
                listDefault={listDefault}
                />
            )
        }

      <Dialog fullWidth disableScrollLock open={open} onClose={() => {
        handleClose()
        formik.resetForm()
      }}>

        <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{ valueEdit.id ? "Chỉnh sửa Sản Phẩm" : "Thêm mới Sản Phẩm"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} columns={12}>
                <Grid item xs={6}>
                    <TextField
                        select
                        margin="dense"
                        id="main_category"
                        name="main_category"
                        label="Thư mục Chính"
                        type="number"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={formik.values.main_category}
                        onChange={formik.handleChange}
                        error={formik.errors.main_category && formik.touched.main_category}
                        helperText={formik.errors.main_category}
                        sx={{mt: 2}}
                    >
                        { category.filter(c => !c.main_category).map(category => {
                            return <MenuItem value={category.id} key={category.id} >{category.name}</MenuItem>
                        })}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        margin="dense"
                        id="sub_category"
                        name="sub_category"
                        label="Thư mục Con"
                        type="number"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={formik.values.sub_category ? formik.values.sub_category : ''}
                        onChange={formik.handleChange}
                        error={formik.errors.sub_category && formik.touched.sub_category}
                        helperText={formik.errors.sub_category}
                        sx={{mt: 2}}
                    >
                        { category.filter(c => c.main_category === formik.values.main_category).map(category => {
                            return <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                        })}
                    </TextField>
                </Grid>
                </Grid>
                <TextField
                    margin="dense"
                    id="name"
                    label="Tên Sản Phẩm"
                    type="text"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.errors.name && formik.touched.name}
                    helperText={formik.errors.name}
                    sx={{ mt: 2}}
                />
                <TextField
                    margin="dense"
                    id="description"
                    label="Mô tả"
                    type="text"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.errors.description && formik.touched.description}
                    helperText={formik.errors.description}
                    sx={{mt: 2}}
                />
                <TextField
                    select
                    margin="dense"
                    id="color"
                    name="color"
                    label="Màu sắc"
                    type="number"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={formik.values.color ? formik.values.color : ''}
                    onChange={formik.handleChange}
                    error={formik.errors.color && formik.touched.color}
                    helperText={formik.errors.color}
                    sx={{mt: 2}}
                >
                    { default_colors.map(color => {
                        return <MenuItem value={color.code} key={color.code} name={color.name}>{color.name}</MenuItem>
                    })}
                </TextField>
                <TextField
                    margin="dense"
                    id="images"
                    name="images"
                    label="Hình ảnh"
                    type="text"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={formik.values.images}
                    onChange={formik.handleChange}
                    error={formik.errors.images && formik.touched.images}
                    helperText={formik.errors.images}
                    sx={{mt: 2}}
                    InputProps={{
                        readOnly: true,
                        endAdornment: (
                            <InputAdornment position="end" onClick={() => {
                                setListDefault(formik.values.images)
                                // formik.values.images = ''
                                setOpenUpload(true)
                                console.log(formik.values.images)
                            }}>
                            <Button 
                            variant="contained"
                            >Chọn</Button>
                          </InputAdornment>
                            )
                    }}
                />

                <Grid container spacing={2} columns={12}>
                <Grid item xs={6}>
                    <TextField
                        margin="dense"
                        id="price"
                        label="Giá sản phẩm"
                        type="number"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        error={formik.errors.price && formik.touched.price}
                        helperText={formik.errors.price}
                        sx={{mt: 2}}
                    />
                </Grid>
                <Grid item xs={6}>
                <TextField
                    margin="dense"
                    id="price_sale"
                    label="Giá Sale"
                    type="number"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={formik.values.price_sale}
                    onChange={formik.handleChange}
                    error={formik.errors.price_sale && formik.touched.price_sale}
                    helperText={formik.errors.price_sale}
                    sx={{mt: 2}}
                />
                </Grid>
                </Grid>
                <FormControlLabel 
                    control={<Checkbox 
                        checked={openVariant}
                        onChange={() => {
                            setOpenVariant(!openVariant)
                            if (listVariant.length === 0) {
                                setListVariant(initialState)
                            }
                        }}
                         />}
                    label={formik.values.id ? `Hiển thị ${lengthVariant} Phân loại` : "Thêm Phân loại"}
                />
                <FormControlLabel 
                    control={<Checkbox
                        name="home_product" 
                        checked={checked}
                        onChange={() => {
                            handleChange()
                        }} 
                        />}
                    label="Hiển trị trên trang chủ" 
                />
                {
                    openVariant && (
                        <div>
                            { listVariant.map(variant => (
                            <Grid container spacing={2} columns={12}>
                            <Grid item xs={5}>
                                <TextField
                                    select
                                    margin="dense"
                                    id="size"
                                    label="Size"
                                    name="size"
                                    type="id"
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    value={variant.size}
                                    onChange={(e) => handleEditVariant(e, variant.id)}
                                    sx={{mt: 2}}
                                >
                                    { default_size.map(size => (
                                        <MenuItem value={size.code} key={size.code}>{size.size}</MenuItem>
                                    ))}

                                </TextField>
                            </Grid>
                            <Grid item xs={5}>
                            <TextField
                                margin="dense"
                                id="quantity"
                                label="Số Lượng"
                                name="quantity"
                                type="number"
                                fullWidth
                                size="small"
                                variant="outlined"
                                onChange={(e) => handleEditVariant(e, variant.id)}
                                value={variant.quantity}
                                sx={{mt: 2}}
                            />
                            </Grid>
                            <Grid item xs={2} sx={{display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 2}}>
                                <IconButton onClick={() => handleAddVariant()}>
                                    <AddCircleIcon color="primary"/>
                                </IconButton>
                                <IconButton onClick={() => handleDeleteVariant(variant.id)}>
                                    <DeleteIcon color="error"/>
                                </IconButton>
                            </Grid>
                            </Grid>
                            ))}
                        </div>
                    )
                }

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
    </div>
  );
}
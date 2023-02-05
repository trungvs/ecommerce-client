import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import ProductADDialog from './ProductADDialog'
import { getProduct, deleteProduct } from './ProductService'
import toast from "react-hot-toast";

import ProductADGroup from "./ProductADGroup";

import './Product.scss'

export default function ProductAD() {

    const initialValue = {
        name: "",
        description: "",
        images: "",
        price: "",
        price_sale: 0,
        color: "",
        main_category: "",
        sub_category: "",
        home_product: false
    }

    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [render, setRender] = useState(false)
    const [valueEdit, setValueEdit] = useState(initialValue)
    const [deleteId, setDeleteId] = useState(null)
    const [confirmDialog, setConfirmDialog] = useState(false)
    const [openGroup, setOpenGroup] = useState(false)

    const defaultMaterialTheme = createTheme();

    const handleClose = () => {
        setOpen(false)
        setConfirmDialog(false)
        setValueEdit(initialValue)
    }

    const handleCloseGroup = () => {
        setOpenGroup(false)
    }

    const handleRender = () => {
        setRender(!render)
    }

    const handleDeleteCategory = () => {
        deleteProduct(deleteId)
        .then(res => {
            if (res.data.code === 200) {
                toast.success("Xoá sản phẩm thành công")
                handleClose()
                handleRender()
            } else {
                toast.error("Xóa sản phẩm thất bại")
            }
        })
        .catch(err => toast.error("Xóa sản phẩm thất bại"))
    }

    useEffect(() => {
        getProduct()
        .then(res => {
            if (res.data.code === 200) {
                setData(res.data.data)
                console.log(res.data.data)
            } else {
                toast.error("Không lấy được danh sách thư mục")
            }
        })
        .catch(err => toast.error("Không lấy được danh sách thư mục"))
    }, [render])

    return (
        <div className="productad-wrapper">
            
            <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                <TextField 
                    id="outlined-basic" 
                    label="Tìm kiếm" 
                    variant="outlined" 
                    size="small" 
                    sx={{mr: 2}}
                />
                <Button variant="contained" sx={{mr: 2}} onClick={() => setOpen(true)}>Thêm Sản Phẩm</Button>
                <Button variant="contained" sx={{mr: 2}} onClick={() => setOpenGroup(true)}>Nhóm Sản phẩm</Button>          
            
            </Box>

            <Dialog open={confirmDialog} onClose={() => handleClose()}>
                <DialogTitle>Xác nhận xoá Danh mục này?</DialogTitle>
                <DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleDeleteCategory}
                        >
                        Xác nhận
                    </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            { open && (
                <ProductADDialog
                    open={open}
                    handleClose={() => handleClose()}
                    valueEdit={valueEdit}
                    render={() => handleRender()}
                />
            )}

            {
                openGroup && (
                    <ProductADGroup
                        open={openGroup}
                        handleClose={() => handleCloseGroup()}
                    />
                )
            }


            <Box sx={{ mt: 3}}>
                <ThemeProvider theme={defaultMaterialTheme}>
                    <MaterialTable
                    localization={{
                        header: {
                            actions: 'Thao tác'
                        }
                    }}
                    columns={[
                    { title: 'Danh mục', field: '', align: "center", render: item => (
                        <div className="category-table">
                    <Link to={`/category/${item.category_url}`} target="_blank">{item.category_name}</Link><br />
                    <Link to={`/collection/${item.subcategory_url}`} target="_blank">{item.subcategory_name}</Link>
                        </div>
                    )},
                    { title: 'Hình ảnh', field: '', align: "center", render: item => <img src={`${item.images.split(",")[0]}`} alt={item.name} className="category-img" /> },
                    { title: 'Tên Sản phẩm', field: 'name' },
                    { title: 'Link', field: 'url', render: item => (<Link to={`/product/${item.url}`} target="_blank">{item.url}</Link>)},
                    { title: 'Giá', field: 'price', align: "center" },
                    { title: 'Giá Sale', field: 'price_sale', align: "center" },
                    { title: 'Hiển trị trên trang chủ', field: '', align: "center", render: item => item.home_product === 1 ? <CheckCircleIcon /> : null},
                    { title: 'Hành động', field: '', render: (rowData) => {
                        return (
                            <>
                                <IconButton onClick={() => {
                                        setValueEdit(rowData)
                                        setOpen(true)
                                }}>
                                    <EditIcon color="primary" />
                                </IconButton>
                                <IconButton onClick={() => {
                                    setDeleteId(rowData.id)
                                    setConfirmDialog(true)
                                }}>
                                <DeleteIcon color="error" />
                                </IconButton>
                            </>
                        )
                    }}
                    ]}
                    data={data}
                    options={{
                        search: false,
                        showTitle: false,
                        toolbar: false,
                        headerStyle:{
                            backgroundColor:'#1976d2',
                            color: "#fff"
                        }
                    }}
                    
                    />
                </ThemeProvider>
            </Box>

        </div>
    )
}
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

import CategoryAdminDialog from "./CategoryAdminDialog";
import { UploadImgDialog } from "../UploadImg/UploadImgDialog";

import { getAllCategory, deleteCategory, deleteSubCategory  } from './CategoryAdminServices'

import './CategoryAdmin.scss'
import toast from "react-hot-toast";

export default function CategoryAdmin() {

    const initialValue = {
        name: '',
        url: '',
        image: '',
        main_category: ''
    }
    
    const [open, setOpen] = useState(false)
    const [data, setData] = useState([])
    const [valueEdit, setValueEdit] = useState(initialValue)
    const [render, setRender] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null)
    const [openSub, setOpenSub]= useState(false)
    const [openUpload, setOpenUpload] = useState(false)
    const [listDefault, setListDefault] = useState("")
    const defaultMaterialTheme = createTheme();

    useEffect(() => {
        getAllCategory()
        .then(res => {
            if (res.data.code === 200) {
                console.log(res.data.data)
                setData(res.data.data)
            } else {
                console.log(res.data.message)
            }
        })
    }, [render])

    const handleClose = () => {
        setValueEdit(initialValue)
        setOpen(false)
        setOpenSub(false)
        setDialog(false)
    }

    const handleRender = () => {
        setRender(!render)
    }

    const handleDeleteCategory = () => {
        if (deleteItem.main_category) {
            deleteSubCategory(deleteItem.id)
            .then(res => {
                if (res.data.code === 200) {
                    toast.success("Thao tác thành công")
                    setOpenSub(false)
                    handleRender()
                    handleClose()
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => toast.error("Thao tác thất bại"))
        } else {
            deleteCategory(deleteItem.id)
            .then(res => {
                if (res.data.code === 200) {
                    toast.success("Thao tác thành công")
                    setDialog(false)
                    setRender(!render)
                    handleClose()
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => toast.error("Thao tác thất bại"))
        }
    }

    const handleSave = () => {

    }

    return (
        <div className="categoryad-wrapper">

            <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
                <TextField 
                    id="outlined-basic" 
                    label="Tìm kiếm" 
                    variant="outlined" 
                    size="small" 
                    sx={{mr: 2}}
                />
                <Button variant="contained" onClick={() => setOpen(true)} sx={{ mr: 2 }}>Thêm Danh Mục</Button>          
                <Button variant="contained" onClick={() => setOpenSub(true)}>Thêm Phân Loại</Button>          
            
            </Box>

            <Dialog open={dialog} onClose={() => setDialog(false)}>
                <DialogTitle>Xác nhận xoá Danh mục này?</DialogTitle>
                <DialogContent>
                    <DialogActions>
                    <Button variant="outlined" onClick={() => setDialog(false)}>Huỷ</Button>
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

            <CategoryAdminDialog
                open={open}
                handleClose={() => handleClose()}
                valueEdit={valueEdit}
                render={() => handleRender()}
                parentData={data}
                openSub={openSub}
            />



            <Box sx={{ mt: 3}}>
                <ThemeProvider theme={defaultMaterialTheme}>
                    <MaterialTable
                    localization={{
                        header: {
                            actions: 'Thao tác'
                        }
                    }}
                    columns={[
                    { title: 'Hình ảnh', field: '', render: item => <img src={item.image} alt={item.name} className="category-img" /> },
                    { title: 'Tên Danh Mục', field: 'name' },
                    { title: 'Link', field: 'url', render: item => (
                        item.main_category
                        ? <Link to={`/collection/${item.url}`} target="_blank">{item.url}</Link>
                        : <Link to={`/category/${item.url}`} target="_blank">{item.url}</Link>
    )},
                    { title: 'Link Img', field: 'image' },
                    { title: 'Hành động', field: '', render: (rowData) => {
                        return (
                            <>
                                <IconButton onClick={() => {
                                    if (rowData.main_category) {
                                        setValueEdit(rowData)
                                        setOpenSub(true)
                                    } else {
                                        setValueEdit(rowData)
                                        setOpen(true)
                                    }
                                }}>
                                    <EditIcon color="primary" />
                                </IconButton>
                                <IconButton onClick={() => {
                                    setDeleteItem(rowData)
                                    setDialog(true)
                                }}>
                                <DeleteIcon color="error" />
                                </IconButton>
                            </>
                        )
                    }}
                    ]}
                    data={data}
                    parentChildData={(row, rows) => rows.find(a => a.id === row.main_category)}
                    options={{
                        search: false,
                        showTitle: false,
                        toolbar: false,
                        headerStyle:{
                            backgroundColor:'#1976d2',
                            color: "#fff"
                        },
                        rowStyle: rowData => ({ backgroundColor: rowData.main_category ? "#fff" : "#CECECE"})
                    }}
                    
                    />
                </ThemeProvider>
            </Box>


        </div>
    )
}
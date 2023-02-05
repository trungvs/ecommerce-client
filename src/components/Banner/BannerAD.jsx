import React, { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from '@mui/material';

import { getBanner } from './BannerServices'
import toast, { Toaster } from 'react-hot-toast';

import BannerADDialog from "./BannerADDialog";

import { deleteBanner } from './BannerServices'


export default function BannerAD() {

    const initialValues = {
        name: '',
        url: '',
        img: '',
        img_mobile: ''
    }

    const [open, setOpen] = useState(false)
    const [data, setData] = useState([])
    const [valueEdit, setValueEdit] = useState(initialValues)
    const [render, setRender] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const defaultMaterialTheme = createTheme();

    useEffect(() => {
        getBanner()
        .then(res => {
            if (res.data.code === 200) {
                setData(res.data.data)
                console.log(res.data.data)
            } else {
                toast.error(res.data.message)
            }
        })
        .catch(err => toast.error("Không lấy được dữ liệu"))
    }, [render])

    const handleClose = () => {
        setOpen(false)
    }

    const handleRender = () => {
        setRender(!render)
    }

    const handleDeleteBanner = () => {
        deleteBanner(deleteId)
        .then(res => {
            if (res.data.code === 200) {
                toast.success("Thao tác thành công")
                setDialog(false)
                handleRender()
            } else {
                toast.error(res.data.message)
            }
        })
        .catch(err => toast.error("Thao tác thất bại"))
    }

    return (
        <div className="bannercp-wrapper">
            <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
                <TextField 
                    id="outlined-basic" 
                    label="Tìm kiếm" 
                    variant="outlined" 
                    size="small" 
                    sx={{mr: 2}}
                />
                <Button variant="contained" onClick={() => {
                    setValueEdit(initialValues)
                    setOpen(true)
                }} sx={{ mr: 2 }}>Thêm Mới</Button>          
            </Box>

            <BannerADDialog
                open={open}
                handleClose={() => handleClose()}
                valueEdit={valueEdit}
                render={() => handleRender()}
            />

            <Dialog open={dialog} onClose={() => setDialog(false)}>
                <DialogTitle>Xác nhận xoá Danh mục này?</DialogTitle>
                <DialogContent>
                    <DialogActions>
                    <Button variant="outlined" onClick={() => setDialog(false)}>Huỷ</Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleDeleteBanner}
                        >
                        Xác nhận
                    </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>   

            <Box sx={{ mt: 3}}>
                <ThemeProvider theme={defaultMaterialTheme}>
                    <MaterialTable
                    localization={{
                        header: {
                            actions: 'Thao tác'
                        }
                    }}
                    columns={[
                    { title: 'Tên Banner', field: 'name' },
                    { title: 'Hình ảnh (PC)', field: '', render: item => <img src={item.img} alt={item.name} className="banner-img-pc" /> },
                    { title: 'Hình ảnh (Mobile)', field: '', render: item => <img src={item.img_mobile} alt={item.name} className="banner-img" /> },
                    { title: 'Link Banner', field: 'url' },
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
                                    setDialog(true)
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
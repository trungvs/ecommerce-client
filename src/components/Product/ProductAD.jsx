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
                toast.success("Xo?? s???n ph???m th??nh c??ng")
                handleClose()
                handleRender()
            } else {
                toast.error("X??a s???n ph???m th???t b???i")
            }
        })
        .catch(err => toast.error("X??a s???n ph???m th???t b???i"))
    }

    useEffect(() => {
        getProduct()
        .then(res => {
            if (res.data.code === 200) {
                setData(res.data.data)
                console.log(res.data.data)
            } else {
                toast.error("Kh??ng l???y ???????c danh s??ch th?? m???c")
            }
        })
        .catch(err => toast.error("Kh??ng l???y ???????c danh s??ch th?? m???c"))
    }, [render])

    return (
        <div className="productad-wrapper">
            
            <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                <TextField 
                    id="outlined-basic" 
                    label="T??m ki???m" 
                    variant="outlined" 
                    size="small" 
                    sx={{mr: 2}}
                />
                <Button variant="contained" sx={{mr: 2}} onClick={() => setOpen(true)}>Th??m S???n Ph???m</Button>
                <Button variant="contained" sx={{mr: 2}} onClick={() => setOpenGroup(true)}>Nh??m S???n ph???m</Button>          
            
            </Box>

            <Dialog open={confirmDialog} onClose={() => handleClose()}>
                <DialogTitle>X??c nh???n xo?? Danh m???c n??y?</DialogTitle>
                <DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Hu???</Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleDeleteCategory}
                        >
                        X??c nh???n
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
                            actions: 'Thao t??c'
                        }
                    }}
                    columns={[
                    { title: 'Danh m???c', field: '', align: "center", render: item => (
                        <div className="category-table">
                    <Link to={`/category/${item.category_url}`} target="_blank">{item.category_name}</Link><br />
                    <Link to={`/collection/${item.subcategory_url}`} target="_blank">{item.subcategory_name}</Link>
                        </div>
                    )},
                    { title: 'H??nh ???nh', field: '', align: "center", render: item => <img src={`${item.images.split(",")[0]}`} alt={item.name} className="category-img" /> },
                    { title: 'T??n S???n ph???m', field: 'name' },
                    { title: 'Link', field: 'url', render: item => (<Link to={`/product/${item.url}`} target="_blank">{item.url}</Link>)},
                    { title: 'Gi??', field: 'price', align: "center" },
                    { title: 'Gi?? Sale', field: 'price_sale', align: "center" },
                    { title: 'Hi???n tr??? tr??n trang ch???', field: '', align: "center", render: item => item.home_product === 1 ? <CheckCircleIcon /> : null},
                    { title: 'H??nh ?????ng', field: '', render: (rowData) => {
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
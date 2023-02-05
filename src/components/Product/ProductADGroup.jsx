import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import MaterialTable from "material-table";
import { ThemeProvider, createTheme, MenuItem } from '@mui/material';


import { getAllCategory } from '../CategoryAdmin/CategoryAdminServices'
import { searchProduct, createGroup, deleteGroup } from './ProductService'
import toast from 'react-hot-toast';
import { useCallback } from 'react';


export default function ProductADGroup({ open, handleClose }) {

    const defaultMaterialTheme = createTheme();
    const [data, setData] = useState([])
    const [category, setCategory] = useState('')
    const [subCategory, setSubCategory] = useState('')
    const [listCategory, setListCategory] = useState([])
    const [listGroup, setListGroup] = useState([])
    const [render, setRender] = useState(false)

    const handleChange = (e, field) => {
        if (field === "main_category") {
            setCategory(e.target.value)
            setSubCategory('')
        }
        if (field === "sub_category") {
            setSubCategory(e.target.value)
        }
    }

    const handleCreateGroup = (data) => {
        let listGroup = data.map(item => (item.id))
        if  (data.find(i => i.related_products)) {
            toast.error("Sản phẩm đã có nhóm. Tách nhóm trước khi tạo nhóm mới")
        } else if (data.filter(i => i.related_products === undefined).length >= 2) {
            toast.error("Chỉ được chọn 1 nhóm để gộp")
        } else {
            let newData = {
                listGroup,
                subCategory
            }
            createGroup(newData)
            .then(res => {
                if (res.data.code === 200) {
                    toast.success("Gộp Nhóm Thành Công")
                    setRender(!render)
                } else {
                    toast.error(res.data.message)
                }   
            })
            .catch(err => {
                toast.error("Không lấy được danh sách thư mục")
            })
        }
    }

    const handleDeleteGroup = (data) => {
        const listID = data.filter(item => item.related_products).map(i => i.id)
        let listRelated = data.filter(item => item.related_products).map(i => i.related_products)
        listRelated = [...new Set(listRelated)]
        console.log(listID, listRelated)
        deleteGroup({listID, listRelated})
        .then(res => {
            if (res.data.code === 200) {
                toast.success("Tách Nhóm Thành Công")
                setRender(!render)
            } else {
                toast.error(res.data.message)
            }   
        })
        .catch(err => {
            toast.error("Tách Nhóm Thất Bại")
        })
    }


    useEffect(() => {
        getAllCategory()
        .then(res => {
            if (res.data.code === 200) {
                setListCategory(res.data.data)
            } else {
                toast.error(res.data.message)
            }   
        })
        .catch(err => toast.error("Không lấy được danh sách thư mục"))
    }, [render])

    const handleSearch = async () => {
        await searchProduct({ category, subCategory })
        .then(res => {
            if (res.data.code === 200) {
                setData(res.data.data)
            } else {
                toast.error(res.data.message)
            }   
        })
        .catch(err => toast.error("Không lấy được danh sách sản phẩm"))
    }

    useEffect(() => {
        handleSearch()
    }, [render])

  return (
    <div>
      <Dialog open={open} onClose={() => handleClose()} disableScrollLock fullWidth maxWidth={"md"}>
        <DialogTitle sx={{display: "flex", justifyContent: "space-between"}}>
            Nhóm Sản Phẩm
          <Button onClick={() => handleClose()}><CloseIcon /></Button>
            </DialogTitle>
        <DialogContent>

        <Grid container spacing={2} columns={12} sx={{pt: 2}}>
            <Grid item xs={5}>
                <TextField
                select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Thư mục Chính"
                onChange={(e) => handleChange(e, "main_category")}
                size="small"
                fullWidth
                >
                { listCategory ? listCategory.filter(c => !c.main_category).map(item => {
                    return <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                }) : null}
                </TextField>
            </Grid>

            <Grid item xs={5}>
                <TextField
                select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subCategory}
                label="Thư mục Phụ"
                onChange={(e) => handleChange(e, "sub_category")}
                size="small"
                fullWidth
                >
                { listCategory ? listCategory.filter(c => c.main_category === category).map(item => {
                    return <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                }) : null}
                </TextField>
            </Grid>
            <Grid item xs={2}>
            <Button variant="contained" fullWidth onClick={handleSearch}>Tìm kiếm</Button>
            </Grid>
        </Grid>

        <Box sx={{ mt: 3}}>
                <ThemeProvider theme={defaultMaterialTheme}>
                    <MaterialTable
                    localization={{
                        header: {
                            actions: 'Thao tác'
                        }
                    }}
                    columns={[
                    { title: 'Hình ảnh', field: '', align: "center", render: item => item.images ? <img src={`${item.images.split(",")[0]}`} alt={item.name} className="category-img" /> : null },
                    { title: 'Tên Sản phẩm', field: 'name' },
                    { title: 'Giá', field: 'price', align: "center" },
                    { title: 'Giá Sale', field: 'price_sale', align: "center" },
                    ]}
                    data={data}
                    options={{
                        search: false,
                        showTitle: false,
                        // toolbar: false,
                        selection: true,
                        rowStyle: rowData => ({ backgroundColor: rowData.related_products === null ? "#fff" : "#CECECE"}),
                        selectionProps: rowData => ({
                            // disabled: rowData.related_products === undefined,
                            color: 'primary'
                          }),

                    }}
                    parentChildData={(row, rows) => rows.find(a => a.id === row.related_products)}
                    actions={[
                        {
                          tooltip: 'Gộp Sản Phẩm Thành Nhóm',
                          icon: () => <Button variant="outlined">Gộp Nhóm</Button>,
                          onClick: (evt, data) => handleCreateGroup(data)
                        },
                        {
                            tooltip: 'Tách Sản Phẩm Khỏi Nhóm',
                            icon: () => <Button variant="outlined">Tách Nhóm</Button>,
                            onClick: (evt, data) => handleDeleteGroup(data)
                        }
                    ]}
                    
                    />
                </ThemeProvider>
            </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
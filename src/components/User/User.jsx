import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import MaterialTable from "material-table";
import { ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import UserEditorDialog from "./UserEditorDialog";
import { getAllUser, deleteUser } from "./UserServices"
import { toast } from "react-hot-toast";

export default function User() {
    const defaultMaterialTheme = createTheme();

    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [valueEdit, setValueEdit] = useState({})
    const [render, setRender] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [dialog, setDialog] = useState(false)

    const handleClose = () => {
        setOpen(false)
        setRender(!render)
        setValueEdit({})
        setDialog(false)
    }

    const handleDelete = () => {
        deleteUser(deleteID)
        .then(res => {
            if (res.data.code === 200) {
                toast.success("Thao tác thành công")
                handleClose()
            } else {
                toast.error(res.data.message)
            }
        })
    }

    useEffect(() => {
        getAllUser()
        .then(res => {
            setData(res.data.data)
        })
    }, [render])


    return (
        <div style={{ width: "100%"}}>
            <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
                <TextField 
                    id="outlined-basic" 
                    label="Tìm kiếm" 
                    variant="outlined" 
                    size="small" 
                    sx={{mr: 2}}
                />
                <Button variant="contained" onClick={() => {
                    setOpen(true)
                }} sx={{ mr: 2 }}>Thêm Mới</Button>          
            </Box>

            {
                open && (
                    <UserEditorDialog
                        handleClose={handleClose}
                        userID={valueEdit}
                     />
                )
            }

            <Dialog open={dialog} onClose={() => setDialog(false)}>
                <DialogTitle>Xác nhận xoá Người dùng này?</DialogTitle>
                <DialogContent>
                    <DialogActions>
                    <Button variant="outlined" onClick={() => setDialog(false)}>Huỷ</Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleDelete}
                        >
                        Xác nhận
                    </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>   


            <Box sx={{ mt: 3, width: "100%"}}>
                <ThemeProvider theme={defaultMaterialTheme}>
                    <MaterialTable
                    localization={{
                        header: {
                            actions: 'Thao tác'
                        }
                    }}
                    columns={[
                    { title: 'STT', field: '', render: rowData => (
                        rowData?.tableData?.id + 1
                    ) },
                    { title: 'Tài khoản', field: 'username' },
                    { title: 'Họ và tên', field: 'fullname'},
                    { title: 'Ngày sinh', field: 'birthday', width: "60", render: rowData => (
                        rowData?.birthday === null
                        ? ""
                        : new Date(rowData.birthday).toLocaleDateString()
                    )},
                    { title: 'Email', field: 'email' },
                    { title: 'Số điện thoại', field: 'phone' },
                    { title: 'Địa chỉ', field: '', render: rowData => (
                        `${rowData?.detailAddress} - ${rowData?.ward} - ${rowData.district} - ${rowData.province}`
                    ) },
                    { title: 'Ngày tạo', field: 'created_at', render: rowData => (
                        new Date(rowData?.created_at).toLocaleDateString()
                    ) },
                    { title: 'Hành động', field: '', render: (rowData) => {
                        return (
                            <>
                                <IconButton onClick={() => {
                                    setValueEdit(rowData)
                                    setOpen(true)
                                }}>
                                    <EditIcon color="primary" />
                                </IconButton>
                                {
                                    rowData?.username !== "admin" && (
                                        <IconButton onClick={() => {
                                            setDeleteID(rowData.id)
                                            setDialog(true)
                                        }}>
                                        <DeleteIcon color="error" />
                                        </IconButton>
                                    )
                                }
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
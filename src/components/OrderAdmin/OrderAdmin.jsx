import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MaterialTable from "material-table";
import { ThemeProvider, createTheme, Icon } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';

import { getAllOrder } from "./OrderAdminServices";

import OrderAdminDetails from "./OrderAdminDetails";

export default function OrderAdmin() {

    const defaultMaterialTheme = createTheme();

    const [data, setData] = useState([])
    const [render, setRender]= useState(false)
    const [viewOrder, setViewOrder] = useState(2)
    const [value, setValue] = React.useState(null);
    const [status, setStatus] = useState(3)
    const initialDto = {
        list: viewOrder,
        orderID: null,
        phone: null,
        status: status
    }
    const [dto, setDto] = useState(initialDto)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedValue, setSelectedValue] = useState({})

    const listOptions = [
        {
            id: 1,
            name: "Toàn bộ đơn hàng"
        },
        {
            id: 2,
            name: "Đơn hàng hôm nay"
        },
        {
            id: 3,
            name: "Đơn hàng tuần này"
        },
        {
            id: 4,
            name: "Đơn hàng tháng này"
        }
    ]

    const orderType = [
        {
            id: 3,
            name: "Toàn bộ trạng thái"
        },
        {
            id: 0,
            name: "Chờ xác nhận"
        },
        {
            id: 1,
            name: "Đã xác nhận"
        },
        {
            id: 2,
            name: "Đã hủy"
        }
    ]

    useEffect(() => {
        getAllOrder(dto)
        .then(res => {
            if (res.data.code === 200) {
                setData(res.data.data)
            }
        })
    }, [render])
    return (
        <div className="orderAdmin-wrapper">
            <TextField
          id="outlined-select-currency"
          select
          label="Đơn hàng"
          fullWidth
          size="small"
          value={viewOrder}
          disableScrollLock
          sx={{ maxWidth: "250px", mr: 2, mb: 2}}
          onChange={e => {
            setViewOrder(e.target.value)
            setDto({
                ...dto, 
                list: e.target.value
            })
          }}
        >
            {
                listOptions.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                    {option.name}
                    </MenuItem>
                ))
            }
        </TextField>
        <TextField
          id="outlined-select-currency"
          select
          label="Trạng thái"
          fullWidth
          size="small"
          value={status}
          disableScrollLock
          sx={{ maxWidth: "250px", mr: 2, mb: 2}}
          onChange={e => {
            setStatus(e.target.value)
            setDto({
                ...dto,
                status: e.target.value
            })
          }}
        >
            {
                orderType.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                    {option.name}
                    </MenuItem>
                ))
            }
        </TextField>
        <TextField
          id="outlined-select-currency"
          label="Mã đơn hàng"
          fullWidth
          size="small"
          value={dto?.orderID || ""}
          disableScrollLock
          sx={{ maxWidth: "150px", mr: 2, mb: 2}}
          onChange={e => {
            setDto({
                ...dto, 
                orderID: e.target.value
            })
          }}
        >
            </TextField>
            <TextField
          id="outlined-select-currency"
          label="Số điện thoại"
          fullWidth
          size="small"
          value={dto?.phone || ""}
          disableScrollLock
          sx={{ maxWidth: "150px", mr: 2, mb: 2}}
          onChange={e => {
            setDto({
                ...dto, 
                phone: e.target.value
            })
          }}
        >
            </TextField>
            <Button 
                sx={{mr: 2, mb: 2}} 
                variant="contained"
                onClick={() => {
                    setRender(!render)
                }
            }> Tìm kiếm </Button>
            <Button 
                sx={{mr: 2, mb: 2}} 
                variant="outlined"
                onClick={() => {
                    setViewOrder(2)
                    setStatus(3)
                    setDto(initialDto)
                    setRender(!render)
                }
            }> Đặt lại </Button>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={new Date().toLocaleDateString()}
                    value={value}
                    onChange={(newValue) => {
                    setValue(newValue);
                    }}
                    format="dd/mm/yy"
                    renderInput={(params) => <TextField {...params} size="small" disabled/>}
                />
            </LocalizationProvider> */}

            {
                openDialog && (
                    <OrderAdminDetails
                    handleClose={() => {
                        setOpenDialog(false)
                        setRender(!render)
                    }}
                    selectedValue={selectedValue} 
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
                    { title: 'Mã đơn hàng', field: 'id'},
                    { title: 'Ngày đặt hàng', field: 'created_at', render: rowData => (new Date(rowData.created_at).toLocaleString())},
                    { title: 'Số sản phẩm', field: 'totalItem' },
                    { title: 'Số tiền', field: '', render: rowData => (rowData.totalPrice.toLocaleString("it-IT")) + "đ"},
                    { title: 'Phương thức thanh toán', field: '', render: rowData => {
                        if (rowData.payment === 1) {
                            return <span>MoMo</span>
                        }
                        if (rowData.payment === 2) {
                            return <span>COD</span>
                        }
                        if (rowData.payment === 3) {
                            return <span>ZaloPay</span>
                        }
                        if (rowData.payment === 4) {
                            return <span>ShopeePay</span>
                        }
                        if (rowData.payment === 5) {
                            return <span>ATM/Internet Banking</span>
                        }
                        if (rowData.payment === 6) {
                            return <span>VNPay QR</span>
                        }
                        if (rowData.payment === 7) {
                            return <span>9Pay</span>
                        }
                    }},
                    { title: 'Trạng thái thanh toán', field: 'status_payment', render: rowData => (rowData.status_payment === 0 ? "Chưa thanh toán" : "Đã thanh toán")},
                    { title: 'Trạng thái đơn hàng', field: 'status_order', render: (rowData) => {
                        if (rowData.status_order === 0) {
                            return <span style={{backgroundColor: "yellow", borderRadius: "5px", color: "#000"}}>Chờ xác nhận</span>
                        }
                        if (rowData.status_order === 1) {
                            return <span style={{backgroundColor: "green", borderRadius: "5px", color: "#fff"}}>Đã xác nhận</span>
                        }
                        if (rowData.status_order === 2) {
                            return <span style={{backgroundColor: "#800000", borderRadius: "5px", color: "#fff"}}>Đã hủy</span>
                        }
                    }},
                    { title: 'Hành động', field: '', render: rowData => {
                        return <>
                        <IconButton color="primary" onClick={() => {
                            setOpenDialog(true)
                            setSelectedValue(rowData)
                        }}>
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton color="error">
                            <EditIcon />
                        </IconButton>
                        </>
                    }},

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
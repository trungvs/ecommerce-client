import React, { useEffect, useState } from "react";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

import './OrderAdmin.scss'

import { default_size, default_colors } from "../Product/ProductVariant";
import { getInfoFromCart } from "../Cart/CartService";
import { getOrder } from "./OrderAdminServices";
import { updateOrderStatus } from "./OrderAdminServices";
import OrderAdminConfirmDialog from "./OrderAdminConfirmDialog";
import { toast } from "react-hot-toast";

export default function OrderAdminDetails({ handleClose, selectedValue }) {

    const [listItems, setListItems] = useState([])
    const [originalList, setOriginalList] = useState([])
    const [render, setRender] = useState(false)
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [issue, setIssue] = useState("")
    const [data, setData] = useState({})

    const handleUpdateStatus = (dto) => {
        updateOrderStatus(dto)
        .then(res => {
            if (res.data.code === 200) {
                toast.success(res.data.message)
                // handleClose()
                setRender(!render)
            } else {
                toast.error(res.data.message)
            }
        })
    }

    useEffect(() => {
            getOrder(selectedValue?.id)
            .then(res => {
                if (res.data.code === 200) {
                    setData(res.data.data)
                    setListItems(JSON.parse(res.data.data?.listItems))
                    const listItemsID = JSON.parse(res.data.data?.listItems).map(i => i.id)
                    getInfoFromCart({cartList: listItemsID})
                    .then(res => setOriginalList(res.data.data))
                }
            })
    }, [render])

    return (
        <div>
        <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={"lg"}
        scroll={"paper"}
      >
        <div className="orderAdminDetails-wrapper">
        <div style={{display: "flex",  justifyContent: "space-between"}}>
            <div style={{display: "flex",  alignItems: "center"}}>
                <DialogTitle id="alert-dialog-title">
                M?? ????n h??ng: {selectedValue?.id}
                </DialogTitle>
                <div>
                {
                        data?.status_order === 0
                        ? <span style={{backgroundColor: "yellow", borderRadius: "5px", padding: "2px 5px", color: "#000"}}>Ch??? x??c nh???n</span>
                        : data?.status_order === 1
                        ? <span style={{backgroundColor: "green", borderRadius: "5px", padding: "2px 5px", color: "#fff"}}>???? x??c nh???n</span>
                        : data?.status_order === 2
                        && <div>
                            <span style={{backgroundColor: "#800000", borderRadius: "5px", padding: "2px 5px", color: "#fff", marginRight: "10px"}}>???? h???y</span>
                            <span style={{ borderLeft: "1px solid #ccc", paddingLeft: "5px"}}>{data?.issue}</span>
                            </div>
                    }
                </div>
            </div>
            <div>
            <IconButton 
                color="primary" 
                onClick={() => {
                    handleClose()
                }}>
                    <ClearIcon />
            </IconButton>
            </div>
        </div>
        <DialogContent>

        <Box sx={{ width: '100%', paddingLeft: "20px" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={6} style={{ borderRight: "1px solid #ccc"}}>
          {/* <ul className="order-info">
            {
                selectedValue?.user_id !== null && (
                    <li className="order-info-item">
                    <span className="order-info-item-title">User ID:</span>
                    <span className="order-info-item-content">{selectedValue?.user_id}</span>
                </li>
                )
            }
            <li className="order-info-item">
                <span className="order-info-item-title">H??? v?? t??n:</span>
                <span className="order-info-item-content">{selectedValue?.fullname}</span>
            </li>
            <li className="order-info-item">
                <span className="order-info-item-title">S??? ??i???n tho???i:</span>
                <span className="order-info-item-content">{selectedValue?.phone}</span>
            </li>
            <li className="order-info-item">
                <span className="order-info-item-title">Email:</span>
                <span className="order-info-item-content">{selectedValue?.email}</span>
            </li>
            <li className="order-info-item">
                <span className="order-info-item-title">?????a ch???:</span>
                <span className="order-info-item-content">{selectedValue?.address}</span>
            </li>
            <li className="order-info-item">
                <span className="order-info-item-title">Ph????ng th???c thanh to??n:</span>
                <span className="order-info-item-content">{selectedValue?.payment}</span>
            </li>
            <li className="order-info-item">
                <span className="order-info-item-title">Tr???ng th??i thanh to??n:</span>
                <span className="order-info-item-content">{
                selectedValue?.status_payment === 0
                ? "Ch??a thanh to??n"
                : "???? thanh to??n"
                }</span>
            </li>
          </ul> */}
          <table className="order-info">
            {
                data?.user_id !== null && (
                    <tr className="order-info-item">
                        <td className="order-info-item-title">User ID:</td>
                        <td className="order-info-item-content">{data?.user_id}</td>
                    </tr>
                )
            }
            <tr className="order-info-item">
                <td className="order-info-item-title">H??? v?? t??n:</td>
                <td className="order-info-item-content">{data?.fullname}</td>
            </tr>
            <tr className="order-info-item">
                <td className="order-info-item-title">S??? ??i???n tho???i:</td>
                <td className="order-info-item-content">{data?.phone}</td>
            </tr>
            <tr className="order-info-item">
                <td className="order-info-item-title">?????a ch???:</td>
                <td className="order-info-item-content">{data?.address}</td>
            </tr>
            <tr className="order-info-item">
                <td className="order-info-item-title">Ph????ng th???c thanh to??n:</td>
                <td className="order-info-item-content">{
                data?.payment === 1
                ? "MoMo"
                : data?.payment === 2
                ? "COD"
                : data?.payment === 3
                ? "ZaloPay"
                : data?.payment === 4
                ? "ShopeePay"
                : data?.payment === 5
                ? "ATM/Internet Banking"
                : data?.payment === 6
                ? "VNPay QR"
                : data?.payment === 7
                && "9Pay"
                }</td>
            </tr>
            <tr className="order-info-item">
                <td className="order-info-item-title">Tr???ng th??i thanh to??n:</td>
                <td className="order-info-item-content">
                    {
                        data?.status_payment === 0
                        ? "Ch??a thanh to??n"
                        : "???? thanh to??n"
                    }
                </td>
            </tr>
            <tr className="order-info-item">
                <td className="order-info-item-title">Ng??y ?????t h??ng:</td>
                <td className="order-info-item-content">
                    {
                        new Date(data?.created_at).toLocaleString()
                    }
                </td>
            </tr>
            <tr className="order-info-item">
                <td className="order-info-item-title">Ghi ch??:</td>
                <td className="order-info-item-content">
                    {data?.note}
                </td>
            </tr>
            <tr className="order-info-item">
                <td className="order-info-item-title">S??? s???n ph???m:</td>
                <td className="order-info-item-content">
                    {data?.totalItem}
                </td>
            </tr>
            <tr className="order-info-item">
                <td className="order-info-item-title">T???ng s??? ti???n:</td>
                <td className="order-info-item-content">
                    {data?.totalPrice?.toLocaleString("it-IT") + "??"}
                </td>
            </tr>
          </table>
        </Grid>
        <Grid xs={6}>
          {
            listItems?.length !== 0 && listItems.map(item => {
                const originalItem = originalList.find(i => i.id === item.id)
                return (
                    <div className="order-item">
                        <img src={originalItem?.images.split(",")[0]} alt="" style={{ width: "20px"}} className="order-item-img"/>
                        <div className="order-item-info">
                            <p className="order-item-info-name">{originalItem?.name}</p> 
                            <span className="order-item-info-size">
                                {
                                    default_size.find(s => s.code === item?.size).size
                                }
                            </span>
                            <span className="order-item-info-quantity">
                                x{item?.quantity}
                            </span>
                            <span className="order-item-info-price">
                                {(item?.quantity * item?.price)?.toLocaleString("it-IT") + "??"}
                            </span>
                        </div>
                    </div>
                )
            })
          }

        </Grid>
      </Grid>
    </Box>
        </DialogContent>
    </div>

        <DialogActions>
            {
                data?.status_order !== 2 && (
                    <Button onClick={() => setOpenConfirmDialog(true)} variant="outlined" color="error">H???y ????n</Button>
                    )
            }
            {
                data?.status_order !== 2 && (
                    <Button onClick={() => toast.success("In h??a ????n th??nh c??ng")} variant="contained" color="secondary">In H??a ????n</Button>
                )
            }
          {
            data?.status_order === 0 && (
            <Button onClick={() => {
                handleUpdateStatus({
                    id: selectedValue?.id,
                    status: 1,

                })
            }} variant="contained">
                X??c nh???n
            </Button>
            )
          }
        </DialogActions>
      </Dialog>

      {
        openConfirmDialog && (
            <OrderAdminConfirmDialog
            handleClose={() => {
                setOpenConfirmDialog(false)
                setRender(!render)
            }}
            selectedValue={selectedValue}
             />
        )
      }

        </div>    
    )
}
import React, {useEffect, useState} from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { getOrder } from "./ProfileServices"
import { getInfoFromCart } from "../Cart/CartService";
import { default_size } from "../Product/ProductVariant";
import { updateOrderStatus } from "../OrderAdmin/OrderAdminServices"

import { toast } from "react-hot-toast";

export default function ProfileOrders() {

    const [listOrder, setListOrder] = useState([])
    const [listProduct, setListProduct] = useState([])
    const [render, setRender] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = useState({})

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    const handleCancelOrder = (dto) => {
        updateOrderStatus(dto)
        .then(res => {
            if (res.data.code === 200) {
                toast.success(res.data.message)
                handleClose()
                setRender(!render)
            } else {
                toast.error(res.data.message)
            }
        })
    }

    useEffect(() => {
        getOrder()
        .then(res => {
            if (res.data.code === 200) {
                setListOrder(res.data.data)
                let listProductID = []
                res.data.data.map(item => JSON.parse(item.listItems).map(i => {
                    return listProductID = [
                        ...listProductID,
                        i.id
                    ]
                }))
                getInfoFromCart({cartList: listProductID})
                .then(res => setListProduct(res.data.data))
            }
        })
    }, [render])

    return (
        <div className="order-wrapper">
            <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            B???n c?? ch???c ch???n mu???n hu??? ????n h??ng?
        </DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>Hu??? b???</Button>
          <Button variant="outlined" onClick={() => handleCancelOrder(value)} autoFocus>
            X??c nh???n
          </Button>
        </DialogActions>
      </Dialog>
            <h2 className="order-name">
                Danh s??ch ????n h??ng
            </h2>
            {
                listOrder.length === 0
                ? <div className="order-item">Ch??a c?? ????n h??ng n??o</div>
                : listOrder.map(item => {
                    return (
                        <div className="order-item">
                            <div className="order-item-header">
                                <div className="order-item-header--info">
                                    <span className="order-item-header-id">{"#" + item?.id}</span>
                                    <span>{item?.created_at && new Date(item?.created_at).toLocaleString()}</span>
                                </div>
                                <span className="order-item-header--status">
                                    {
                                        item?.status_order === 0
                                        ? "Ch??? x??c nh???n"
                                        : item?.status_order === 1
                                        ? "???? x??c nh???n"
                                        : item?.status_order === 2
                                        && <span style={{ color: "red"}}>???? hu???</span>
                                    }
                                </span>
                            </div>
                            <div className="order-item-content">
                                {
                                    item?.listItems && JSON.parse(item?.listItems).map(i => {
                                        const originalItem = listProduct.find(product => product.id === i.id)
                                        return (
                                            <div className="order-item-box">
                                                <div className="order-item-box-info">
                                                    <img src={originalItem?.images.split(",")[0]} alt={originalItem?.name} className="order-item-box-info-img"/>
                                                    <div>
                                                        <p className="order-item-box-info-name">{originalItem?.name}</p>
                                                        <span className="order-item-box-info-quantity">{"x" + i?.quantity}</span>
                                                        <span className="order-item-box-info-size">{
                                                            default_size.find(size => size.code === i.size).size
                                                        }</span>
                                                        <span className="order-item-box-info-price">{(i?.price * i?.quantity).toLocaleString("it-IT") + "??"}</span>
                                                    </div>
                                                </div>
                                            <div className="order-item-box-review">
                                                ????nh gi?? s???n ph???m
                                            </div>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="order-item-price">
                                {
                                    item?.status_order === 0
                                    ? <span onClick={() => {
                                        setOpen(true)
                                        setValue({
                                            id: item?.id,
                                            status: 2,
                                            issue: "Kh??ch h??ng t??? hu??? ????ng"
                                        })}
                                        }>Hu??? ????n</span>
                                    : <p></p>
                                }
                                <span>
                                  T???ng ????n h??ng: <span> {item?.totalPrice.toLocaleString("it-IT") + "??"} </span>
                                </span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
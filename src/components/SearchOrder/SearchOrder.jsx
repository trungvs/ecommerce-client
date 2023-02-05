import React from "react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, TextField } from "@mui/material";

import { getOrder } from "../OrderAdmin/OrderAdminServices";
import { getInfoFromCart } from "../Cart/CartService";

import { default_size, default_colors } from "../Product/ProductVariant";

import './SearchOrder.scss'
import { toast } from "react-hot-toast";
export default function SearchOrder() {

    const params = useParams()
    const history = useHistory()
    const [orderID, setOrderID] = useState(null)
    const [data, setData] = useState({})
    const [listItems, setListItems] = useState([])
    const [originalList, setOriginalList] = useState([])
    const [render, setRender] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (orderID?.length !== 0) {
            history.push(`/search-order/${orderID}`)
            setRender(!render)
        }
    }

    useEffect(() => {
        if (params.id !== undefined) {
            setOrderID(params.id)
            getOrder(params.id)
            .then(res => {
                if (res.data.code === 200 && res.data.data !== undefined) {
                    setData(res.data.data)
                    setListItems(JSON.parse(res.data.data?.listItems))
                    const listItemsID = JSON.parse(res.data.data?.listItems).map(i => i.id)
                    getInfoFromCart({cartList: listItemsID})
                    .then(res => setOriginalList(res.data.data))
                } else {
                    toast.error("Vui lòng kiểm tra mã đơn hàng")
                }
            })
        }
    }, [render])

    return (
        <div className="search-order-container">
            <h2 className="search-order-title">
                TRA CỨU ĐƠN HÀNG
            </h2>
            <form onSubmit={handleSubmit}>
                <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Mã đơn hàng"
                type="text"
                fullWidth
                variant="outlined"
                size="medium"
                value={orderID}
                error={orderID?.length === 0 ? true : false}
                helperText={orderID?.length === 0 ? "Trường này là bắt buộc" : ""}
                onChange={e => setOrderID(e.target.value)}
                sx={{ mb: 2}}
            />
                <Button 
                variant="contained" 
                type="submit" 
                fullWidth 
                size="large"
                >
                    Xác nhận
                </Button>
            </form>
            {
                data?.id && (
                    <>
                        <div className="search-order-detail">
                            {/* <div className="dashed-line"></div> */}
                            <div className="customer-info">
                                <h3>Trạng thái đơn hàng <span style={{color: "orange"}}>#{data?.id}</span> </h3>
                                {
                                    data?.status_order === 0
                                    ? <span style={{backgroundColor: "yellow", borderRadius: "5px", padding: "2px 5px", color: "#000", marginTop: "10px", display: "inline-block"}}>Chờ xác nhận</span>
                                    : data?.status_order === 1
                                    ? <span style={{backgroundColor: "green", borderRadius: "5px", padding: "2px 5px", color: "#fff", marginTop: "10px", display: "inline-block"}}>Đã xác nhận</span>
                                    : data?.status_order === 2
                                    && <div>
                                        <span style={{backgroundColor: "#800000", borderRadius: "5px", padding: "2px 5px", color: "#fff", marginRight: "10px", marginTop: "10px", display: "inline-block"}}>Đã hủy</span>
                                        <span style={{ borderLeft: "1px solid #ccc", paddingLeft: "5px"}}>{data?.issue}</span>
                                        </div>
                                }
                            </div>
                        </div>
                        <div className="search-order-detail">
                            {/* <div className="dashed-line"></div> */}
                            <div className="customer-info">
                                <h3>Thông tin khách hàng</h3>
                                <ul className="customer-info-order">
                                    <li className="customer-info-detail">
                                    <span>Họ tên:</span> {data?.fullname} 
                                    </li>
                                    <li className="customer-info-detail">
                                    <span>Điện thoại:</span> {data?.phone?.slice(0, -3) + "xxx"}
                                    </li>
                                    <li className="customer-info-detail">
                                    <span>Email:</span> {data?.email}
                                    </li>
                                    <li className="customer-info-detail">
                                    <span>Địa chỉ:</span> {data?.address?.split(",")[0]}
                                    </li>
                                    <li className="customer-info-detail">
                                    <span>Phường/xã:</span> {data?.address?.split(",")[1]}
                                    </li>
                                    <li className="customer-info-detail">
                                    <span>Quận/Huyện:</span> {data?.address?.split(",")[2]}
                                    </li>
                                    <li className="customer-info-detail">
                                    <span>Thành phố/Tỉnh:</span> {data?.address?.split(",")[3]}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="search-order-detail">
                            {/* <div className="dashed-line"></div> */}
                            <div className="customer-info">
                                <h3>Danh sách sản phẩm</h3>
                                <ul className="customer-info-product">
                                    {
                                        listItems?.length !== 0 && listItems.map(item => {
                                            const originalItem = originalList.find(i => i.id === item.id)
                                            return (
                                                <li className="info-product">
                                                <img src={originalItem?.images?.split(",")[0]} alt="" className="info-product-img" />
                                                <div>
                                                    <p className="info-product-name">
                                                        {originalItem?.name}
                                                    </p>
                                                    <p className="info-product-price">
                                                        <span>Giá:</span> {item?.price?.toLocaleString("it-IT") + "đ"}
                                                    </p>
                                                    <p className="info-product-size">
                                                        <span>Size:</span> {
                                                            default_size.find(s => s.code === item?.size).size
                                                        }
                                                    </p>
                                                    <p className="info-product-quantity">
                                                        <span>Số lượng:</span> {item?.quantity}
                                                    </p>
                                                    <p className="info-product-total">
                                                        <span>{(item?.price * item?.quantity)?.toLocaleString("it-IT") + "đ"}</span>
                                                    </p>
                                                </div>
                                            </li>
                                            )
                                        }) 
                                    }
                                </ul>
                                <div className="customer-info-totalPrice">
                                    Tổng: <span>{data?.totalPrice?.toLocaleString("it-IT") + "đ"}
                                        </span>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}
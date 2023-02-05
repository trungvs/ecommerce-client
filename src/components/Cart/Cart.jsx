import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link, useHistory } from "react-router-dom";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Autocomplete from '@mui/material/Autocomplete';

import './Cart.scss'

import { getInfoFromCart } from "./CartService";
import { toast } from "react-hot-toast";
import { default_colors, default_size } from "../Product/ProductVariant"

import { useDispatch, useSelector } from "react-redux";
import { updateQuantity } from "../Product/ProductSlice";

import Paper from '@mui/material/Paper';
import { useFormik } from "formik";
import * as Yup from "yup";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { addOrder } from "./CartService";
import { getInformation } from "../Profile/ProfileServices";


export default function Cart() {
    
    const dispatch = useDispatch();
    const cartQuantity = useSelector(state => state.cart.quantity)
    const isAuth = useSelector(state => state.auth.auth)
    const history = useHistory()
    const [userID, setUserID] = useState(null)
    const [listItem, setListItem] = useState([])
    const [originalList, setOriginalList] = useState([])
    const [render, setRender] = useState(false)
    const [data, setData] = useState({})
    const [payment, setPayment] = useState(2)
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [orderID, setOrderID] = useState("")
    let totalPrice = 0
    let totalPriceSale = 0
    let listItems = []

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        MenuListProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
      };

    const handleAddQuantity = (item) => {
        const newItem = {
            ...item,
            quantity: item.quantity++
        }
        const newListItem = listItem.map(i => i.key === item.key ? newItem : i)
        localStorage.setItem("cart", JSON.stringify(listItem.map(i => i.key === item.key ? { ...item, quantity: item.quantity++ } : i)))
        setRender(!render)
    }

    const handleDecreaseQuantity = async (item) => {
        if (item.quantity === 1) {
            const newListItem = await listItem.filter(i => i.key !== item.key)
            localStorage.setItem("cart", JSON.stringify(newListItem))
        } else {
            const newItem = {
                ...item,
                quantity: item.quantity--
            }
            const newListItem = await listItem.map(i => i.key === item.key ? newItem : i)
            localStorage.setItem("cart", JSON.stringify(listItem.map(i => i.key === item.key ? {...item, quantity: item.quantity-- } : i)))
        }
        setRender(!render)
    }

    const handleDeleteProduct = (key) => {
        const otherItem = listItem.filter(item => item.key !== key)
        localStorage.setItem("cart", JSON.stringify(otherItem))
        // setListItem(listItem.filter(item => item.key !== key))
        setRender(!render)
    }

    const phoneRegExp = /(84|0[3|5|7|8|9|6])+([0-9]{8})\b/

    const formik = useFormik({
        initialValues: data,
        validationSchema: Yup.object({
            fullname: Yup.string().nullable().required("Vui lòng nhập Họ và tên!"),
            phone: Yup.string()
                .nullable()
                .matches(phoneRegExp, "Số điện thoại không đúng định dạng")
                .required("Vui lòng nhập Số điện thoại!"),
            email: Yup.string()
                .nullable()
                .email("Email không đúng định dạng")
                .required("Vui lòng nhập Email!"),
            detailAddress: Yup.string().nullable().required("Vui lòng nhập Địa chỉ!"),
            province: Yup.string().nullable().required("Vui lòng chọn Tỉnh!"),
            district: Yup.string().nullable().required("Vui lòng chọn Huyện!"),
            ward: Yup.string().nullable().required("Vui lòng chọn Xã!"),
            note: Yup.string()

        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            let data = {
                ...values,
                user_id: userID,
                totalPrice: totalPrice,
                totalItem: cartQuantity,
                address: `${values.detailAddress}, ${values.ward}, ${values.district}, ${values.province}`,
                payment: payment,
                listItems: listItems.map(i => {
                    return {
                        id: i.id,
                        quantity: i.quantity,
                        size: i.size,
                        price: i.price
                    }
                })
            }
            addOrder(data)
            .then(res => {
                if (res.data.code === 200) {
                    toast.success(res.data.message)
                    setOrderID(res.data.data.code)
                    setOpenDialog(true)
                    formik.resetForm()
                    localStorage.removeItem("cart")
                    dispatch(updateQuantity())
                    setRender(!render)
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => toast.error("Có lỗi, xin vui lòng thử lại"))
        }
    })


    useEffect(() => {
        let cartList = JSON.parse(localStorage.getItem("cart")) || []
        setListItem(cartList)
        cartList = cartList.map(i => `${i.id}`)
        dispatch(updateQuantity());
    }, [render])

    useEffect(() => {
        let cartList = JSON.parse(localStorage.getItem("cart")) || []
        cartList = cartList.map(i => `${i.id}`)
        if (localStorage.getItem("access_token")) {
            getInformation()
            .then(res => {
                if (res.data.code === 200) {
                    setUserID(res.data.data.id)
                    formik.values.fullname = res.data.data.fullname
                    formik.values.phone = res.data.data.phone
                    formik.values.email = res.data.data.email
                    formik.values.detailAddress = res.data.data.detailAddress
                    formik.values.province = res.data.data.province
                    formik.values.district = res.data.data.district
                    formik.values.ward = res.data.data.ward

                    if (provinces?.length === 0) {
                        console.log(provinces)
                        axios.get("https://provinces.open-api.vn/api/?depth=1")
                        .then(res => {
                            setProvinces(res.data)
                            const selectedProvince = res.data.find(p => p.name === formik.values.province)?.code
                            if (selectedProvince !== undefined) {
                                axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                                .then(res => {
                                    setDistricts(res.data.districts)
                                    const selectedDistrict = res.data.districts.find(d => d.name === formik.values.district)?.code
                                    axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                                    .then(res => setWards(res.data.wards))
                                })
                            }
                        })
                    }
                }
            })
        }
        getInfoFromCart({cartList: cartList})
            .then(res => setOriginalList(res.data.data))
            .catch(err => toast.error("Có lỗi, vui lòng thử lại"))
        axios.get("https://provinces.open-api.vn/api/?depth=1")
            .then(res => {
                setProvinces(res.data)
                const selectedProvince = res.data.find(p => p.name === formik.values.province)?.code
                if (selectedProvince !== undefined) {
                    axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                    .then(res => {
                        setDistricts(res.data.districts)
                        const selectedDistrict = res.data.districts.find(d => d.name === formik.values.district)?.code
                        axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                        .then(res => setWards(res.data.wards))
                    })
                }
            })
    }, [])

    return (
        <div className="cart-wrapper">
            <Box sx={{ flexGrow: 1, paddingTop: "15px" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                        <h2>Giỏ hàng</h2>
                        {
                            listItem.length === 0
                            ? <b>Chưa có sản phẩm nào</b>
                            : listItem.map((item, index) => {
                                let originalItem = originalList.find(i => i.id === item.id)
                                if (originalItem?.price_sale === 0) {
                                    totalPrice += originalItem?.price * item?.quantity
                                    listItems.push({...item, price: originalItem?.price})
                                } else {
                                    totalPrice += originalItem?.price_sale * item?.quantity
                                    listItems.push({...item, price: originalItem?.price_sale})
                                }
                                return (
                                    <div className="cart-product" key={item.key}>
                                    <span className="cart-product-delete" onClick={() => handleDeleteProduct(item.key)}>✕</span>
                                    <img src={originalItem?.images.split(",")[0]} alt="" className="cart-product-img"/>
                                    <span className="cart-product-amount">{item?.quantity}</span>
                                    <div className="cart-product-info">
                                        <div className="cart-product-upper">
                                            <Link to={`/product/${originalItem?.url}`} className="cart-product-link">
                                                <h4 className="cart-product-name">
                                                {originalItem?.name}
                                                </h4>
                                            </Link>
                                            <p className="cart-product-variant">
                                            {
                                                default_colors.find(i => i.code === item?.color).name + " "
                                            }
                                             / 
                                            {
                                                " " + default_size.find(i => i.code === item?.size).size
                                            }
                                            </p>
                                        </div>
                                        <div className="cart-product-below">
                                            <div className="cart-product-select">
                                                <span onClick={() => handleDecreaseQuantity(item)}>-</span>
                                                <span>{item?.quantity}</span>
                                                <span onClick={() => handleAddQuantity(item)}>+</span>
                                            </div>
                                            <div className="cart-product-price">
                                                {
                                                    originalItem?.price_sale === 0 
                                                    ?  
                                                        <div className="cart-product-price-original" style={{ fontWeight: "500"}}>
                                                        {(originalItem?.price * item.quantity).toLocaleString('it-IT') + "đ"}
                                                        </div>
                                                    : <>
                                                    <div className="cart-product-price-sale" style={{ fontWeight: "500"}}>
                                                            {(originalItem?.price_sale * item.quantity).toLocaleString('it-IT') + "đ"}
                                                    </div>
                                                    <div className="cart-product-price-original" style={{ textDecoration: "line-through", opacity: "0.3"}}>
                                                        {(originalItem?.price * item.quantity).toLocaleString('it-IT') + "đ"}
                                                    </div>
                                                            </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )
                            })
                        }
                            <Divider />
                        {
                            listItem.length !== 0 && (
                                <div className="pricing-info">
                                    <div className="pricing-info-item">
                                        <span>Tạm tính</span>
                                        <span>{totalPrice.toLocaleString('it-IT') + "đ"}</span>
                                    </div>
                                    <div className="pricing-info-item">
                                        <span>Giảm giá</span>
                                        <span>0đ</span>
                                    </div>
                                    <div className="pricing-info-item">
                                        <span>Phí giao hàng</span>
                                        <span>{ totalPrice < 250000 ? "25.000đ" : "Miễn phí"}</span>
                                    </div>
                                    <Divider />
                                    <div className="pricing-info-item">
                                        <span>Tổng</span>
                                        <span className="pricing-info-item-total">
                                        { totalPrice < 250000 ?  (totalPrice + 25000).toLocaleString('it-IT') + "đ": totalPrice.toLocaleString('it-IT') + "đ"}
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <h2>Thông tin vận chuyển</h2>
                        <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ flexGrow: 1, mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} ld={6}>
                            <TextField
                            margin="dense"
                            id="fullname"
                            type="text"
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Họ và tên"
                            value={formik.values.fullname || ''}
                            onChange={formik.handleChange}
                            error={formik.errors.fullname && formik.touched.fullname}
                            helperText={formik.errors.fullname}
                        />
                            </Grid>
                            <Grid item xs={12} md={6} ld={6}>
                            <TextField
                            margin="dense"
                            id="phone"
                            type="text"
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Số điện thoại"
                            value={formik.values.phone || ''}
                            onChange={formik.handleChange}
                            error={formik.errors.phone && formik.touched.phone}
                            helperText={formik.errors.phone}
                        />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                            margin="dense"
                            id="email"
                            type="text"
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Email"
                            value={formik.values.email || ''}
                            onChange={formik.handleChange}
                            error={formik.errors.email && formik.touched.email}
                            helperText={formik.errors.email}
                        />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                            margin="dense"
                            id="detailAddress"
                            type="text"
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Địa chỉ"
                            value={formik.values.detailAddress || ''}
                            onChange={formik.handleChange}
                            error={formik.errors.detailAddress && formik.touched.detailAddress}
                            helperText={formik.errors.detailAddress}
                        />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <Autocomplete
                                    value={formik.values.province || ''}
                                    onChange={(event, newValue) => {
                                    formik.setFieldValue("province", newValue?.name ? newValue.name : "")
                                    formik.values.district = ""
                                    formik.values.ward = ""
                                    axios.get(`https://provinces.open-api.vn/api/p/${newValue?.code}?depth=2`)
                                    .then(res => {
                                        setDistricts(res.data.districts)
                                    })
                                    }}
                                    inputValue={formik.values.province}
                                    onInputChange={(event, newInputValue) => {
                                    // formik.setFieldValue("province", newInputValue)
                                    }}
                                    isOptionEqualToValue={(option, value) => option.name === value }
                                    getOptionLabel={(option) => option.name ? option.name : option}
                                    id="controllable-states-demo"
                                    options={provinces}
                                    size="small"
                                    renderInput={(params) => 
                                    <TextField 
                                    {...params} 
                                    label="Tỉnh" 
                                    fullWidth
                                    error={formik.errors.province && formik.touched.province}
                                    helperText={formik.errors.province} 
                                    />}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <Autocomplete
                                    value={formik.values.district || ''}
                                    onChange={(event, newValue) => {
                                    formik.setFieldValue("district", newValue?.name ? newValue.name : "")
                                    formik.values.ward = ""
                                    axios.get(`https://provinces.open-api.vn/api/d/${newValue?.code}?depth=2`)
                                    .then(res => {
                                        setWards(res.data.wards)
                                    })
                                    }}
                                    inputValue={formik.values.district}
                                    onInputChange={(event, newInputValue) => {
                                    // formik.setFieldValue("district", newInputValue)
                                    }}
                                    isOptionEqualToValue={(option, value) => option.name === value }
                                    getOptionLabel={(option) => option.name ? option.name : option}
                                    id="controllable-states-demo"
                                    options={districts}
                                    size="small"
                                    renderInput={(params) => 
                                    <TextField 
                                    {...params} 
                                    label="Huyện" 
                                    fullWidth
                                    error={formik.errors.district && formik.touched.district}
                                    helperText={formik.errors.district}
                                    />}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <Autocomplete
                                value={formik.values.ward || ''}
                                onChange={(event, newValue) => {
                                formik.setFieldValue("ward", newValue?.name ? newValue.name : "")
                                }}
                                inputValue={formik.values.ward}
                                onInputChange={(event, newInputValue) => {
                                // formik.setFieldValue("ward", newInputValue)
                                }}
                                isOptionEqualToValue={(option, value) => option.name === value }
                                getOptionLabel={(option) => option.name ? option.name : option}
                                id="controllable-states-demo"
                                options={wards}
                                size="small"
                                renderInput={(params) => 
                                <TextField 
                                {...params} 
                                label="Xã" 
                                fullWidth
                                error={formik.errors.ward && formik.touched.ward}
                                helperText={formik.errors.ward} />}
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                            margin="dense"
                            id="note"
                            type="text"
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Ghi chú"
                            value={formik.values.note || ''}
                            onChange={formik.handleChange}
                            // error={formik.errors.detailAddress && formik.touched.detailAddress}
                            // helperText={formik.errors.detailAddress}
                        />
                            </Grid>
                        </Grid>
                        </Box>
                        <Divider />
                        <h2>Hình thức thanh toán</h2>
                        <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={payment}
                            type="number"
                            onChange={(e) => setPayment(e.target.value)}
                        >
                            <FormControlLabel disabled value="1" control={<Radio />} label="Thanh Toán MoMo" />
                            <FormControlLabel value="2" control={<Radio />} label="COD - Thanh toán khi nhận hàng" />
                            <FormControlLabel disabled value="3" control={<Radio />} label="Ví điện tử ZaloPay" />
                            <FormControlLabel disabled value="4" control={<Radio />} label="Ví ShopeePay" />
                            <FormControlLabel disabled value="5" control={<Radio />} label="Thẻ ATM / Internet Banking / Thẻ tín dụng (Credit card) / Thẻ ghi nợ (Debit card) / VNPay QR" />
                            <FormControlLabel disabled value="6" control={<Radio />} label="VNPay QR" />
                            <FormControlLabel disabled value="7" control={<Radio />} label="Ví điện tử 9Pay" />
                        </RadioGroup>
                        </FormControl>
                        <div className="cart-confirm disabled" onClick={cartQuantity > 0 ? formik.handleSubmit : () => toast.error("Chưa có sản phẩm nào trong giỏ hàng")}>Thanh toán { totalPrice < 250000 ?  (totalPrice + 25000).toLocaleString('it-IT') + "đ": totalPrice.toLocaleString('it-IT') + "đ"}</div>
                        </form>
                    </Grid>
                </Grid>
            </Box>

            <Dialog
        open={openDialog}
        onClose={() => history.push("/")}
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle id="alert-dialog-title">
          Đặt hàng thành công
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Mã đơn hàng của bạn là: {<b style={{color: "var(--text-color-blue-light)", fontSize: "20px", cursor: "pointer"}} onClick={() => navigator.clipboard.writeText(orderID)}>{orderID}</b>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Button fullWidth variant="outlined" onClick={() => history.push(`/search-order/${orderID}`)}>Kiểm tra đơn hàng</Button>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Button fullWidth variant="outlined" onClick={() => history.push("/")} autoFocus>
            Trang chủ
          </Button>
        </Grid>
        </Grid>
        </DialogActions>
      </Dialog>
        </div>
    )
}

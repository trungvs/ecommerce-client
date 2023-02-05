import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ConstantList from "../../appConfig";
import { useParams, useRouteMatch, useHistory, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { setLoginSuccess } from "../Auth/authSlice"
import { updateQuantity } from '../Product/ProductSlice'
import { setAdmin } from "../Profile/profileSlice"
import AuthForm from '../Auth/Auth'

import './NavBar.scss'

export default function NavBar() {

    const {url} = useRouteMatch()
    const history = useHistory()

    const dispatch = useDispatch()
    const isAuth = useSelector((state) => state.auth.auth)
    const cartQuantity = useSelector(state => state.cart.quantity)
    
    const [open, setOpen] = useState(false)
    const [openForm, setOpenForm] = useState(false)
    const openMenu = (e) => {
        setOpen(!open)
    }

    const openSubMenu = (e) => {
        e.preventDefault()
        if (e.target.tagName === 'A') {
            const subMenu = e.target.nextElementSibling
            if (subMenu.style.display === 'block') {
                subMenu.style.display = 'none'
            } else {
                subMenu.style.display = 'block'
            }
        } else {
            const subMenu = e.target.parentElement.nextElementSibling
            if (subMenu.style.display === 'block') {
                subMenu.style.display = 'none'
            } else {
                subMenu.style.display = 'block'
            }
        }
    }

    
    useEffect(() => {
        let access_token = localStorage.getItem("access_token")
        if (access_token) {
            axios.post(ConstantList.API_ENDPOINT + '/users/checktoken', { 'access_token': access_token})
            .then(res => {
                if (res.data.code === 200) {
                    dispatch(setLoginSuccess(true))
                    if (res.data.role === "admin") {
                        dispatch(setAdmin(true))
                    } else {
                        dispatch(setAdmin(false))
                    }
                } else {
                    dispatch(setLoginSuccess(false))
                    localStorage.removeItem("access_token")
                    history.push("/")
                }
            })
            .catch(err => setLoginSuccess(false))
        } else {

        }
        dispatch(updateQuantity())
    }, [])

    return (
        <>
        <header className="header">
            <div className="header__menu-mobile">
                <i className="fa-solid fa-bars" onClick={() => openMenu()}></i>
                <div className="header__menu-toggle" style={{ display: open ? 'block' : 'none'}}>
                    <div className="header__menu-toggle-search">
                        <input type="text" placeholder="Tìm kiếm sản phẩm" />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <ul className="menu__toggle">
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link">
                                Tất cả sản phẩm
                            </a>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                Áo Nam
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Áo Nam
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Áo Tank top
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Áo T-shirt
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Áo Polo
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Áo Sơ Mi
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Áo Thể thao
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Áo In hình
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Áo Khoác
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="///" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                Quần Nam
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="//" className="menu__toggle-sub--link">
                                        Quần Nam
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="//" className="menu__toggle-sub--link">
                                        Quần Lót Nam
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="//" className="menu__toggle-sub--link">
                                        Quần Shorts
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Quần Jeans
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Quần Dài
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                Phụ kiện
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Mũ (Nón)
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Tất (Vớ)
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                Bộ Sưu Tập
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        BST Wakanda Forever
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Vũ trụ áo Marvel
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Clean Viet Nam
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Coolmate Basics
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Care & Share
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Sản phẩm bền vững
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                Nhu cầu
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Đồ thu - đông
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Mặc ở nhà & Mặc trong
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Đồ thể thao
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Phụ kiện
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                Công nghệ
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Excool
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Cleandye
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        HeiQ Viroblock
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Anti-Smell
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="header__logo">
                <Link to="/" className="header__logo-link">
                    <img src="https://www.coolmate.me/images/logo-coolmate.svg" alt="Logo Coolmate"/>
                </Link>
            </div>
            <div className="header__menu">
                <ul className="nav">
                    <li className="nav__item has-child">
                        <a href="/" className="nav__item-link">
                            Sản Phẩm
                        </a>
                        <div className="menu-mega">
                            <div className="menu-mega__container">
                                <h3 className="menu-mega__title">
                                    Nhu cầu
                                </h3>
                                <ul className="menu-mega__list">
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Đồ thu - đông
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Fall-Winter Collection
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Mặc nhà & Mặc trong
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Homewear & Underwear
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Mặc hàng ngày
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Casualwear
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Đồ thể thao
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Activewear
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Phụ kiện
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Accessories
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="menu-mega__container">
                                <h3 className="menu-mega__title">
                                    Danh mục
                                </h3>
                                <div className="grid grid-50">
                                    <div className="grid-column">
                                        <ul className="menu-mega__active">
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Áo Nam
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Áo Tank top
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Áo T-shirt
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Áo Polo
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Áo Sơ Mi
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Áo Thể Thao
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Áo In Hình
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Áo Khoác
                                                </a>
                                            </li>
                                        </ul>
                                        <ul className="menu-mega__active">
                                        <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Phụ kiện
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Mũ (Nón)
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Tất (Vớ)
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="grid-column">
                                        <ul className="menu-mega__active">
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Quần Nam
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Quần Shorts
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Quần Jeans
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Quần Dài
                                                </a>
                                            </li>
                                        </ul>
                                        <ul className="menu-mega__active">
                                        <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Quần Lót Nam
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Quần Brief (Tam giác)
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Quần Trunk (Boxer)
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Quần Brief Boxer (Boxer dài)
                                                </a>
                                            </li>
                                        </ul>
                                        <ul className="menu-mega__active">
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Tất cả sản phẩm
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Combo tiết kiệm
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="menu-mega__container">
                                <h3 className="menu-mega__title">
                                    Bộ Sưu Tập
                                </h3>
                                <ul className="menu-mega__list">
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                BST Wakanda Forever
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Chiến Binh Báo Đen đang đến
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Vũ trụ áo Marvel
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Bước vào thế giới siêu anh hùng
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Clean Vietnam
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Sự kết hợp giữa Coolmate & Vietmax
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Coolmate Basics
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Mua sắm tiết kiệm với giá tốt
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Care & Share
                                            </h3>
                                            <span className="menu-mega__list--description">
                                            10% doanh thu dành cho các bé
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Sản phẩm bền vững
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Sản phẩm thân thiện với môi trường
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="menu-mega__container">
                                <h3 className="menu-mega__title">
                                    Công nghệ
                                </h3>
                                <ul className="menu-mega__list">
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Excool
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Công nghệ làm mát tối đa
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Cleandye
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Nhuộm không dùng nước
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                HeiQ Viroblock
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Diệt 99.99% virus SARS-CoV2
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Anti-Smell
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Công nghệ khử mùi từ Nhật Bản
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li className="nav__item">
                        <a href="/" className="nav__item-link nav__item-link--blue">
                            84RISING*
                        </a>
                    </li>
                    <li className="nav__item">
                        <a href="/" className="nav__item-link">
                            Coolxprint
                        </a>
                    </li>
                    <li className="nav__item">
                        <a href="/" className="nav__item-link">
                            Chọn Size
                        </a>
                    </li>
                    <li className="nav__item">
                        <Link to="/search-order" className="nav__item-link">
                            Tra Cứu Đơn Hàng
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="header__action">
                <a href="/" className="header__action-item mobile-hidden">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </a>
                { isAuth 
                ? <Link to="/profile" className="header__action-item">
                    <i className="fa-solid fa-user"></i>
                </Link>
                : <Link href="#" className="header__action-item" onClick={(e) => {
                    e.preventDefault()
                    setOpenForm(true)
                }}>
                    <i className="fa-solid fa-user"></i>
                </Link>
                }
                
                <Link to="/cart" className="header__action-item">
                    <i className="fa-solid fa-cart-shopping header__action-item--cart"></i>
                    <span className="header__action-item--quantity">{cartQuantity}</span>
                </Link>
            </div>
            
        </header>
            { openForm && <AuthForm closeForm={() => setOpenForm(false)}/>}
        </>

    )
}
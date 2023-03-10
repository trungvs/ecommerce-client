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
                        <input type="text" placeholder="T??m ki???m s???n ph???m" />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <ul className="menu__toggle">
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link">
                                T???t c??? s???n ph???m
                            </a>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                ??o Nam
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ??o Nam
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ??o Tank top
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ??o T-shirt
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ??o Polo
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ??o S?? Mi
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ??o Th??? thao
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ??o In h??nh
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ??o Kho??c
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="///" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                Qu???n Nam
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="//" className="menu__toggle-sub--link">
                                        Qu???n Nam
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="//" className="menu__toggle-sub--link">
                                        Qu???n L??t Nam
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="//" className="menu__toggle-sub--link">
                                        Qu???n Shorts
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Qu???n Jeans
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Qu???n D??i
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                Ph??? ki???n
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        M?? (N??n)
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        T???t (V???)
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                B??? S??u T???p
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
                                        V?? tr??? ??o Marvel
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
                                        S???n ph???m b???n v???ng
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                Nhu c???u
                                <i className="fa-solid fa-chevron-right"></i>
                            </a>
                            <ul className="menu__toggle-sub">
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ????? thu - ????ng
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        M???c ??? nh?? & M???c trong
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        ????? th??? thao
                                    </a>
                                </li>
                                <li className="menu__toggle-sub--item">
                                    <a href="/" className="menu__toggle-sub--link">
                                        Ph??? ki???n
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="menu__toggle-item">
                            <a href="/" className="menu__toggle-link" onClick={(e) => openSubMenu(e)}>
                                C??ng ngh???
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
                            S???n Ph???m
                        </a>
                        <div className="menu-mega">
                            <div className="menu-mega__container">
                                <h3 className="menu-mega__title">
                                    Nhu c???u
                                </h3>
                                <ul className="menu-mega__list">
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                ????? thu - ????ng
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Fall-Winter Collection
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                M???c nh?? & M???c trong
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Homewear & Underwear
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                M???c h??ng ng??y
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Casualwear
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                ????? th??? thao
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Activewear
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Ph??? ki???n
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
                                    Danh m???c
                                </h3>
                                <div className="grid grid-50">
                                    <div className="grid-column">
                                        <ul className="menu-mega__active">
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    ??o Nam
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    ??o Tank top
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    ??o T-shirt
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    ??o Polo
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    ??o S?? Mi
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    ??o Th??? Thao
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    ??o In H??nh
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    ??o Kho??c
                                                </a>
                                            </li>
                                        </ul>
                                        <ul className="menu-mega__active">
                                        <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Ph??? ki???n
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    M?? (N??n)
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    T???t (V???)
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="grid-column">
                                        <ul className="menu-mega__active">
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Qu???n Nam
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Qu???n Shorts
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Qu???n Jeans
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Qu???n D??i
                                                </a>
                                            </li>
                                        </ul>
                                        <ul className="menu-mega__active">
                                        <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Qu???n L??t Nam
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Qu???n Brief (Tam gi??c)
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Qu???n Trunk (Boxer)
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link">
                                                    Qu???n Brief Boxer (Boxer d??i)
                                                </a>
                                            </li>
                                        </ul>
                                        <ul className="menu-mega__active">
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    T???t c??? s???n ph???m
                                                </a>
                                            </li>
                                            <li className="menu-mega__active--item">
                                                <a href="" className="menu-mega__active--link menu-mega__active--link-main">
                                                    Combo ti???t ki???m
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="menu-mega__container">
                                <h3 className="menu-mega__title">
                                    B??? S??u T???p
                                </h3>
                                <ul className="menu-mega__list">
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                BST Wakanda Forever
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Chi???n Binh B??o ??en ??ang ?????n
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                V?? tr??? ??o Marvel
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                B?????c v??o th??? gi???i si??u anh h??ng
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Clean Vietnam
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                S??? k???t h???p gi???a Coolmate & Vietmax
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Coolmate Basics
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Mua s???m ti???t ki???m v???i gi?? t???t
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Care & Share
                                            </h3>
                                            <span className="menu-mega__list--description">
                                            10% doanh thu d??nh cho c??c b??
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                S???n ph???m b???n v???ng
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                S???n ph???m th??n thi???n v???i m??i tr?????ng
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="menu-mega__container">
                                <h3 className="menu-mega__title">
                                    C??ng ngh???
                                </h3>
                                <ul className="menu-mega__list">
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Excool
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                C??ng ngh??? l??m m??t t???i ??a
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Cleandye
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Nhu???m kh??ng d??ng n?????c
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                HeiQ Viroblock
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                Di???t 99.99% virus SARS-CoV2
                                            </span>
                                        </a>
                                    </li>
                                    <li className="menu-mega__list--item">
                                        <a href="/" className="menu-mage__list--link">
                                            <h3 className="menu-mega__list--title">
                                                Anti-Smell
                                            </h3>
                                            <span className="menu-mega__list--description">
                                                C??ng ngh??? kh??? m??i t??? Nh???t B???n
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
                            Ch???n Size
                        </a>
                    </li>
                    <li className="nav__item">
                        <Link to="/search-order" className="nav__item-link">
                            Tra C???u ????n H??ng
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
import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom"

import NavBar from "../NavBar/NavBar";
import Home from "../Home/Home";
import Category from "../Category/Category"
import SubCategory from "../SubCategory/SubCategory"
import Product from "../Product/Product"
import Auth from "../Auth/Auth";
import Profile from "../Profile/Profile";
import Cart from "../Cart/Cart";
import SearchOrder from "../SearchOrder/SearchOrder";
import Footer from "../Footer/Footer";

import './HomePage.module.scss'

export default function HomePage() {

    const link = useRouteMatch()
    const currentLink = window.location.href

    useEffect(() => {
    }, [])

    return (
        <>
            {/* <Router> */}
            {  !link.path.toString().includes("admincp") && <NavBar />}
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/category">
                        <Category />
                    </Route>
                    <Route exact path={`/category/:url`}>
                        <Category />
                    </Route>
                    <Route exact path="/collection">
                        <SubCategory />
                    </Route>
                    <Route exact path={`/collection/:url`}>
                        <SubCategory />
                    </Route>
                    <Route exact path="/product">
                        <Product />
                    </Route>
                    <Route exact path={`/product/:url`}>
                        <Product />
                    </Route>
                    <Route exact path="/auth">
                        <Auth />
                    </Route>
                    <Route exact path="/profile">
                        <Profile />
                    </Route>
                    <Route exact path="/profile/:url">
                        <Profile />
                    </Route>
                    <Route exact path="/cart">
                        <Cart />
                    </Route>
                    <Route exact path="/search-order">
                        <SearchOrder />
                    </Route>
                    <Route exact path="/search-order/:id">
                        <SearchOrder />
                    </Route>
                </Switch>
            {/* </Router> */}
            {  !currentLink.toString().includes("admincp") && <Footer />}
        </>
    )
}
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import ConstantList from "../../appConfig";
import Banner from "../Banner/Banner";
import CategoryHome from "../Category/CategoryHome";
import ProductHome from "../Product/ProductHome";


export default function Home() {
    const [data, setData] = useState({})

    useEffect(() => {
        axios.get(`${ConstantList.API_ENDPOINT}/home`)
        .then(res => {
            setData(res.data.data)
        })
        .catch(err => {
            // console.log(err)
        })
    }, [])


    return (
        <>
            <Banner banners={data.banner}/>
            <ProductHome products={data.product} />
            <CategoryHome categories={data.category}/>
        </>
    )
}
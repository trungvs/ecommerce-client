import React, { useEffect, useState } from "react";
import {
    useParams,
    useHistory,
    Link
} from "react-router-dom"

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import axios from "axios";
import ConstantList from "../../appConfig";

import './Category.scss'

export default function Category() {

    const history = useHistory()
    const param = useParams()
    const [data, setData] = useState([])
    const [dataFilter, setDataFilter] = useState([])
    const [category, setCategory] = useState({})
    const [subCategory, setSubCategory] = useState([])
    const [valueFilter, setValueFilter] = useState(0)
    const [render, setRender] = useState(false)

    const handleChange = (e) => {
        const url = `/collection/` + e.target.value
        history.push(url)
        console.log(url)
    }

    const listFilter = [
        {
            id: 0,
            name: "Toàn bộ sản phẩm"
        },
        {
            id: 1,
            name: "Giá thấp đến cao"
        },
        {
            id: 2,
            name: "Giá cao đến thấp"
        },
        {
            id: 3,
            name: "% Giảm nhiều"
        }
    ]

    const handleFilter = (e) => {
        const value = e.target.value
        setValueFilter(value)

        if (value === 0) {
            setDataFilter(data)
        }
        if (value === 1) {
            const newListProduct = data.map(item => {
                if (item.price_sale === 0) {
                    return {
                        ...item,
                        price_filter: item.price
                    }
                } else {
                    return {
                        ...item,
                        price_filter: item.price_sale
                    }
                }
            }).sort((a,b) => a.price_filter - b.price_filter)
            setDataFilter(newListProduct)
        }

        if (value === 2) {
            const newListProduct = data.map(item => {
                if (item.price_sale === 0) {
                    return {
                        ...item,
                        price_filter: item.price
                    }
                } else {
                    return {
                        ...item,
                        price_filter: item.price_sale
                    }
                }
            }).sort((a,b) => b.price_filter - a.price_filter)
            setDataFilter(newListProduct)
        }

        if (value === 3) {
            const saleProduct = data.filter(p => p.price_sale !== 0).sort((a,b) => a.price_sale - b.price)
            const otherProduct = data.filter(p => p.price_sale === 0).sort((a,b) => a.price - b.price)
            setDataFilter([
                ...saleProduct,
                ...otherProduct
            ])
            console.log(dataFilter)
            setRender(!render)
        }
    }

    useEffect(() => {
        const url = ConstantList.API_ENDPOINT + '/category/search'
        axios.post(url, { category: param.url})
        .then(res => {
            window.scrollTo(0, 0)
            setData(res.data.data.products)
            setDataFilter(res.data.data.products)
            setSubCategory(res.data.data.subcategory)
            setCategory(res.data.data.category[0])
        })
    }, [])

    return (
        <div className="category-wrapper">
            <div className="category-variant">
                <div className="category-variant-wrapper mobile-hidden">
                <h3>{category?.name}</h3>
                <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                    <InputLabel id="demo-select-small">Danh Mục</InputLabel>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        // value={category}
                        label="Danh Mục"
                        onChange={e => handleChange(e)}
                    >
                        {
                            subCategory && subCategory.map(item => (
                                <MenuItem value={item.url} key={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                    <InputLabel id="list-filter">Bộ Lọc</InputLabel>
                    <Select
                        id="list-filter"
                        value={valueFilter}
                        label="Bộ Lọc"
                        onChange={e => handleFilter(e)}
                        disableScrollLock
                    >
                        {
                            listFilter.map(item => (
                                <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                </div>
            </div>

            <Box sx={{ width: '100%', paddingBottom: 10, mt: 5, display: "flex", justifyContent: "center"}}>
                <Grid container 
                    rowSpacing={1} 
                    columnSpacing={{ xs: 1, sm: 3, md: 5 }} 
                    columns={{ xs: 12, lg: 15, md: 12, sm: 12 }}
                    sx={{ maxWidth: 1800 }}
                    >
                    {
                        dataFilter?.length !== 0 
                        ? dataFilter.map(product => (
                            <Grid item xs={6} lg={3} md={3} sm={4} key={product.id}>
                                <div className="product-container">
                                <Link to={`/product/${product.url}`} className="product-link">
                                    <img src={product.images.split(",")[0]} alt={product.name} className="product-img" />
                                    <img src={product.images.split(",")[1]} alt={product.name} className="product-img-hover" />
                                </Link>
                                <div className="product-info">
                                    <Link to={`/product/${product.url}`}>
                                        <p className="product-name">{product.name}</p>
                                    </Link>
                                    {
                                        product.price_sale > 0
                                        ? <p className="product-price">
                                            {product.price_sale.toLocaleString() + 'đ'}
                                            <span>{product.price.toLocaleString() + 'đ'}</span>
                                            {
                                                '-' + Math.ceil(100 - (product.price_sale/product.price)*100) + '%'
                                            }
                                        </p>
                                        : <p className="product-price">
                                            {product.price.toLocaleString() + 'đ'}
                                        </p>
                                    }
                                    
                                </div>
                                { product.price_sale > 0 && (
                                    <span className="product-status">Sale</span>
                                )}
                                </div>
                            </Grid>
                        ))
                        : <>
                        <Grid item xs={6} lg={3} md={3} sm={4}>
                            <Stack spacing={1}>
                                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="rectangular" height={60} />
                                <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} lg={3} md={3} sm={4}>
                            <Stack spacing={1}>
                                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="rectangular" height={60} />
                                <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} lg={3} md={3} sm={4}>
                            <Stack spacing={1}>
                                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="rectangular" height={60} />
                                <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} lg={3} md={3} sm={4}>
                            <Stack spacing={1}>
                                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="rectangular" height={60} />
                                <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} lg={3} md={3} sm={4}>
                            <Stack spacing={1}>
                                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="rectangular" height={60} />
                                <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        </>
                    }
                </Grid>
            </Box>
        </div>
    )
}
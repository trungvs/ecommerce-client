import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


import './Product.scss'

export default function ProductHome({ products }) {


    return (
        <div className="product-home-wrapper">
            <div className="pc-display">
                {/* <Swiper
                    slidesPerView={5}
                    spaceBetween={30}
                    slidesPerGroup={5}
                    loop={true}
                    loopFillGroupWithBlank={true}
                    // pagination={}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                    breakpoints={{
                        300: {
                            width: 300,
                            slidesPerView: 1
                        },
                        640: {
                            width: 640,
                            slidesPerView: 2
                        },
                        900: {
                            width: 900,
                            slidesPerView: 3
                        },
                        1100: {
                            width: 1100,
                            slidesPerView: 4
                        },
                        1300: {
                            width: 1300,
                            maxWidth: 1300,
                            slidesPerView: 5
                        }
                    }}
                    
                >

                    {
                        products && products.map(product => (
                            <SwiperSlide key={product.id}>
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
                                            {product.price_sale.toLocaleString('it-IT') + 'đ'}
                                            <span>{product.price.toLocaleString('it-IT') + 'đ'}</span>
                                            {
                                                '-' + Math.ceil(100 - (product.price_sale/product.price)*100) + '%'
                                            }
                                        </p>
                                        : <p className="product-price">
                                            {product.price.toLocaleString('it-IT') + 'đ'}
                                        </p>
                                    }
                                    
                                </div>
                                { product.price_sale > 0 && (
                                    <span className="product-status">Sale</span>
                                )}
                            </div>
                        </SwiperSlide>
                        ))
                    }
                </Swiper> */}
                <Grid container spacing={1.5} columns={{xs: 12, md: 12, lg: 12}}>
                    {
                        products
                        ? products.map(product => (
                            <Grid item xs={6} sm={4} md={3} lg={2}>
                            <div className="product-container">
                                <Link to={`/product/${product.url}`} className="product-link">
                                    <img src={product.images.split(",")[0]} alt={product.name} className="product-img" />
                                    <img src={product.images.split(",")[1]} alt={product.name} className="product-img-hover" />
                                    { product.price_sale > 0 && (
                                    <span className="product-status">Sale</span>
                                )}
                                </Link>
                                <div className="product-info">
                                    <Link to={`/product/${product.url}`}>
                                        <p className="product-name">{product.name}</p>
                                    </Link>
                                    {
                                        product.price_sale > 0
                                        ? <p className="product-price">
                                            {product.price_sale.toLocaleString('it-IT') + 'đ'}
                                            <span>{product.price.toLocaleString('it-IT') + 'đ'}</span>
                                            {
                                                '-' + Math.ceil(100 - (product.price_sale/product.price)*100) + '%'
                                            }
                                        </p>
                                        : <p className="product-price">
                                            {product.price.toLocaleString('it-IT') + 'đ'}
                                        </p>
                                    }
                                    
                                </div>

                                </div>
                            </Grid>
                        ))
                        : <>
                        <Grid item xs={6} sm={4} md={3} lg={2}>
                            <Stack spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="rectangular" height={60} />
                            <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3} lg={2}>
                            <Stack spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="rectangular" height={60} />
                            <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3} lg={2}>
                            <Stack spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="rectangular" height={60} />
                            <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3} lg={2}>
                            <Stack spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="rectangular" height={60} />
                            <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3} lg={2}>
                            <Stack spacing={1}>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="rectangular" height={60} />
                            <Skeleton variant="rounded" height={60} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4} md={3} lg={2}>
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
            </div>
            </div>
    )
}
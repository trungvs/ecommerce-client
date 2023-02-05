import React, { useEffect, useState } from "react";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { openLoading, closeLoading, selectLoading } from "../Loading/loadingSlice";
import Loading from "../Loading/Loading";

// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";

import './Banner.scss'

import ConstantList from "../../appConfig";
import { instance } from "../Auth/AuthAxiosCommon";

export default function Banner({ banners }) {

    return (
        <div className="banner-wrapper">

            {/* PC and Tablet */}
            <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper mobile-hidden"
      >
        {
            banners && banners.length !== 0 ? banners.filter(banner => banner.img !== null).map(banner => {
                return (
                    <SwiperSlide key={banner.id}>
                    <a href={banner.url}>
                        <img src={banner.img} alt={banner.name} />
                    </a>
                    </SwiperSlide>
                )
            }) : null
        }
            </Swiper>

            {/* Mobile */}
            <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper mobile-visible"
      >
        {
            banners && banners.length !== 0 ? banners.filter(banner => banner.img_mobile !== null).map(banner => {
                return (
                    <SwiperSlide key={banner.id}>
                    <a href={banner.url}>
                        <img src={banner.img_mobile} alt={banner.name} />
                    </a>
                    </SwiperSlide>
                )
            }) : null
        }
            </Swiper>
        </div>
    )
}
import React, { useEffect, useState } from "react";

import { useParams, useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import { getDetailProduct } from "./ProductService";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity } from "./ProductSlice";

import "./Product.scss";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";

import { default_size, default_colors } from "./ProductVariant";
import { toast } from "react-hot-toast";

export default function Product() {
  const dispatch = useDispatch();
  const history = useHistory();
  const param = useParams();
  const [render, setRender] = useState(false);
  const [data, setData] = useState({});
  const [listColor, setListColor] = useState([]);
  const [color, setColor] = useState(null);
  const [listSize, setListSize] = useState([]);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState("");
  const [price, setPrice] = useState(null)
  const cartQuantity = useSelector((state) => state.cart.quantity);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const handleChangeColor = (data) => {
    setSize(null);
    setQuantity(1);
    history.push(`/product/${data.url}`);
    setRender(!render);
  };

  const handleAddToCart = () => {
    const item = {
      id: data.id,
      color: color,
      size: size,
      quantity: quantity,
      price: price,
      key: Date.now()
    };
    var otherItem = localStorage.getItem("cart");
    if (otherItem === null) {
      otherItem = [item];
      localStorage.setItem("cart", JSON.stringify(otherItem));
    } else {
      otherItem = JSON.parse(otherItem);
      var existItemId = otherItem.filter((i) => i.id === item.id);
      if (existItemId !== []) {
        if (existItemId.find((i) => i.size === item.size)) {
          let otherItemList = otherItem.filter((i) => i.id !== item.id);
          let noExistSize = existItemId.filter((i) => i.size !== item.size);
          let existItemIdChange = existItemId.find((i) => i.size === item.size);
          existItemIdChange = {
            ...existItemIdChange,
            quantity: existItemIdChange.quantity + item.quantity,
          };

          localStorage.setItem(
            "cart",
            JSON.stringify([
              ...otherItemList,
              ...noExistSize,
              existItemIdChange,
            ])
          );
        } else {
          localStorage.setItem("cart", JSON.stringify([...otherItem, item]));
        }
      } else {
        localStorage.setItem("cart", JSON.stringify([...otherItem, item]));
      }
    }

    dispatch(updateQuantity());
  };

  useEffect(() => {
    getDetailProduct(param.url).then((res) => {
      if (res.data.code === 200) {
        window.scrollTo(0, 0)
        setData(res.data.data);
        setListColor(res.data.data.related_products_list);
        setColor(res.data.data.color);
        setImages(res.data.data.images);
        if (res.data.data.price_sale === 0) {
          setPrice(res.data.data.price)
        } else {
          setPrice(res.data.data.price_sale)
        }
        if (res.data.data.variants[0].size === 7) {
          setListSize(null);
          setSize(7);
        } else {
          setListSize(res.data.data.variants);
        }
        setThumbsSwiper(null)
      }
    });
  }, [render]);

  return (
    <div className="product-wrapper">
      <div className="product-container">
        <Grid container spacing={2} columns={12}>
          <Grid item xs={12} sm={12} md={7} lg={7} xl={7} className="product-images" style={{ height: "100%"}}>
            <Swiper
              style={{
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
              }}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2"
            >
              {images &&
                images.split(",").map((item, index) => (
                  <SwiperSlide key={index}>
                    <img src={item} alt="" />
                  </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={6}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
              {images &&
                images.split(",").map((item, index) => (
                  <SwiperSlide key={index}>
                    <img src={item} alt="" />
                  </SwiperSlide>
                ))}
            </Swiper>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5} className="product-detail" style={{ height: "100%"}}>
            <h1 className="product-name">
              {data?.name || <Box sx={{ width: 300 }}>
                <Skeleton />
                <Skeleton animation="wave" />
              </Box>}
            </h1>
            <div className="product-price">
              { data?.price 
              ?
               data?.price_sale === 0 ? (
                <span className="product-price-sale">
                  {data?.price?.toLocaleString('it-IT')}??
                </span>
              ) : (
                <>
                  <span className="product-price-sale">
                    {data?.price_sale?.toLocaleString('it-IT') + "??"}
                  </span>
                  <span className="product-price-original">
                    {data?.price?.toLocaleString('it-IT') + "??"}
                  </span>
                  <span className="product-price-percent">
                    {"-" +
                      Math.ceil(100 - (data?.price_sale / data?.price) * 100) +
                      "%"}
                  </span>
                </>
              )
              : <Box sx={{ width: 300 }}>
              <Skeleton />
              <Skeleton animation="wave" />
            </Box>
            }
            </div>
            <div className="product-color">
              <div className="product-color-selected">
                M??u s???c:{" "}
                <span>
                  {color && default_colors.find((c) => c.code === color).name}
                </span>
              </div>
              <div className="product-color-selection">
                {listColor &&
                  listColor
                    .sort((a, b) => a.color - b.color)
                    .map((item) => (
                      <span
                        key={item.color}
                        style={{
                          backgroundImage: `url(${
                            default_colors.find((i) => i.code === item.color)
                              .img
                          })`,
                        }}
                        className={color === item.color ? "active" : ""}
                        onClick={() => handleChangeColor(item)}
                      ></span>
                    ))}
              </div>
            </div>
            <div className="product-size">
              <div className="product-size-title">
                <span>
                  {listSize && (
                    <>
                      K??ch th?????c:{" "}
                      <b>
                        {size && default_size.find((s) => s.code === size).size}
                      </b>
                    </>
                  )}
                </span>
                <a href="/">H?????ng d???n ch???n size</a>
              </div>
              <div className="product-size-selection">
                {listSize &&
                  listSize
                    .sort((a, b) => a.size - b.size)
                    .map((item) => (
                      <span
                        className={
                          item.quantity === 0
                            ? "disabled"
                            : size === item.size
                            ? "active"
                            : ""
                        }
                        key={item.size}
                        onClick={() => {
                          if (item.quantity !== 0) {
                            setSize(item.size);
                          }
                        }}
                      >
                        {default_size.find((s) => s.code === item.size).size}
                      </span>
                    ))}
              </div>
            </div>
            <div className="product-actions">
              <div className="product-actions-quantity">
                <span
                  onClick={() => {
                    if (quantity <= 1) {
                      setQuantity(1);
                    } else {
                      setQuantity(quantity - 1);
                    }
                  }}
                >
                  -
                </span>
                <span>{quantity}</span>
                <span onClick={() => setQuantity(quantity + 1)}>+</span>
              </div>
              <div
                className="product-actions-order"
                onClick={() => {
                  if (size !== null) {
                    handleAddToCart();
                    toast.success("Th??m v??o gi??? h??ng th??nh c??ng!");
                  }
                }}
              >
                {size === null ? (
                  <span>Ch???n k??ch th?????c</span>
                ) : (
                  <span>Th??m v??o gi??? h??ng</span>
                )}
              </div>
            </div>
            <div className="product-policy">
              <div className="product-policy-item">
                <img
                  src="https://www.coolmate.me/images/icons/icon3.svg"
                  alt=""
                />
                <p>?????i tr??? c???c d??? ch??? c???n s??? ??i???n tho???i</p>
              </div>
              <div className="product-policy-item">
                <img
                  src="https://www.coolmate.me/images/icons/icon4.svg"
                  alt=""
                />
                <p>Mi???n ph?? v???n chuy???n cho ????n h??ng tr??n 200k</p>
              </div>
              <div className="product-policy-item">
                <img
                  src="https://www.coolmate.me/images/icons/icon5.svg"
                  alt=""
                />
                <p>60 ng??y ?????i tr??? v?? b???t k??? l?? do g??</p>
              </div>
              <div className="product-policy-item">
                <img
                  src="https://www.coolmate.me/images/icons/icon2.svg"
                  alt=""
                />
                <p>Hotline 1900.27.27.37 h??? tr??? t??? 8h30 - 22h m???i ng??y</p>
              </div>
              <div className="product-policy-item">
                <img
                  src="https://www.coolmate.me/images/icons/icon1.svg"
                  alt=""
                />
                <p>?????n t???n n??i nh???n h??ng tr???, ho??n ti???n trong 24h</p>
              </div>
              <div className="product-policy-item">
                <img
                  src="https://www.coolmate.me/images/icons/icon6.svg"
                  alt=""
                />
                <p>Giao h??ng nhanh to??n qu???c</p>
              </div>
            </div>
            <div className="product-components">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h4>?????c ??i???m n???i b???t</h4>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{data?.description}</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

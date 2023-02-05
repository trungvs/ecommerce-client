import React from "react";
import Box from '@mui/material/Box';


import "./Footer.scss"

export default function Footer() {

    return (
        // <Box>
        <div className="footer">
        <div class="content">
            <div class="top">
                <div class="logo-details">
                <i class="fab fa-slack"></i>
                <span class="logo_name">COOLMATE</span>
                </div>
                <div class="media-icons">
                <a href="#"><i class="fab fa-facebook-f"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-linkedin-in"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
            <div class="link-boxes">
                <ul class="box">
                <li class="link_name">Khám phá COOLMATE</li>
                <li><a href="#">Áo Polo</a></li>
                <li><a href="#">Áo T-Shirt</a></li>
                <li><a href="#">Áo Sơ mi</a></li>
                <li><a href="#">Quần</a></li>
                </ul>
                <ul class="box">
                <li class="link_name">Dịch vụ</li>
                <li><a href="#">Hỏi đáp - FAQs</a></li>
                <li><a href="#">Chính sách đổi trả</a></li>
                <li><a href="#">Liên hệ</a></li>
                <li><a href="#">Thành viên CoolClub</a></li>
                </ul>
                <ul class="box">
                <li class="link_name">Về COOLMATE</li>
                <li><a href="#">Câu chuyện về Coolmate</a></li>
                <li><a href="#">Nhà máy</a></li>
                <li><a href="#">CoolClub</a></li>
                <li><a href="#">Care & Share</a></li>
                </ul>
                <ul class="box">
                <li class="link_name">Tài liệu - Tuyển dụng</li>
                <li><a href="#">Tuyển dụng</a></li>
                <li><a href="#">Đăng ký bản quyền</a></li>
                <li><a href="#">Hướng dẫn chọn size</a></li>
                <li><a href="#">Blog</a></li>
                </ul>
                <ul class="box input-box">
                <li class="link_name">Subscribe</li>
                <li><input type="text" placeholder="Enter your email" /></li>
                <li><input type="button" value="Subscribe" /></li>
                </ul>
            </div>
         </div>
        <div class="bottom-details">
        <div class="bottom_text">
            <span class="copyright_text">Copyright © 2023 <a href="#">COOLMATE.</a>All rights reserved</span>
            <span class="policy_terms">
            <a href="#">Privacy policy</a>
            <a href="#">Terms & condition</a>
            </span>
        </div>
        </div>
        </div>

        // </Box>
    )
}
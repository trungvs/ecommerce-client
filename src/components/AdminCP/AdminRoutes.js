import Dashboard from "../Dashboard/Dashboard"
import CategoryAdmin from "../CategoryAdmin/CategoryAdmin";
import UploadImg from "../UploadImg/UploadImg";
import BannerAD from "../Banner/BannerAD";
import ProductAD from "../Product/ProductAD"
import OrderAdmin from "../OrderAdmin/OrderAdmin";
import User from "../User/User";

import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ImageIcon from '@mui/icons-material/Image';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AdminRoutes = [
    {
        path: "/admincp",
        name: "Trang chủ",
        component: Dashboard,
        icon: DashboardIcon
    },
    {
        path: "/admincp/banner",
        name: "Quản lý Banner",
        component: BannerAD,
        icon: ViewCarouselIcon
    },
    {
        path: "/admincp/category",
        name: "Quản lý Danh Mục",
        component: CategoryAdmin,
        icon: CategoryIcon
    },
    {
        path: "/admincp/product",
        name: "Quản lý Sản Phẩm",
        component: ProductAD,
        icon: CheckroomIcon
    },
    {
        path: "/admincp/order",
        name: "Quản lý Đơn hàng",
        component: OrderAdmin,
        icon: LocalMallIcon
    },
    {
        path: "/admincp/uploadimg",
        name: "Quản lý Hình ảnh",
        component: UploadImg,
        icon: ImageIcon
    },
    {
        path: "/admincp/user",
        name: "Quản lý Người dùng",
        component: User,
        icon: AccountCircleIcon
    }

]

export default AdminRoutes
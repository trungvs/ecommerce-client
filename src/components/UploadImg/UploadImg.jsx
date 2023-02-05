import React, {useState, useEffect} from "react";
import { DropzoneArea } from "material-ui-dropzone";
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { uploadImg, deleteImg } from "./UploadImgServices";
import { toast } from "react-hot-toast";
import { ListItem, Typography } from "@mui/material";

export default function UploadImg() {

    const headers = {
        Authorization: "Client-ID 202f3fcce8eeb5a",
        // ContentType: 'multipart/form-data'
    }

    const [render, setRender] = useState(false)
    const [loading, setLoading] = useState(false)
    const [listImg, setListImg] = useState([])
    const [listFiles, setListFiles] = useState([])
    const [file, setFile] = useState('')

    const handleUpload = () => {
        if (listFiles.length === 0) {
            toast.error("Chưa có file nào được chọn")
        } else {
            const data = new FormData()
            data.append('image', listFiles[0])
    
            uploadImg(listFiles[0])
            .then(res => {
                if (res.data.status === 200) {
                    toast.success("Tải ảnh lên thành công")
                    setRender(!render)
                    setListFiles([])
                    console.log(listFiles)
                }
            })
            .catch(err => toast.error("Đã có lỗi xảy ra"))
        }
    }

    const handleDeleteImg = (id) => {
        deleteImg(id)
        .then(res => {
            if (res.data.status === 200) {
                toast.success("Xoá ảnh thành công")
                setRender(!render)
                setListFiles([])
                console.log(listFiles)
            }
        })
        .catch(err => toast.error("Đã có lỗi xảy ra"))
    }

    useEffect(() => {
        axios({
            method: 'get',
            url: "https://api.imgur.com/3/album/UcaliT5",
            headers: headers
        })
        .then(res => {
            setListImg(res.data.data.images.slice(0, 9))
        })
    }, [render])

    return (

        <Box>
            <DropzoneArea
                acceptedFiles={['image/*']}
                dropzoneText={"Drag and drop an image here or click"}
                onChange={(files) => {
                    console.log('Files:', files)
                    setListFiles(files)
                }}
                filesLimit={1}
                clearOnUnmount={true}
            />
            <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={handleUpload}
                sx={{mt: 2, mr: 2}}
            >
                UPLOAD
            </LoadingButton>
            <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={() => setRender(!render)}
                sx={{mt: 2}}
            >
                Cập nhật
            </LoadingButton>
            <Typography sx={{paddingTop: 3}}>
                Mất khoảng một vài phút để dữ liệu hình ảnh được cập nhật
            </Typography>
            <ImageList variant="masonry" sx={{ mt: 3 }} cols={5} gap={8} rowHeight={164}>
                {listImg && listImg.map((item) => (
                    <ImageListItem key={item.id}>
                    <img
                        src={`${item.link}?w=164&h=164&fit=crop&auto=format`}
                        srcSet={`${item.link}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.id}
                        loading="lazy"
                    />
                    <ImageListItemBar
                        actionIcon={
                        <IconButton
                            onClick={() => handleDeleteImg(item.id)}
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            aria-label={`info about ${item.id}`}
                        >
                            <DeleteIcon />
                        </IconButton>
                        }
                    />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>

    )
}
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { ListItem, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { ThemeProvider, createTheme } from '@mui/material';

import { DropzoneArea } from "material-ui-dropzone";
import { toast } from "react-hot-toast";
import { uploadImg, deleteImg } from "./UploadImgServices";
import axios from "axios";


export function UploadImgDialog({ openDialog, handleClose, handleSave, listDefault, singleSelect }) {
    const [open, setOpen] = React.useState(false);
    const [listFiles, setListFiles] = useState([])
    const [render, setRender] = useState(false)
    const [loading, setLoading] = useState(false)
    const [listImg, setListImg] = useState([])
    const [file, setFile] = useState('')
    const [selectedList, setSelectedList] = useState([])
    const defaultMaterialTheme = createTheme();

    const headers = {
        Authorization: "Client-ID 202f3fcce8eeb5a",
        // ContentType: 'multipart/form-data'
    }

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

    const handleSelect = (data) => {
        if (singleSelect) {
            setSelectedList(data.link)
        } else {
            if (selectedList.includes(data.link)) {
                const otherSelectedList = selectedList.filter(i => i !== data.link)
                setSelectedList(otherSelectedList)
            } else {
                setSelectedList([...selectedList, data.link])
            }
        }
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
        if (listDefault === "" || listDefault === undefined) {

        } else {
            setSelectedList(listDefault.split(","))
        }
    }, [render])


    return (
        <div>
                <Dialog open={true} disableScrollLock onClose={() => handleClose()} maxWidth={"md"} fullWidth>
            <DialogTitle>Chọn hình ảnh</DialogTitle>
            <DialogContent>
            <DialogContentText>
            <ThemeProvider theme={defaultMaterialTheme}>
            <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText={"Drag and drop an image here or click"}
                    onChange={(files) => {
                        console.log('Files:', files)
                        setListFiles(files)
                    }}
                    // filesLimit={1}
                    clearOnUnmount={true}
                    showAlerts={false}
                />
            </ThemeProvider>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<AutorenewIcon />}
                    variant="outlined"
                    onClick={() => setRender(!render)}
                    sx={{mt: 2}}
                >
                    Cập nhật
                </LoadingButton>
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
                </div>
                <Typography sx={{paddingTop: 3}}>
                    Mất khoảng một phút để hình ảnh được cập nhật sau khi xoá hoặc thêm mới
                </Typography>
                <ImageList variant="masonry" sx={{ mt: 3 }} cols={5} gap={8} rowHeight={164}>
                    {listImg && listImg.map((item) => (
                        <ImageListItem key={item.id} style={ selectedList.includes(item.link) ? {cursor: "pointer", border: "3px solid red"} : {cursor: "pointer"}} onClick={() => handleSelect(item)}>
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
            </DialogContentText>
            </DialogContent>
            <DialogActions sx={{margin: 2}}>
            <Button variant="outlined" onClick={handleClose}>Huỷ</Button>
            <Button variant="contained" onClick={() => handleSave(selectedList)}>Lưu</Button>
            </DialogActions>
                </Dialog>
        </div>
    )
}
import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { toast } from "react-hot-toast";

import { updateOrderStatus } from "./OrderAdminServices";

export default function OrderAdminConfirmDialog({ handleClose, selectedValue }) {

    const [issue, setIssue] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (issue?.length !== 0) {
            updateOrderStatus({
                id: selectedValue?.id,
                status: 2,
                issue: issue
            })
            .then(res => {
                if (res.data.code === 200) {
                    toast.success(res.data.message)
                    handleClose()
                } else {
                    toast.error(res.data.message)
                }
            })
        }
    }

    return (
        <div>
      <Dialog open={true} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hãy chắc chắn rằng bạn đã liên lạc với khách hàng trước khi hủy đơn hàng. Lý do hủy đơn hàng là bắt buộc.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Lý do hủy đơn"
            type="text"
            fullWidth
            variant="filled"
            value={issue}
            error={issue?.length === 0 ? true : false}
            helperText={issue?.length === 0 ? "Trường này là bắt buộc" : ""}
            onChange={e => setIssue(e.target.value)}
            // required
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>Đóng</Button>
          <Button variant="contained" type="submit">Xác nhận</Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
    )
}
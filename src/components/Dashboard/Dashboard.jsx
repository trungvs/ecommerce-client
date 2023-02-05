import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import "./DashBoard.scss"

import ReactECharts from 'echarts-for-react';

import { getDashBoardData } from './DashBoardServices'


export default function Dashboard() {

  const [data, setData] = useState({})

  const getFirstDayOfWeek = (today) => {
    const date = new Date(today)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(date.setDate(diff))
  }

  const curr = new Date();
  const firstday = getFirstDayOfWeek(curr).toLocaleDateString()
  let lastday = new Date(getFirstDayOfWeek(curr))
  lastday = new Date(lastday.setDate(lastday.getDate() + 6)).toLocaleDateString()
  const past7Days = [...Array(7).keys()].map(index => {
    const date = new Date();
    date.setDate(date.getDate() - index);
  
    return date.toLocaleDateString();
  });

  const orders = {
    title: {
      text: `ĐƠN HÀNG 7 NGÀY QUA (${past7Days[6]}-${past7Days[0]})`
    },
    toolbox: {
        feature: {
          // saveAsImage: {},
        }
    },
    tooltip: {},
    legend: {
      data:['2']
    },
    xAxis: {
      data: data !== {} ? Object.keys(data?.ordersDetail || {}) : []
    },
    yAxis: {},
    series: [
      {
      name: 'Đơn hàng',
      type: 'line',
      data: data !== {} ? Object.values(data?.ordersDetail || {}) : []
    }
  ]
  };

  const revenue = {
    title: {
      text: `DOANH THU 7 NGÀY QUA (${past7Days[6]}-${past7Days[0]})`
    },
    toolbox: {
        feature: {
          // saveAsImage: {},
        }
    },
    tooltip: {},
    legend: {
      data:['đ']
    },
    xAxis: {
      data: data !== {} ? Object.keys(data?.revenueDetail || {}) : []
    },
    yAxis: {},
    series: [
      {
      name: 'Doanh thu',
      type: 'line',
      data: data !== {} ? Object.values(data?.revenueDetail || {})?.map(i => i === null ? 0 : i) : []
    }
  ]
  };

  useEffect(() => {
    getDashBoardData({
      day: new Date().toLocaleDateString(),
      week: {
        firstday: firstday,
        lastday: lastday
      }
    })
    .then((res) => {
      if (res.data.code === 200) {
        setData(res.data.data)
      }
    })
  }, [])

  return (
      <div className="dashboard-wrapper">
          <div className="dashboard-statics">
          <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
              <Grid item md={3} lg={3} sm={6} xs={12}>
                <div className="dashboard-statics-item-1">
                  <span className="dashboard-statics-title">ĐƠN HÀNG HÔM NAY</span>
                  <p style={{padding: "5px 0"}}>{ new Date().toLocaleDateString()}</p>
                  <span className="dashboard-statics-content"><span style={{fontSize: "30px", paddingRight: "10px"}}>{data?.ordersReport?.ordersDay}</span>Đơn hàng</span>
                </div>
              </Grid>
              <Grid item md={3} lg={3} sm={6} xs={12}>
                <div className="dashboard-statics-item-2">
                  <span className="dashboard-statics-title">ĐƠN HÀNG TUẦN NÀY</span>
                  <p style={{padding: "0px 0"}}>{ `${firstday} - ${lastday}`}</p>
                  <span className="dashboard-statics-content"><span style={{fontSize: "30px", paddingRight: "10px"}}>{data?.ordersReport?.ordersWeek}</span>Đơn hàng</span>
                </div>
              </Grid>
              <Grid item md={3} lg={3} sm={6} xs={12}>
                <div className="dashboard-statics-item-3">
                  <span className="dashboard-statics-title">DOANH THU HÔM NAY</span>
                  <p style={{padding: "5px 0"}}>{ new Date().toLocaleDateString()}</p>
                  <span className="dashboard-statics-content"><span style={{fontSize: "30px", paddingRight: "10px"}}>{ Number(data?.ordersReport?.revenueDay || 0).toLocaleString("it-IT")+ "đ"}</span></span>
                </div>
              </Grid>
              <Grid item md={3} lg={3} sm={6} xs={12}>
                <div className="dashboard-statics-item-4">
                  <span className="dashboard-statics-title">DOANH THU TUẦN NÀY</span>
                  <p style={{padding: "5px 0"}}>{ `${firstday} - ${lastday}`}</p>
                  <span className="dashboard-statics-content"><span style={{fontSize: "30px", paddingRight: "10px"}}>{ Number(data?.ordersReport?.revenueWeek || 0).toLocaleString("it-IT")+ "đ"}</span></span>
                </div>
              </Grid>
            </Grid>
          </Box>
          </div>

          <div>
          <Box sx={{ width: '100%', marginTop: 3 }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={12} md={6}>
            <ReactECharts
            option={orders}
            style={{ height: 400, width: "100%" }}
            opts={{ locale: 'VI' }}
          />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
            <ReactECharts
            option={revenue}
            style={{ height: 400, width: "100%" }}
            opts={{ locale: 'VI' }}
          />
            </Grid>
          </Grid>
        </Box>
          
          </div>
      </div>
  )
}
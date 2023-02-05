import React from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import {Link} from "react-router-dom"

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function CategoryHome({ categories }) {


    return (
        <div className="categoryHome-wrapper">
            <Box sx={{ width: '100%' }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {
                        categories && categories.map(category => (
                            <Grid item xs={6} sm={6} md={3} key={category.id} className="category-item">
                                <Link to={`/category/${category.url}`} className="category-link">
                                    <img src={category.image} className="category-img"></img>
                                    <p className="category-name">{category.name}</p>
                                </Link>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </div>
    )
}
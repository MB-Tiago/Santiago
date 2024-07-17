import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './ShoppingList.css';

const items = [
  { url: "http://192.168.10.12/YACAPIN", img: "Order.png", caption: "Watch and Earn" },
  { url: "http://192.168.10.14", img: "Order.png", caption: "Order 14" },
  { url: "http://192.168.10.15", img: "Order.png", caption: "Order 15" },
  { url: "http://192.168.10.16", img: "Order.png", caption: "Order 16" },
  { url: "http://192.168.10.17", img: "Order.png", caption: "Order 17" },
  { url: "http://192.168.10.18", img: "Order.png", caption: "Order 18" },
  { url: "http://192.168.10.19", img: "Order.png", caption: "Order 19" },
  { url: "http://192.168.10.20", img: "Order.png", caption: "Order 20" },
  { url: "http://192.168.10.21", img: "Order.png", caption: "Order 21" },
  { url: "http://192.168.10.22", img: "Order.png", caption: "Order 22" },
  { url: "http://192.168.10.23", img: "Order.png", caption: "Order 23" },
  { url: "http://192.168.10.24", img: "Order.png", caption: "Order 24" },
  { url: "http://192.168.10.25", img: "Order.png", caption: "Order 25" },
  { url: "http://192.168.10.26", img: "Order.png", caption: "Order 26" },
  { url: "http://192.168.10.27", img: "Order.png", caption: "Order 27" },
  { url: "http://192.168.10.28", img: "Order.png", caption: "Order 28" },
  { url: "http://192.168.10.29", img: "Order.png", caption: "Order 29" },
  { url: "http://192.168.10.30", img: "Order.png", caption: "Order 30" },
  { url: "http://192.168.10.31", img: "Order.png", caption: "Order 31" },
  { url: "http://192.168.10.32", img: "Order.png", caption: "Order 32" },
  { url: "http://192.168.10.33", img: "Order.png", caption: "Order 33" },
  { url: "http://192.168.10.34", img: "Order.png", caption: "Order 34" },
  { url: "http://192.168.10.35", img: "Order.png", caption: "Order 35" },
  { url: "http://192.168.10.36", img: "Order.png", caption: "Order 36" },
  { url: "http://192.168.10.37", img: "Order.png", caption: "Order 37" },
  { url: "http://192.168.10.38", img: "Order.png", caption: "Order 38" },
  { url: "http://192.168.10.39", img: "Order.png", caption: "Order 39" },
  { url: "http://192.168.10.40", img: "Order.png", caption: "Order 40" },
];

function ShoppingList() {
  return (
    <div className="container">
      <h2>Shopping List</h2>
<Grid container spacing={2} className="grid-container">
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card className="card">
            <CardActionArea component={Link} to={item.url} className="card-action-area">
              <CardMedia
                component="img"
                alt={item.caption}
                className="card-media"
                image={item.img}
              />
              <CardContent className="card-content">
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.caption}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>

    </div>
    
  );
}

export default ShoppingList;

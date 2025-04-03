import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const AdminDashboard = () => {
  return (
    // Grid container tạo layout chia thành nhiều cột, với khoảng cách giữa các phần tử là 3
    <Grid container spacing={3} sx={{ marginTop: 8 }}>
      {/* Card 1 - Hiển thị thông tin Sự kiện 1 */}
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Sự kiện 1</Typography>
            <Typography variant="body2">Thông tin sự kiện 1</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 2 - Hiển thị chương trình khuyến mãi */}
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Chương trình khuyến mãi</Typography>
            <Typography variant="body2">Chi tiết chương trình</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 3 - Lặp lại một chương trình khuyến mãi */}
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Chương trình khuyến mãi</Typography>
            <Typography variant="body2">Chi tiết chương trình</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 4 - Lặp lại một chương trình khuyến mãi */}
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Chương trình khuyến mãi</Typography>
            <Typography variant="body2">Chi tiết chương trình</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 5 - Lặp lại một chương trình khuyến mãi */}
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Chương trình khuyến mãi</Typography>
            <Typography variant="body2">Chi tiết chương trình</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 6 - Hiển thị thông tin Sự kiện 2 */}
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h5">Sự kiện 2</Typography>
            <Typography variant="body2">Chi tiết chương trình</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;

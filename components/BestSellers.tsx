import { Container, Grid } from '@mui/material';
import Product from './Product';
import imageCake from '../public/assets/imgs/Home/card1.jpg';

function BestSellers() {
  const testArray = [1, 2, 3, 4, 5, 6];
  return (
    <Container className="py-4">
      <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, md: 12 }}>
        {testArray.map((item) => (
          <Grid key={item} item xs={4}>
            <Product
              image={imageCake.src}
              name="Pastelito"
              description="Delicioso pastel de tres leches"
              price="$250.00"
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default BestSellers;

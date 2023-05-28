import {
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { getAllProducts } from '../../services/products';
import { Product } from '../../interfaces/Product';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import Toolbar from '../../components/Toolbar';

export default function Products() {
  const [products, setProducts] = useState<Product[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const onSetProducts = async () => {
    const productsResponse = await getAllProducts();
    if (productsResponse.error) {
      setLoading(false);
      return undefined;
    } else {
      setLoading(false);
      setProducts(productsResponse.data.reverse());
    }
  };
  useEffect(() => {
    onSetProducts();
  }, []);
  return (
    <>
      <Toolbar />
      <Container className="py-4">
        {loading === false ? (
          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
            columns={{ xs: 4, md: 12 }}
          >
            {products !== undefined && products !== null
              ? products.map((product) => (
                  <Grid key={product._id} item xs={4}>
                    <ProductCard
                      _id={product._id}
                      image={product.picture[0]}
                      name={product.name}
                      description={product.description}
                      price={product.price}
                    />
                  </Grid>
                ))
              : null}
          </Grid>
        ) : (
          <Stack justifyContent="center" alignItems="center">
            <CircularProgress />
            <Typography>Cargando productos</Typography>
          </Stack>
        )}
      </Container>
    </>
  );
}

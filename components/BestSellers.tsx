import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { getAllProducts } from '../services/products';
import { Product } from '../interfaces/Product';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';

function BestSellers() {
  const [products, setProducts] = useState<Product[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const onSetProducts = async () => {
    const productsResponse = await getAllProducts();
    if (productsResponse.error) {
      setLoading(false);
      return undefined;
    } else {
      const reversedProducts = [...productsResponse.data].reverse();
      const mainProducts: Product[] = [];
      for (let i = 0; i < 6; i++) {
        mainProducts.push(reversedProducts[i]);
      }
      setProducts(mainProducts);
      setLoading(false);
    }
  };
  useEffect(() => {
    onSetProducts();
  }, []);
  return (
    <Container className="py-4">
      {loading === false ? (
        <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, md: 12 }}>
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
      <Stack>
        <Link href="/products">
          <Button
            variant="contained"
            className="bg-beseto-dark-gray text-white grow mt-20 flex flex-col justify-center items-center"
          >
            Ver todos los pasteles
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}

export default BestSellers;

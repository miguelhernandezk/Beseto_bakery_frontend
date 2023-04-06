import { Container, Grid, Typography } from '@mui/material';
import { getAllProducts } from '../services/products';
import { Product } from '../interfaces/Product';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Toolbar from '../components/Toolbar';

export default function Productos() {
  const [products, setProducts] = useState<Product[]>();
  const onSetProducts = async () => {
    const productsResponse = await getAllProducts();
    if (productsResponse.error) {
      const hola = 'Do nothing';
    } else {
      setProducts(productsResponse.data);
    }
  };
  useEffect(() => {
    onSetProducts();
  }, []);
  return (
    <>
      <Toolbar />
      <Container className="py-4">
        <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, md: 12 }}>
          {products !== undefined && products !== null ? (
            products.map((product) => (
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
          ) : (
            <Typography>No hay productos para mostrar</Typography>
          )}
        </Grid>
      </Container>
    </>
  );
}

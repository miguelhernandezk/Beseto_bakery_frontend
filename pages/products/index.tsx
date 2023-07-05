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
import Head from 'next/head';

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
      const newProducts: Product[] = productsResponse.data;
      setProducts(
        newProducts
          .reverse()
          .filter(
            (product) => product.category.name !== 'Personalizados y eventos'
          )
      );
    }
  };
  useEffect(() => {
    onSetProducts();
  }, []);
  return (
    <>
      <Head>
        <title>Productos - Beseto</title>
        <meta property="og:title" content="Todos los productos Beseto" />
        <meta
          name="description"
          content="Encuentra todos los productos de los que disponemos"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:url"
          content={`https://www.beseto.com.mx/products/`}
        />
        <meta
          property="og:image"
          content="https://portfoliomiguelhernandezk.s3.us-west-1.amazonaws.com/Beseto/Productos/Tres+Leches/gelatinaFrutosRojosQueso.jpeg"
        />
      </Head>
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

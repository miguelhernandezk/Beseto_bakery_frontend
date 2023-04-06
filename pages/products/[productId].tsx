import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Rating } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Toolbar from '../../components/Toolbar';
import { getOneProduct } from '../../services/products';
import { useRouter } from 'next/router';
import { Product } from '../../interfaces/Product';

function ProductPage() {
  const router = useRouter();

  const [product, setProduct] = useState<Product>();

  const onSetProductInfo = async (_id: string) => {
    const productResponse = await getOneProduct(_id);
    if (productResponse.error) {
      const temp = 'Do nothing';
    } else {
      setProduct(productResponse.data);
    }
  };

  useEffect(() => {
    const idString = router.query.productId;
    if (
      idString !== null &&
      idString !== undefined &&
      typeof idString === 'string'
    ) {
      onSetProductInfo(idString);
    }
  }, [router.isReady]);
  return (
    <>
      <Toolbar />
      <Container sx={{ py: 8 }}>
        {product !== null && product !== undefined ? (
          <Grid
            container
            spacing={6}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={6}>
              {product.picture.length > 1 ? (
                <Carousel
                  showThumbs={product.picture.length > 1 ? true : false}
                  showStatus={false}
                >
                  {product.picture.map((urlPicture) => (
                    <div>
                      <img
                        key={`${product.name}${urlPicture}`}
                        src={urlPicture}
                        alt={product.name}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <Box>
                  <img src={product.picture[0]} alt={product.name} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {product.name}
                </Typography>
                <Rating name="product-rating" value={4} readOnly />
                <Typography variant="body1" sx={{ my: 1 }}>
                  {product.description}
                </Typography>
                <Typography variant="h5" sx={{ my: 1 }}>
                  ${product.price}.00 MXN
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" className="bg-beseto-bisque grow">
                    Agregar al carrito
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-beseto-dark-gray text-white grow"
                  >
                    Comprar ahora
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <CircularProgress />
        )}
      </Container>
    </>
  );
}

export default ProductPage;

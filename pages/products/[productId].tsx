import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  TextField,
  Chip,
} from '@mui/material';
import { Rating } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Toolbar from '../../components/Toolbar';
import {
  getAllProducts,
  getOneProduct,
  updateProduct,
} from '../../services/products';
import { Product } from '../../interfaces/Product';
import { signinStatus } from '../../services/auth';
import { User } from '../../interfaces/User';
import { UpdateProductDto } from '../../interfaces/dtos/Product.dto';
import { sendWhatsappMessage } from '../../services/whatsapp';
import { revalidatePage } from '../../services/revalidatePage';

interface ProductIdProps {
  initialProduct: Product;
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const productResponse = await getAllProducts();
  if (productResponse.error) {
    return { paths: undefined, fallback: false };
  } else {
    const myProducts: Product[] = productResponse.data;
    const paths = myProducts.map((product) => ({
      params: { productId: product._id },
    }));
    return { paths, fallback: false };
  }
}

export async function getStaticProps({
  params,
}: {
  params: { productId: string };
}) {
  const onSetProducts = async () => {
    const postsResponse = await getOneProduct(params.productId);
    if (postsResponse.error) {
      return {
        props: {
          initialProduct: undefined,
          revalidate: 60,
        },
      };
    } else {
      const myProduct: Product = postsResponse.data;
      return {
        props: {
          initialProduct: myProduct,
        },
        revalidate: 60,
      };
    }
  };
  return onSetProducts();
}

function ProductPage({ initialProduct }: ProductIdProps) {
  const router = useRouter();

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [product, setProduct] = useState<Product>(initialProduct);
  const [privileges, setPrivileges] = useState<'can edit' | 'cannot edit'>(
    'cannot edit'
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(initialProduct.name);
  const [editedDescripton, setEditedDescription] = useState<string>(
    initialProduct.description
  );
  const [editedPrice, setEditedPrice] = useState<string>(
    String(initialProduct.price)
  );
  const [editedFlavor1, setEditedFlavor1] = useState<string>(
    initialProduct.flavor1
  );
  const [editedFlavor2, setEditedFlavor2] = useState<string>(
    initialProduct.flavor2 ?? ''
  );
  const [editedTags, setEditedTags] = useState<string[]>(
    initialProduct.tags ?? []
  );
  const [tagField, setTagField] = useState<string>('');

  /**
   *  Displays a success message if everything went right after logged in
   */
  const notifySuccess = (msg = 'Tarea realizada exitosamente') =>
    toast.success(msg);

  /**
   * Displays an error message if something went wrong
   * @param {JSX.Element} msg - Message to be displayed
   */
  const notifyError = (msg = 'Oops, something went wrong') => toast.error(msg);

  const onSetUserPrivileges = async () => {
    const mySigninStatusResponse = await signinStatus();
    if (mySigninStatusResponse.error) {
      setPrivileges('cannot edit');
    } else {
      const mySigninStatus: User = mySigninStatusResponse.data;
      if (
        mySigninStatus.role === 'admin' ||
        mySigninStatus.role === 'editor' ||
        mySigninStatus.role === 'superuser'
      )
        setPrivileges('can edit');
    }
  };

  const handleClickEditButton = () => {
    setEditMode(!editMode);
  };

  const onChangeEditNameField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedName(event.target.value);
  };

  const onChangeEditDescriptionField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedDescription(event.target.value);
  };
  const onChangeEditPriceField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedPrice(event.target.value);
  };

  const onChangeEditTagsField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTagField(event.target.value);
  };

  const handleAddTag = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (product !== undefined && product?.tags !== null) {
        const newTags = [...editedTags];
        newTags.push(tagField);
        setEditedTags(newTags);
      }
      setTagField('');
    }
  };

  const handleDeleteTag = (tag: string) => {
    if (product !== undefined && product?.tags !== null) {
      const newTags = [...editedTags];
      newTags.splice(newTags.indexOf(tag), 1);
      setEditedTags(newTags);
    }
  };

  const handleClickSaveChangesButton = async () => {
    setEditMode(false);
    setLoadingState(true);
    const payload: UpdateProductDto = {
      name: editedName,
      description: editedDescripton,
      price: Number(editedPrice),
      flavor1: editedFlavor1,
      flavor2: editedFlavor2,
      tags: editedTags,
    };
    if (product !== undefined) {
      const updatedProductResponse = await updateProduct(product._id, payload);
      if (updatedProductResponse.error) {
        notifyError('No pudimos actualizar el producto');
      } else {
        const updatedProduct: Product = updatedProductResponse.data;
        setProduct(updatedProduct);
        setEditedName(updatedProduct.name);
        setEditedDescription(updatedProduct.description);
        setEditedPrice(String(updatedProduct.price));
        setEditedFlavor1(updatedProduct.flavor1);
        setEditedFlavor2(updatedProduct.flavor2 ?? '');
        setEditedTags(updatedProduct.tags !== null ? updatedProduct.tags : []);
        notifySuccess('Tarea realizada con éxito');
        const messageResponse = await revalidatePage(router.asPath);
        if (messageResponse.error) {
          notifyError(
            'Tu producto se actualizó pero no pudimos reflejar los cambios en este momento. Los cambios se reflejarán automáticamente en un minuto'
          );
        } else {
          const message = messageResponse.data;
          notifySuccess(
            `${message}: Los cambios se ven reflejados de manera instantánea`
          );
        }
      }
    } else {
      notifyError('Parece que hubo un error al recolectar tu información');
    }
    setLoadingState(false);
  };

  useEffect(() => {
    onSetUserPrivileges();
  }, []);
  return (
    <>
      <Head>
        <title>
          {product !== undefined ? product?.name : 'Loading'} - Beseto
        </title>
        <meta property="og:title" content={product.name} />
        <meta name="description" content={product.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:url"
          content={`https://www.beseto.com.mx/products/${product._id}/`}
        />
        <meta property="og:image" content={product.picture[0]} />
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />
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
                    <div key={`${product.name}${urlPicture}`}>
                      <img src={urlPicture} alt={product.name} />
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
                {' '}
                {privileges === 'can edit' ? (
                  <Button
                    variant="contained"
                    className="bg-beseto-bisque"
                    onClick={handleClickEditButton}
                  >
                    {editMode ? 'Cancelar' : 'Editar'}
                  </Button>
                ) : null}
                {!editMode ? (
                  <>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {product.name}
                    </Typography>
                    <Rating name="product-rating" value={4} readOnly />
                    <Typography variant="h5" sx={{ my: 1 }}>
                      Sabor principal:{' '}
                      <Typography component="span" variant="h6">
                        {product.flavor1}
                      </Typography>
                    </Typography>
                    {product.flavor2 !== null &&
                    product.flavor2 !== undefined &&
                    product.flavor2 !== '' ? (
                      <Typography variant="h5" sx={{ my: 1 }}>
                        Sabor secundario:{' '}
                        <Typography component="span" variant="h6">
                          {product.flavor2}
                        </Typography>
                      </Typography>
                    ) : null}
                    <Typography variant="body1" sx={{ my: 1 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h5" sx={{ my: 1 }}>
                      ${product.price}.00 MXN
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ my: 1 }}>
                      {/* <Button
                        variant="contained"
                        className="bg-beseto-bisque grow"
                      >
                        Agregar al carrito
                      </Button> */}
                      <Button
                        variant="contained"
                        className="bg-beseto-dark-gray text-white grow"
                        onClick={() => sendWhatsappMessage(product._id)}
                      >
                        Pedir info en whatsapp
                      </Button>
                    </Stack>{' '}
                    {product.tags !== null && product.tags?.length > 0 ? (
                      <Stack
                        direction="row"
                        sx={{ my: 2 }}
                        spacing={1}
                        flexWrap="wrap"
                      >
                        {product.tags.map((tag) => (
                          <Chip
                            className="my-1"
                            key={`edit${tag}`}
                            label={tag}
                          />
                        ))}
                      </Stack>
                    ) : null}
                  </>
                ) : (
                  <>
                    {' '}
                    <TextField
                      fullWidth
                      sx={{ my: 1 }}
                      id="outlined-basic"
                      value={editedName}
                      label="Nuevo nombre"
                      variant="outlined"
                      onChange={onChangeEditNameField}
                      disabled={loadingState}
                    />
                    <Rating name="product-rating" value={4} readOnly />
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={2}
                      alignItems="center"
                    >
                      <Typography variant="h5" sx={{ my: 1 }}>
                        Sabor principal:{' '}
                      </Typography>
                      <TextField
                        sx={{ my: 1 }}
                        id="outlined-basic"
                        value={editedName}
                        label="Nuevo sabor principal"
                        variant="outlined"
                        onChange={onChangeEditDescriptionField}
                        disabled={loadingState}
                      />
                    </Stack>
                    {product.flavor2 !== null &&
                    product.flavor2 !== undefined &&
                    product.flavor2 !== '' ? (
                      <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems="center"
                      >
                        <Typography variant="h5" sx={{ my: 1 }}>
                          Sabor secundario:{' '}
                        </Typography>
                        <TextField
                          sx={{ my: 1 }}
                          id="outlined-basic"
                          value={editedDescripton}
                          label="Nuevo sabor secundario"
                          variant="outlined"
                          onChange={onChangeEditDescriptionField}
                          disabled={loadingState}
                        />
                      </Stack>
                    ) : null}
                    <TextField
                      fullWidth
                      sx={{ my: 1 }}
                      id="outlined-basic"
                      value={editedDescripton}
                      label="Nueva descripción"
                      variant="outlined"
                      onChange={onChangeEditDescriptionField}
                      disabled={loadingState}
                    />
                    <TextField
                      fullWidth
                      sx={{ my: 1 }}
                      id="outlined-basic"
                      value={editedPrice}
                      label="Nuevo precio"
                      variant="outlined"
                      onChange={onChangeEditPriceField}
                      disabled={loadingState}
                    />
                    <TextField
                      onKeyUp={handleAddTag}
                      fullWidth
                      sx={{ my: 1 }}
                      id="outlined-basic"
                      value={tagField}
                      label="Agregar etiquetas"
                      variant="outlined"
                      onChange={onChangeEditTagsField}
                      disabled={loadingState}
                    />
                    {editedTags !== null &&
                    editedTags !== undefined &&
                    editedTags.length > 0 ? (
                      <Stack
                        direction="row"
                        sx={{ my: 2 }}
                        spacing={1}
                        flexWrap="wrap"
                      >
                        {editedTags.map((tag) => (
                          <Chip
                            className="my-1"
                            key={tag}
                            label={tag}
                            onDelete={() => handleDeleteTag(tag)}
                          />
                        ))}
                      </Stack>
                    ) : null}
                    <Button
                      variant="contained"
                      className="bg-beseto-dark-gray text-white grow"
                      onClick={handleClickSaveChangesButton}
                    >
                      Guardar cambios
                    </Button>
                  </>
                )}
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

import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  IconButton,
  Button,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import styles from '../styles/components/ProductCard.module.css';
import { useRouter } from 'next/router';
import { sendWhatsappMessage } from '../services/whatsapp';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import AppContext from '../context/AppContext';

interface ProductProps {
  _id: string;
  image: string;
  name: string;
  description: string;
  price: string | number;
}

function ProductCard({ _id, image, name, description, price }: ProductProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToCart } = useContext(AppContext);

  const navigateToProductPage = () => {
    router.push(`products/${_id}`);
  };

  const addOneToCart = async (productId: string) => {
    if (status === 'authenticated' && session) {
      addToCart(session.access_token, productId, 1);
    }
  };

  return (
    <Card className="w-full">
      <CardActionArea onClick={navigateToProductPage}>
        <CardMedia
          component="img"
          className="object-cover h-48"
          image={image}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="h-28 overflow-hidden"
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Stack className="flex flex-row md:flex-col lg:flex-row justify-between items-center w-full">
          <Typography className={styles.price}>{price}</Typography>
          {session &&
          status === 'authenticated' &&
          session.user.role !== 'customer' ? (
            <Stack direction="row" spacing={2}>
              <IconButton
                aria-label="Pedir información en whatsapp"
                size="small"
                className="bg-beseto-dark-gray text-white hover:opacity-50 hover:bg-black"
                onClick={() => addOneToCart(_id)}
              >
                <AddShoppingCartIcon />
              </IconButton>

              <IconButton
                aria-label="Pedir información en whatsapp"
                size="small"
                className="bg-green-600 text-white hover:opacity-1 hover:bg-green-800"
                onClick={() => sendWhatsappMessage(_id)}
              >
                <WhatsAppIcon />
              </IconButton>
            </Stack>
          ) : (
            <Button
              variant="contained"
              size="small"
              className="bg-beseto-bisque"
              onClick={() => sendWhatsappMessage(_id)}
            >
              Pedir info en whats
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}

export default ProductCard;

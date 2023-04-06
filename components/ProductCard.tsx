import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
} from '@mui/material';

import styles from '../styles/components/ProductCard.module.css';
import { useRouter } from 'next/router';

interface ProductProps {
  _id: string;
  image: string;
  name: string;
  description: string;
  price: string | number;
}

function ProductCard({ _id, image, name, description, price }: ProductProps) {
  const router = useRouter();

  const navigateToProductPage = () => {
    router.push(`products/${_id}`);
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
          <Button variant="contained" size="small" className="bg-beseto-bisque">
            Agregar al carrito
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}

export default ProductCard;

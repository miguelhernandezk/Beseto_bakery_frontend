import axios from 'axios';
import { useEffect, useState } from 'react';

import HeroHeader from '../components/HeroHeader';
import { Product } from '../interfaces/Product';
import { getAllProducts } from '../services/products';

function Nosotros() {
  const [cakeCategories, setCakeCategories] = useState<Product[] | null>(null);

  const getProducts = async () => {
    const productsResponse = await getAllProducts();
    if (productsResponse.error) {
      console.log('hubo error');
    } else {
      const products: Product[] = productsResponse.data;
      setCakeCategories(products);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <HeroHeader />
      {cakeCategories &&
        cakeCategories.map((category) => (
          <div key={category.name}>{category.name}</div>
        ))}
    </>
  );
}

export default Nosotros;

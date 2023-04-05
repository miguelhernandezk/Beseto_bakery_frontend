import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import HeroHeader from '../components/HeroHeader';
import Layout from '../components/Layout';
import { Product } from '../interfaces/Product';
import { getAllProducts } from '../services/products';

function Nosotros() {
  const [products, setProducts] = useState<Product[] | null>(null);

  const notifySuccess = (msg = 'Tarea realizada con éxito') =>
    toast.success(msg);

  const notifyError = (msg = 'Algo salió mal') => toast.error(msg);

  const getProducts = async () => {
    const productsResponse = await getAllProducts();
    if (productsResponse.error) {
      notifyError();
    } else {
      notifySuccess();
      const products: Product[] = productsResponse.data;
      setProducts(products);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <Layout>
        <HeroHeader />
        <>
          {products !== null && products !== undefined
            ? products.map((category) => (
                <div key={category.name}>{category.name}</div>
              ))
            : null}
        </>
      </Layout>
    </>
  );
}

export default Nosotros;

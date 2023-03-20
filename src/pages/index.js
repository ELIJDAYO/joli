import axios from 'axios';
import Layout from 'components/Layout';
import ProductItem from 'components/ProductItems';
import Product from 'models/Models';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import db from 'utils/db';
import { Store } from 'utils/Store';
// import data from '/utils/data';
export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  /**Let's implement Add to Cart for the homepage here.

If I click Add to Cart, it doesn't work. */
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          // submit the key
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

/**Instead of getting data from data that take us statically, we are going to fetch them from the database. */
/**before rendering the components and provides data for the component. */
export async function getServerSideProps() {
  await db.connect();
  /**We just get the products info instead of metadata from Mongo's collection  */
  const products = await Product.find().lean();
  return {
    // Define props object
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

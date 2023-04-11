import axios from 'axios';
import Layout from 'components/Layout';
import Product from 'models/Models';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import db from 'utils/db';
import { Store } from 'utils/Store';
/**Then go to the product screen at the beginning of a that is, get props in the product, the screen
and from props, get the product.
So there is no need to get the product from the data.js that you use, remove this lines */
export default function ProductScreen(props) {
  // to access the context from StoreProvider
  // state contains cart and cartItems
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    // We can wrap it inside the layout like this and set title to product.
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }
  // get dispatch from storeProvider for ADD_CART_ITEMS
  // Because I'm using a weight here, I need to change this function to a sync
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    /**What I I'm going to do here is to send an Ajax request right here and check the container stock in the
    database to make sure that we have this quantity in the backend API. 
    Here we need to implement this API at this address a slash API slash product slash product ID.*/
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      alert('Sorry. Product is out of stock');
      return;
    }
    // the params are type and payload
    // quantity: 1
    // product properties and qty field
    // add item to the cart
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };
  return (
    // to get the product from url, routerHook
    // npm i -D @types/react
    <Layout title={product.name}>
      <div className="py-2">
        <Link type="button" class="text-black primary-button w-full0" href="/">
          Back to Products
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-10">
        <div className="sm:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={420}
            height={420}
            layout="responsive"
          ></Image>
        </div>
        <div className="pl-5">
          <ul>
            <li>
              <h1 className="mt-5 text-xl font-bold">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div className="mt-5 mr-5 pr-3">
          <div className="card p-3">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>₱{product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
/**if I click on a product, the product in the product page is coming from data.js. */
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  /**on the product model and filter products based on this log in the URL, then use the clean to convert
it to the JavaScript object and put it inside the props. */
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}

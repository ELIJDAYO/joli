import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  // If it does exist, use JSON that pass to convert this string to a JavaScript object because in the cookies

  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : /**If you are getting this error to get rid of it, just click here, click on cookies, remove the cookie, */
      { cartItems: [], shippingAddress: {} },
};

function reducer(state, action) {
  switch (action.type) {
    // update state
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      //   what is the state of the item?
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? //   check cartItems if item exists
          state.cart.cartItems.map((item) =>
            // if === then replace with new quantity (newItem) otherwise keep the other item as is
            item.name === existItem.name ? newItem : item
          )
        : //   deconstract items in the cart and push newItem to the end of the cart
          [...state.cart.cartItems, newItem];
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      //   keep the prev state, keep the prev values in the cart, then return updated cartItems
      // So we are searching the cookies for cart key.
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        // Based on this log of item and return all cart items except the item that we passed in the action that payload.
        (item) => item.slug !== action.payload.slug
      );
      // then return previous state
      // in the cart key previous cart and then pass the cart item as a parameter.
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_RESET':
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };
    // case for saving shipping address in the reducer.
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            // We keep the previous data in the shipping address as they are, but we merge the address in the payload

            // So the update, the shipping address fails by the data in the payload and the data in the payload is
            // coming from the shipping form.
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        /**That payment method, because it's a string, we don't use the carrier bracket
         * like what we did for
         * shipping gatherers. */
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
}
// create wrapper for all children then return
export function StoreProvider({ children }) {
  // define reducer hook
  const [state, dispatch] = useReducer(reducer, initialState);
  //   state is the cart and cartItems
  const value = { state, dispatch };
  //   Store.Provider is imported
  //   stateReducer and StoreProvider make cartItems availble throughout js components
  return <Store.Provider value={value}>{children}</Store.Provider>;
}

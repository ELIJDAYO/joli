import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  cart: { cartItems: [] },
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
      //   keep the prev state, keep the prev values in the cart, then return updated cartItems
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}
// create wrapper for all children then return
export function StoreProvider({ children }) {
  // define reduver hook
  const [state, dispatch] = useReducer(reducer, initialState);
  //   state is the cart and cartItems
  const value = { state, dispatch };
  //   Store.Provider is imported
  //   stateReducer and StoreProvider make cartItems availble throughout js components
  return <Store.Provider value={value}>{children}</Store.Provider>;
}

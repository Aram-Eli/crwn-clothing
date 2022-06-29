
import { createContext, useReducer } from "react";

import { createAction } from '../utils/firebase/reducer/reducer.utils';

// to add items
const addCartItem = (cartItems, productToAdd) => {
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === productToAdd.id
        );

    if(existingCartItem) {
        return cartItems.map((cartItem) => 
          cartItem.id === productToAdd.id ? {...cartItem, quantity: cartItem.quantity + 1} 
          : cartItem
        );
    }
    return [...cartItems, { ...productToAdd, quantity: 1 }];
};

// to remove items
const removeCartItem = (cartItems, cartItemToRemove) => {
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === cartItemToRemove.id
     );

    if(existingCartItem.quantity === 1) {
        return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id)
    };

    return cartItems.map((cartItem) => 
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem
    );
};

// to clear the item from the dropdown list
const clearCartItem = (cartItems, cartItemToclear) => cartItems.filter((cartItem) => cartItem.id !== cartItemToclear.id);

export const CartContext = createContext({
    setIsCartOpen: () => {},
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    clearItemFromCart: () => {},
});

const CART_ACTION_TYPES = {
    SET_CART_ITEMS: 'SET_CART_ITEMS',
    SET_IS_CART_OPEN: 'SET_IS_CART_OPEN',
};

const INITIAL_STATE = {
    isCartOpen: false,
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
};

const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch(type) {
    case CART_ACTION_TYPES.SET_CART_ITEMS:
        return {
          ...state,
          ...payload
        }
    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
        return {
          ...state,
          isCartOpen: payload,
        }
    default:
        throw new Error(`unhandled type of ${type} in cartReducer`)
  }
};

export const CartProvider = ({children}) => {
    const [{cartItems, isCartOpen, cartCount, cartTotal}, dispatch ] = useReducer(cartReducer, INITIAL_STATE);

    

    const updateCartItemsReducer = (newCartItems) => {
        const newCartCount = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity, 0
        );

        const newCartTotal = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity * cartItem.price, 0
        );

        dispatch(
            createAction(CART_ACTION_TYPES.SET_CART_ITEMS, {
                cartItems: newCartItems,
                cartTotal: newCartTotal,
                cartCount: newCartCount,
            }));
    };

    const addItemToCart = (productToAdd) => {
       const newCartItems = addCartItem(cartItems, productToAdd);
       updateCartItemsReducer(newCartItems);
    };

    const removeItemToCart = (cartItemToClear) => {
       const newCartItems = removeCartItem(cartItems, cartItemToClear);
       updateCartItemsReducer(newCartItems);
    };

    const clearItemFromCart = (cartItemToRemove) => {
       const newCartItems = clearCartItem(cartItems, cartItemToRemove);
       updateCartItemsReducer(newCartItems);
    };

    const setIsCartOpen = (bool) => {
        dispatch(createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool))
    }

    const value = {
        isCartOpen,
        setIsCartOpen, 
        addItemToCart, 
        removeItemToCart, 
        cartItems, 
        cartCount, 
        clearItemFromCart, 
        cartTotal 
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
};

export default CartProvider;
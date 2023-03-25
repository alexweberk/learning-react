import { createContext, useReducer } from 'react';

import createAction from '../utils/reducer/reducer.utils';

const addCartItem = (cartItems, productToAdd) => {
	const existingCartItem = cartItems.find(
		(cartItem) => cartItem.id === productToAdd.id
	);

	if (existingCartItem) {
		return cartItems.map((cartItem) =>
			cartItem.id === productToAdd.id
				? { ...cartItem, quantity: cartItem.quantity + 1 }
				: cartItem
		);
	}

	return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeOneCartItem = (cartItems, productToRemove) => {
	const existingCartItem = cartItems.find((cartItem) => {
		return cartItem.id === productToRemove.id;
	});

	if (existingCartItem.quantity === 1) {
		return cartItems.filter((cartItem) => cartItem.id !== productToRemove.id);
	}

	return cartItems.map((cartItem) => {
		if (cartItem.id === productToRemove.id) {
			return { ...cartItem, quantity: cartItem.quantity - 1 };
		} else {
			return cartItem;
		}
	});
};

const removeCartItem = (cartItems, productToRemove) => {
	return cartItems.filter((cartItem) => {
		return cartItem.id !== productToRemove.id;
	});
};

export const CartContext = createContext({
	isCartOpen: false,
	setIsCartOpen: () => {},
	cartItems: [],
	addItemToCart: () => {},
	removeItemFromCart: () => {},
	cartCount: 0,
	clearCart: () => {},
	cartTotal: 0,
});

export const CART_ACTION_TYPES = {
	SET_CART_ITEMS: 'SET_CART_ITEMS',
};

export const cartReducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case CART_ACTION_TYPES.SET_CART_ITEMS:
			return {
				...state,
				...payload,
			};

		default:
			throw new Error(`Unhandled type ${type} in cartReducer`);
	}
};

const INITIAL_STATE = {
	isCartOpen: false,
	cartItems: [],
	cartCount: 0,
	cartTotal: 0,
};

export const CartProvider = ({ children }) => {
	const [{ cartItems, isCartOpen, cartCount, cartTotal }, dispatch] =
		useReducer(cartReducer, INITIAL_STATE);

	const updateCartItemsReducer = (newCartItems) => {
		const newCartCount = newCartItems.reduce(
			(total, cartItem) => total + cartItem.quantity,
			0
		);
		const newCartTotal = newCartItems.reduce(
			(total, cartItem) => total + cartItem.quantity * cartItem.price,
			0
		);

		dispatch(
			createAction('SET_CART_ITEMS', {
				cartItems: newCartItems,
				cartCount: newCartCount,
				cartTotal: newCartTotal,
			})
		);
	};

	const addItemToCart = (productToAdd) => {
		const newCartItems = addCartItem(cartItems, productToAdd);
		updateCartItemsReducer(newCartItems);
	};
	const removeOneItemFromCart = (productToRemove) => {
		const newCartItems = removeOneCartItem(cartItems, productToRemove);
		updateCartItemsReducer(newCartItems);
	};

	const removeItemFromCart = (productToRemove) => {
		const newCartItems = removeCartItem(cartItems, productToRemove);
		updateCartItemsReducer(newCartItems);
	};

	const clearCart = () => {
		updateCartItemsReducer([]);
	};

	const setIsCartOpen = () => {
		dispatch(
			createAction('SET_CART_ITEMS', {
				isCartOpen: !isCartOpen,
			})
		);
	};

	const value = {
		isCartOpen,
		setIsCartOpen,
		cartItems,
		addItemToCart,
		removeItemFromCart,
		removeOneItemFromCart,
		cartCount,
		cartTotal,
		clearCart,
	};
	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

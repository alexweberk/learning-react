import { createContext, useState, useEffect } from 'react';

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

export const CartProvider = ({ children }) => {
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [cartCount, setCartCount] = useState(0);
	const [cartTotal, setCartTotal] = useState(0);

	useEffect(() => {
		const newCardCount = cartItems.reduce(
			(total, cartItem) => total + cartItem.quantity,
			0
		);
		setCartCount(newCardCount);
	}, [cartItems]);

	useEffect(() => {
		const newTotal = cartItems.reduce(
			(total, cartItem) => total + cartItem.quantity * cartItem.price,
			0
		);
		setCartTotal(newTotal);
	}, [cartItems]);

	const clearCart = () => setCartItems([]);

	const addItemToCart = (productToAdd) => {
		setCartItems(addCartItem(cartItems, productToAdd));
	};
	const removeOneItemFromCart = (productToRemove) => {
		setCartItems(removeOneCartItem(cartItems, productToRemove));
	};

	const removeItemFromCart = (productToRemove) => {
		setCartItems(removeCartItem(cartItems, productToRemove));
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

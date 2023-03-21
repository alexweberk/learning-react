import { useContext } from 'react';
import { CartContext } from '../../contexts/cart.context';
import { useNavigate } from 'react-router-dom';
import {
	CartDropdownContainer,
	EmtpyMessage,
	CartItems,
} from './cart-dropdown.styles';

import CartItem from '../cart-item/cart-item.component';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

const CartDropdown = () => {
	const { cartItems, clearCart, setIsCartOpen } = useContext(CartContext);
	const navigate = useNavigate();

	const goToCheckoutHandler = () => {
		navigate('/checkout');
		setIsCartOpen(false);
	};

	return (
		<CartDropdownContainer>
			<CartItems>
				{cartItems.length ? (
					cartItems.map((item) => (
						<CartItem
							key={item.id}
							cartItem={item}
						/>
					))
				) : (
					<EmtpyMessage>Your cart is empty</EmtpyMessage>
				)}
			</CartItems>

			<Button onClick={goToCheckoutHandler}>Go to checkout</Button>

			<Button
				buttonType={BUTTON_TYPE_CLASSES.inverted}
				onClick={clearCart}
			>
				Clear Cart
			</Button>
		</CartDropdownContainer>
	);
};

export default CartDropdown;

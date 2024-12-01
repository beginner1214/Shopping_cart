import React, { useContext, useState } from "react";
import { ShoppingcartContext } from "../Context/Createcontext";
import "../Style/Cart.css";

const Cart = () => {
  const { cartitems, setcartitems } = useContext(ShoppingcartContext);

  // Update item quantity
  const updateQuantity = (id, quantityChange) => {
    const updatedCart = cartitems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + quantityChange,
            totalPrice: (item.quantity + quantityChange) * item.price,
          }
        : item
    );
    const filteredCart = updatedCart.filter((item) => item.quantity > 0);
    setcartitems(filteredCart);
    localStorage.setItem("cartitems", JSON.stringify(filteredCart));
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cartitems.filter((item) => item.id !== id);
    setcartitems(updatedCart);
    localStorage.setItem("cartitems", JSON.stringify(updatedCart));
  };

  // Calculate total price
  const calculateTotal = () =>
    cartitems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      <br></br>
      {cartitems.length > 0 ? (
        <div className="cart-items">
          {cartitems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.thumbnail}
                alt={item.name}
                className="cart-image"
              />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <div className="cart-actions">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <p>Total: ${item.totalPrice.toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Total: ${calculateTotal()}</h3>
            <button  onClick={() => alert("Proceeding to checkout!")} className="checkoutbut">
           <h1>   Checkout</h1>
            </button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty. Start shopping!</p>
      )}
    </div>
  );
};

export default Cart;

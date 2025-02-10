import React, { useContext, useState, useEffect } from "react";
import { ShoppingcartContext } from "../Context/Createcontext";
import { db, auth } from "../Services/Firebaseauth.js";
import { doc, setDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../Style/Cart.css";

const Cart = () => {
  const { cartitems, setcartitems } = useContext(ShoppingcartContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    // Set loading to false once cart items are loaded
    setIsLoading(false);
  }, [cartitems]);

  // Update Firestore when cart items change
  const updateFirestoreCart = async (updatedCart) => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, { cartItems: updatedCart }, { merge: true });
    } catch (error) {
      console.error("Error updating cart in Firestore:", error);
    }
  };

  // Update item quantity
  const updateQuantity = async (id, quantityChange) => {
    const updatedCart = cartitems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(1, item.quantity + quantityChange),
            totalPrice:
              Math.max(1, item.quantity + quantityChange) * item.price,
          }
        : item
    );

    setcartitems(updatedCart);
    localStorage.setItem("cartitems", JSON.stringify(updatedCart));
    await updateFirestoreCart(updatedCart);
  };

  // Remove item from cart
  const removeItem = async (id) => {
    const updatedCart = cartitems.filter((item) => item.id !== id);

    setcartitems(updatedCart);
    localStorage.setItem("cartitems", JSON.stringify(updatedCart));
    await updateFirestoreCart(updatedCart);
  };

  // Calculate total price
  const calculateTotal = () =>
    cartitems.reduce((total, item) => total + item.totalPrice, 0);

  // Checkout handler
  const handleCheckout = async () => {
    if (!auth.currentUser) {
      alert("Please log in to proceed with checkout");
      return;
    }

    try {
      if (cartitems.length === 0) {
        alert("Your cart is empty. Add items before checking out.");
        return;
      }

      const orderData = {
        userId: auth.currentUser.uid,
        items: cartitems,
        total: calculateTotal(),
        createdAt: new Date(),
        status: "pending",
      };

      console.log("Placing order:", orderData);

      const orderDocRef = doc(collection(db, "orders"));
      await setDoc(orderDocRef, orderData);

      // Clear cart in both Firestore and local storage
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, { cartItems: [] }, { merge: true });
      setcartitems([]);
      localStorage.removeItem("cartitems");

      alert("Order placed successfully!");
    // Navigate to profile after successful checkout
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      <br />
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
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
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
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            <button
              onClick={handleCheckout}
              className="checkoutbut"
              disabled={!auth.currentUser || cartitems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <h2>
          Your cart is empty. <a href="/products">Start shopping!</a>
        </h2>
      )}
    </div>
  );
};

export default Cart;
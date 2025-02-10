import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Services/Firebaseauth.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const ShoppingcartContext = createContext({});

function ShoppingcartContextProvider({ children }) {
  const [listofitems, setlistofitems] = useState([]);
  const [loadingstate, setloadingstate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [productdetails, setproductdetails] = useState(null);
  const [cartitems, setcartitems] = useState([]);
  const Navigate = useNavigate();

  // Fetch cart items from Firestore when user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!auth.currentUser) {
        // If no user, clear cart
        setcartitems([]);
        localStorage.removeItem("cartitems");
        return;
      }

      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().cartItems) {
          const validCartItems = userDoc.data().cartItems.map((item) => ({
            ...item,
            quantity: item.quantity || 1,
            totalPrice: (item.quantity || 1) * item.price,
          }));

          setcartitems(validCartItems);
          localStorage.setItem("cartitems", JSON.stringify(validCartItems));
        } else {
          // If no cart items exist for the user, set an empty cart
          await setDoc(userDocRef, { cartItems: [] }, { merge: true });
          setcartitems([]);
          localStorage.removeItem("cartitems");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setcartitems([]);
        localStorage.removeItem("cartitems");
      }
    };

    fetchCartItems();
  }, [auth.currentUser]);

  // Fetch all products
  const Fetchdata = async () => {
    setloadingstate(true);
    setErrorMessage("");
    try {
      const res = await fetch("https://dummyjson.com/products");
      const data = await res.json();
      if (data && data.products) {
        setlistofitems(data.products);
      }
    } catch (error) {
      setErrorMessage("Failed to load products.");
      console.error("Error fetching data:", error);
    } finally {
      setloadingstate(false);
    }
  };

  // Handle adding products to cart
  const Handleaddtocart = async (product) => {
    if (!auth.currentUser) {
      alert("Please log in to add items to cart");
      return;
    }

    let updatedCartItems = [...cartitems];
    const productIndex = updatedCartItems.findIndex(
      (item) => item.id === product.id
    );

    if (productIndex === -1) {
      // Product not in cart, add it
      updatedCartItems.push({
        ...product,
        quantity: 1,
        totalPrice: product.price,
      });
    } else {
      // Product already in cart, update quantity and total price
      updatedCartItems[productIndex].quantity += 1;
      updatedCartItems[productIndex].totalPrice += product.price;
    }

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, { cartItems: updatedCartItems }, { merge: true });

      setcartitems(updatedCartItems);
      localStorage.setItem("cartitems", JSON.stringify(updatedCartItems));
      Navigate("/cart");
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart. Please try again.");
    }
  };

  // Handle clearing cart (optional utility)
  const ClearCart = async () => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, { cartItems: [] }, { merge: true });

      setcartitems([]);
      localStorage.removeItem("cartitems");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  useEffect(() => {
    Fetchdata();
  }, []);

  return (
    <ShoppingcartContext.Provider
      value={{
        listofitems,
        loadingstate,
        errorMessage,
        productdetails,
        cartitems,
        setcartitems,
        setproductdetails,
        Handleaddtocart,
        ClearCart,
      }}
    >
      {children}
    </ShoppingcartContext.Provider>
  );
}

export default ShoppingcartContextProvider;
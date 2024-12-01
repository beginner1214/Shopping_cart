import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ShoppingcartContext = createContext({});

function ShoppingcartContextProvider({ children }) {
  const [listofitems, setlistofitems] = useState([]);
  const [loadingstate, setloadingstate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [productdetails, setproductdetails] = useState(null);
  const [cartitems, setcartitems] = useState(() => {
    // Initialize cart items from localStorage
    const savedCart = localStorage.getItem("cartitems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const Navigate = useNavigate();

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
  const Handleaddtocart = (product) => {
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

    setcartitems(updatedCartItems);
    localStorage.setItem("cartitems", JSON.stringify(updatedCartItems));
    Navigate("/cart");
  };

  // Handle clearing cart (optional utility)
  const ClearCart = () => {
    setcartitems([]);
    localStorage.removeItem("cartitems");
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
        ClearCart, // Optional: Expose ClearCart if needed
      }}
    >
      {children}
    </ShoppingcartContext.Provider>
  );
}

export default ShoppingcartContextProvider;

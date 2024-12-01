import React, { useContext } from "react";
import Producttile from "../Component/Producttile";
import { ShoppingcartContext } from "../Context/Createcontext";
import "../Style/Productpagecss.css";
const Products = () => {
  const { listofitems, loadingstate, errorMessage } =
    useContext(ShoppingcartContext);

  return (
    <section className="shopping-section">
      <div className="container">
        <div className="heading">
          <h1>Our Featured Products..</h1>
        </div>
        {loadingstate ? (
          <p>Loading products...</p>
        ) : errorMessage ? (
          <p className="error">{errorMessage}</p>
        ) : (
          <div className="product-grid">
            {listofitems.length > 0 ? (
              listofitems.map((singleproducttile) => (
                <Producttile
                  key={singleproducttile.id}
                  singleproducttile={singleproducttile}

                />
                
              ))
            ) : (
              <h3>No products available</h3>
            )}
          </div>
        )}
      
      </div>
    </section>
  );
};

export default Products;

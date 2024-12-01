import React from "react";
import "../Style/Productitem.css";
import { useNavigate } from "react-router-dom";

const Producttile = ({ singleproducttile }) => {
  const navigate = useNavigate();
  function Handlenavigatetoproductdetailspage(getsingleproductid) {
    navigate(`/products/${getsingleproductid}`);
  }
  return (
    <div className="product-item">
      <div className="image-container">
        <img
          src={singleproducttile?.thumbnail || "fallback-image-url.jpg"}
          alt={singleproducttile?.title || "Product image"}
          className="product-image"
        />
      </div>
      <p className="product-title">{singleproducttile?.title || "Untitled"}</p>
      <p className="product-price">
        ${singleproducttile?.price?.toFixed(2) || "0.00"}
      </p>
      <div className="Buttondetails">
        <button
          onClick={() =>
            Handlenavigatetoproductdetailspage(singleproducttile?.id)
          }
        >
          View details
        </button>
      </div>
    </div>
  );
};

export default Producttile;

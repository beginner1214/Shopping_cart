import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingcartContext } from "../Context/Createcontext";
import "../Style/Singleproduct.css";

const Productdetailspage = () => {
  const { id } = useParams();
  const { productdetails, setproductdetails, Handleaddtocart } =
    useContext(ShoppingcartContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  async function Fetchproductdetails() {
    try {
      const apires = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await apires.json();
      setproductdetails(data);
      setSelectedImage(data.thumbnail);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }

  useEffect(() => {
    Fetchproductdetails();
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="individualproduct">
      <div className="container">
        <div className="product-layout">
          {/* Left Section - Images and Buttons */}
          <div className="left-section">
            <div className="image-and-buttons">
              <div className="imgconta">
                <img
                  src={selectedImage || productdetails?.thumbnail || ""}
                  alt={productdetails?.title || "Product Thumbnail"}
                  className="main-image"
                />
                <div className="button-container">
                  <button
                    className="add-to-cart"
                    onClick={() => Handleaddtocart(productdetails)}
                    disabled={!productdetails?.stock}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="buy-now"
                    onClick={() => alert("Buying now!")}
                    disabled={!productdetails?.stock}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
              <div className="smallimg">
                {productdetails?.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${productdetails.title} view ${index + 1}`}
                    onClick={() => handleImageClick(img)}
                    className={selectedImage === img ? "active" : ""}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Product Information */}
          <div className="right-section">
            <h1>{productdetails?.title || "Product Title"}</h1>

            <div className="price-rating-section">
              <p className="price">
                ${productdetails?.price?.toFixed(2) || "0.00"}
              </p>
              <div className="rating-stock">
                <p className="rating">
                  ★ {productdetails?.rating?.toFixed(1) || "N/A"}
                </p>
                <p className="stock">
                  {productdetails?.stock
                    ? `${productdetails.stock} in stock`
                    : "Out of Stock"}
                </p>
              </div>
            </div>

            <div className="description-section">
              <h3>About this item</h3>
              <p className="description">
                {productdetails?.description ||
                  "Product description goes here."}
              </p>
            </div>

            <div className="shipping-section">
              <p className="shipping-info">
                <span>Shipping Information:</span>{" "}
                {productdetails?.shippingInformation || "Free Shipping"}
              </p>
              <p className="return-policy">
                <span>Return Policy:</span>{" "}
                {productdetails?.returnPolicy || "30-day returns"}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3>Customer Reviews</h3>
          <div className="reviews">
            {productdetails?.reviews?.length > 0 ? (
              productdetails.reviews.map((review, index) => (
                <div key={index} className="review">
                  <div className="review-header">
                    <p className="review-rating">★ {review.rating}</p>
                    <p className="review-date">Verified Purchase</p>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productdetailspage;

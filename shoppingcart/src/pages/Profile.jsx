import React, { useState, useEffect } from 'react';
import { auth, db } from '../Services/Firebaseauth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import "../Style/Profilemodule.css";

const Profilepage = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Ensure user is authenticated
        if (!auth.currentUser) {
          navigate('/login');
          return;
        }

        // Set user data from Firebase Authentication
        setUserData({
          name: auth.currentUser.displayName || 'User',
          email: auth.currentUser.email,
          photo: auth.currentUser.photoURL || '/default-avatar.png'
        });

        // Fetch user's orders
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef, 
          where('userId', '==', auth.currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate() // Convert Firestore timestamp
        }));

        setOrders(fetchedOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading profile...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImageContainer}>
          <img 
            src={userData?.photo} 
            alt="Profile" 
            className={styles.profileImage} 
          />
        </div>
        <div className={styles.profileInfo}>
          <h1>{userData?.name}</h1>
          <p>{userData?.email}</p>
          <button 
            onClick={handleLogout} 
            className={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={styles.ordersSection}>
        <h2>Order History</h2>
        {orders.length === 0 ? (
          <p className={styles.noOrders}>No orders found</p>
        ) : (
          <div className={styles.ordersList}>
            {orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span>Order #{order.id.slice(-6)}</span>
                  <span className={styles.orderDate}>
                    {order.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <div className={styles.orderSummary}>
                    <p>Status: <span className={styles.orderStatus}>{order.status}</span></p>
                    <p>Total: ${order.total.toFixed(2)}</p>
                  </div>
                  <div className={styles.orderItems}>
                    {order.items.map(item => (
                      <div key={item.id} className={styles.orderItem}>
                        <img 
                          src={item.thumbnail} 
                          alt={item.name} 
                          className={styles.orderItemImage} 
                        />
                        <div className={styles.orderItemDetails}>
                          <p>{item.name}</p>
                          <p>Qty: {item.quantity}</p>
                          <p>${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profilepage;
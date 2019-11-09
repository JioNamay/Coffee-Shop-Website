import React, { useEffect } from "react";
import { connect } from "react-redux";

import OrderHistoryItem from "../components/OrderHistoryItem";
import { getUserOrderHistoryAction } from "../store/actions/adminActions";

const AdminOrderHistoryPage = props => {
  let { admin, user, orderHistory, getUserOrderHistoryAction } = props;

  useEffect(() => {
    if (admin === null) {
      props.history.push("/admin/login");
    }

    // get users ID from url
    const userId = window.location.pathname.split("/").pop();

    // Get the user's order history
    getUserOrderHistoryAction(userId)
      .then()
      .catch(error => {
        if (error.message === "INVALID_LOGIN") {
          props.history.push("/login");
        }
      });
  }, []);

  return (
    <div className="container">
      <section className="user-section">
        {user != null && (
          <div className="user-card">
            <div className="user-name">
              <p>
                Name: {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="user-email">
              <p>Email: {user.email}</p>
            </div>
          </div>
        )}
      </section>
      <section className="order-history-section">
        {orderHistory != null && orderHistory.length > 0 && (
          <div>
            <h2>Order History</h2>
            <div className="order-history-items">
              {orderHistory.map(orderItem => (
                <OrderHistoryItem
                  key={orderItem.orderItemId}
                  itemId={orderItem.itemId}
                  itemName={orderItem.name}
                  itemPrice={orderItem.price}
                  itemImage={orderItem.image}
                  dateOrdered={orderItem.date}
                  showImage={false}
                  showDelete={true}
                  showArchive={true}
                />
              ))}
            </div>
          </div>
        )}
        {orderHistory != null && orderHistory.length === 0 && (
          <h2>No Order History Available</h2>
        )}
      </section>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    admin: state.admin.admin,
    user: state.admin.orderHistory.user,
    orderHistory: state.admin.orderHistory.orderHistory
  };
};

export default connect(
  mapStateToProps,
  { getUserOrderHistoryAction }
)(AdminOrderHistoryPage);

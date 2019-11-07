import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import OrderHistoryItem from "../components/OrderHistoryItem";
import { getOrderHistoryAction } from "../store/actions/shopActions";

const OrderHistory = (props) => {
  let {
    user,
    orderHistory,
    getOrderHistoryAction
  } = props;

  useEffect(() => {
    if (user === null) {
      props.history.push('/');
    }

    // Get the user's order history
    getOrderHistoryAction()
      .then()
      .catch((error) => {
        if (error.message === 'INVALID_LOGIN') {
          props.history.push('/login')
        }
    });
  }, []);

  return (
    <section className="order-history-section">
      {
        orderHistory != null && orderHistory.length > 0 &&
        <div>
          <h2>Order History</h2>
          <div className="order-history-items">
            {
              orderHistory.map(orderItem =>
                <OrderHistoryItem
                  key={orderItem.orderItemId}
                  itemId={orderItem.itemId}
                  itemName={orderItem.name}
                  itemPrice={orderItem.price}
                  itemImage={orderItem.image}
                  dateOrdered={orderItem.date}
                  showImage={true}
                  showDelete={false}
                />
              )
            }
          </div>
        </div>
      }
      {
        orderHistory != null && orderHistory.length === 0 &&
        <h2>No Order History Available</h2>
      }
    </section>
  )
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
    orderHistory: state.shop.orderHistory
  }
};

export default connect(mapStateToProps, { getOrderHistoryAction })(OrderHistory);

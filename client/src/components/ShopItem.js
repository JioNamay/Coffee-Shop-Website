import React from 'react';
import { connect } from 'react-redux';

import { addCartAction } from "../store/actions/shopActions";

import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ShopItem = (props) => {
  let {
    user,
    itemId,
    itemImage,
    itemName,
    itemDescription,
    itemPrice,
    addCartAction,
  } = props;

  const onCartAdd = async (itemId, itemName, itemDescription, itemPrice, itemImage) => {
    addCartAction(itemId, itemName, itemDescription, itemPrice, itemImage);
    toast.success("Added To Cart", {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  };

  return (
    <div className='card'>
      <div className='card-image'>
        <img src={itemImage} alt={itemName}/>
      </div>
      <div className='card-info'>
        <h1>{itemName}</h1>
        <h3>${itemPrice}</h3>
        {
          user.user &&
          <button onClick={() => {onCartAdd(itemId, itemName, itemDescription, itemPrice, itemImage)}}>Add To Cart</button>
        }
        <p>{itemDescription}</p>
      </div>
    </div>
  )
};

const mapStateToProps = state => {
  return {
    user: state.user
  }
};

export default connect(mapStateToProps, { addCartAction })(ShopItem);

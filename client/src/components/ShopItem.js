import React from 'react';
import { connect } from 'react-redux';

import { addCartAction } from "../store/actions/shopActions";

const ShopItem = (props) => {
  let {
    user,
    itemId,
    itemImage,
    itemName,
    itemDescription,
    itemPrice,
    addCartAction
  } = props;

  const onCartAdd = (itemId, itemName, itemDescription, itemPrice, itemImage) => {
    addCartAction(itemId, itemName, itemDescription, itemPrice, itemImage);
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

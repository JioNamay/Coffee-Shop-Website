import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import ShopItem from "../components/ShopItem";
import { getItemsAction } from "../store/actions/shopActions";

const Browse = (props) => {
  let {
    items,
    getItemsAction
  } = props;

  const [searchValue, setSearchValue] = useState('');

  if (items != null) {
    if (searchValue !== '') {
      items = items.filter(item => item.name.toLowerCase().match(searchValue.toLowerCase()));
    }
  }

  useEffect(() => {
    getItemsAction();
  }, []);

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className='browse-page'>
      <h2>Browse Coffee</h2>
      <div className='search-container'>
        <div className='search'>
          <div className='search-text'>
            <input
              type="text"
              placeholder="Search"
              name="searchValue"
              value={searchValue}
              onChange={e => {onSearchChange(e)}}
            />
          </div>
        </div>
      </div>
      {
        items != null && items.length > 0 && items.map(item =>
          <ShopItem
            key={item.itemId}
            itemId={item.itemId}
            itemName={item.name}
            itemDescription={item.description}
            itemPrice={item.price}
            itemImage={item.image}
          />
        )
      }
    </div>
  )
};

const mapStateToProps = state => {
  return {
    items: state.shop.items
  }
};

export default connect(mapStateToProps, { getItemsAction })(Browse);

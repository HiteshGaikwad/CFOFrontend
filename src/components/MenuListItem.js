import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown, faAngleUp, faBuildingColumns, faCalculator, faCircleInfo, faDesktop,
  faFileInvoice, faGem, faHouseChimneyWindow, faLock, faMoneyCheck
} from '@fortawesome/free-solid-svg-icons';
const getIcon = (iconName) => {
  switch (iconName) {
    case "fa-desktop":
      return faDesktop;
    case "fa-regular fa-lock":
      return faLock;
    case "fa-sharp fa-light fa-money-check":
      return faMoneyCheck;
    case "fa-light fa-building-columns":
      return faBuildingColumns;
    case "fa-thin fa-calculator":
      return faCalculator;
    case "fa-thin fa-file-invoice":
      return faFileInvoice;
    case "fa-regular fa-house-window":
      return faHouseChimneyWindow;
    case "fa-regular fa-gem":
      return faGem;
    case "fa-solid fa-circle-info":
      return faCircleInfo;
    default:
      return null;
  }
};
const MenuItem = ({ item, openItems, toggleItem, parentId }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openItems[parentId] === item.SId;
  const handleParentClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    toggleItem(parentId, item.SId, hasChildren);
  };
  return (
    <li key={item.SId} id={`mnu${item.SId}`} className='open'>
      <Link
        to={item.NewUrl ? item.NewUrl : '#'}
        title={item.Name}
        data-filter-tags={item.Name}
        onClick={hasChildren ? handleParentClick : null}
        style={{
          cursor: hasChildren ? 'default' : 'pointer',
          textDecoration: 'none',
        }}
      >
        {item?.ParentId === 0 &&
          <FontAwesomeIcon icon={getIcon(item?.Icons)} />}
        <span className="nav-link-text" style={{ top: '5px' }}>
          {item.Name}
        </span>
        {
          hasChildren &&
          <b className='collapse-sign'>
            <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} />
          </b>
        }
      </Link>
      {hasChildren && (
        <ul style={{ display: isOpen ? 'block' : 'none' }} className='open-dropdown'>
          {item.children.map((childItem) => (
            <MenuItem key={childItem.SId} item={childItem} openItems={openItems} toggleItem={toggleItem} parentId={item.SId} />
          ))}
        </ul>
      )}
    </li>
  );
};
const MenuListItem = ({ parentMenuItems }) => {
  const [openItems, setOpenItems] = useState({});
  const toggleItem = (parentId, itemId, hasChildren) => {
    setOpenItems((prevOpenItems) => {
      const newOpenItems = { ...prevOpenItems };
      if (prevOpenItems[parentId] === itemId) {
        // If the item is being closed, close all its children
        const closeAllChildren = (id) => {
          Object.keys(newOpenItems).forEach((key) => {
            if (newOpenItems[key] === id) {
              delete newOpenItems[key];
              closeAllChildren(key); // Recursively close all child items
            }
          });
        };
        closeAllChildren(itemId);
      } else {
        // If the item is being opened, just update the state
        newOpenItems[parentId] = itemId;
      }
      return newOpenItems;
    });
  };
  return (
    <ul id="js-nav-menu" className="nav-menu">
      {parentMenuItems.map((parentItem) => (
        <MenuItem key={parentItem.SId} item={parentItem} openItems={openItems} toggleItem={toggleItem} parentId={0} />
      ))}
    </ul>
  );
};
export default MenuListItem;
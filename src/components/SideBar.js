import React from "react";
import motiLogo from "../assets/images/user_assets/logo.png";
import MenuListItem from "./MenuListItem";
import { decryptData, secret_key } from "../config/service";
// import { useSelector } from "react-redux";

const SideBar = () => {
  const organizedMenu = {};

  // const menuList= useSelector((store)=>store.menulist);
  // let data= menuList[0]?.Description?.Table2;

  // const encryptedUserData = JSON.parse(sessionStorage.getItem("menuList"));
  const encryptedUserData = JSON.parse(sessionStorage.getItem("bWVudUxpc3Q="));
  const data = decryptData(encryptedUserData, secret_key);

  function buildHierarchy(data) {
    let map = {}, node, roots = [];
    // Create a map of nodes
    data.forEach(item => {
      map[item.SId] = { ...item, children: [] };
    });

    data.forEach(item => {
      node = map[item.SId];
      if (item.ParentId !== 0) {
        if (map[item.ParentId]) {
          map[item.ParentId].children.push(node);
        }
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  const hierarchicalData = buildHierarchy(data);


  return (
    <>
      <aside className="page-sidebar " >
        <div className="page-logo">
          {/* <a
            href="#"
            className="page-logo-link press-scale-down d-flex align-items-center position-relative"
            data-toggle="modal"
            data-target="#modal-shortcut"
          > */}
          <img src={motiLogo} alt="Motilal Oswal" aria-roledescription="logo" />
          <span className="page-logo-text mr-1">CFO Portal</span>
          {/* </a> */}
        </div>
        {/* BEGIN PRIMARY NAVIGATION   */}
        <nav id="js-primary-nav" className="primary-nav" role="navigation" >
          {/* <div className="nav-filter">
            <div className="position-relative">
              <input
                type="text"
                id="nav_filter_input"
                placeholder="Filter menu"
                className="form-control"
                tabIndex="0"
              />
              
            </div>
          </div> */}

          {/* Menu will be added here  */}
          <MenuListItem parentMenuItems={hierarchicalData} />
          <span id="lblMenuId" hidden style={{ display: "none" }}>
            mnuC002001
          </span>
          <span id="lblParentMenuId" hidden style={{ display: "none" }}></span>
        </nav>
        {/* END PRIMARY NAVIGATION   */}
      </aside>
    </>
  );
};

export default SideBar;

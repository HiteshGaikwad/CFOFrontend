import React, { useMemo, useState } from "react";
import motiLogo from "../assets/images/user_assets/logo.png";
import avtar from "../assets/images/user_assets/default_avatar.png";
import { Link } from "react-router-dom";
import {
  getUserDataFromStorage,
  removeDataFromStorage,
} from "../config/service";
import { useModal } from "../config/modalContext";
import { urlPath } from "../config/url";
import { useMenu } from "../config/menuContext";

const Header = () => {
  const { isModalOpen, openModal } = useModal();
  const { isMenuOpen, openMenu, closeMenu } = useMenu()

  const userData = getUserDataFromStorage();
  const arr = userData?.FullName?.split(' ');
  function handleMenu() {
    try {
      if (isMenuOpen) {
        closeMenu()
      } else {
        openMenu()
      }
    } catch (error) {

    }
  }
  return (
    <>
      <header className="page-header" role="banner">
        {/* we need this logo when user switches to nav-function-top  */}
        <div className="page-logo">
          <Link
            to="#"
            className="page-logo-link press-scale-down d-flex align-items-center position-relative"
            data-toggle="modal"
            data-target="#modal-shortcut"
          >
            <img
              src={"/BondUI" + motiLogo}
              alt="Motilal Oswal"
              aria-roledescription="logo"
            />
            <span className="page-logo-text mr-1">CFO Portal</span>
          </Link>
        </div>
        {/* DOC: mobile button appears during mobile width  */}
        <div className="hidden-lg-up">
          <Link
            to="#"
            className="btn btn-primary press-scale-down"
            dataaction="toggle"
            dataclassname="mobile-nav-on"
          >
            <i className="ni ni-menu"></i>
          </Link>
        </div>
        <div className="search" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
          <button onClick={() => { handleMenu() }} style={{ border: 'none' }}>
            <i className="fa-solid fa-bars" style={{ fontSize: '20px', }}></i></button>
          <span className="page-logo-text mr-1" style={{ color: "#000000" }}>
            CFO Portal
          </span>
        </div>
        <div className="search"></div>
        <div className="ml-auto d-flex">
          {/* app user menu  */}
          <div>
            <Link
              to="#"
              data-toggle="dropdown"
              // title="User Photo"
              className="header-icon d-flex align-items-center justify-content-center ml-2"
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#EB6400",
                  cursor: "pointer",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontWeight: "600px" }}>{arr.length > 0 ? arr[0][0] : ''}{arr.length >= 1 ? arr[arr.length - 1][0] : ''}</span>
              </div>
            </Link>

            <div className="dropdown-menu dropdown-menu-animated dropdown-lg">
              <div className="dropdown-header bg-trans-gradient d-flex flex-row py-4 rounded-top">
                <div className="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                  <span className="mr-2">
                    <img
                      // src={"/BondUI" + avtar}
                      src={avtar}
                      className="rounded-circle profile-image"
                      alt="User"
                    />

                    {/* <span className="rounded-circle profile-image bg-secondary fw-bold">VP</span> */}
                  </span>
                  <div className="info-card-text">
                    <div
                      id="lblUserName"
                      className="fs-lg text-truncate text-truncate-lg"
                    >
                      {userData?.FullName}
                    </div>
                    <span
                      id="lblUserRole"
                      className="text-truncate text-truncate-md opacity-80"
                    >
                      {userData?.LoginId}
                    </span>
                  </div>
                </div>
              </div>
              <div className="dropdown-divider m-0"></div>
              {/* <Link
                to="#"
                className="dropdown-item"
                data-action="app-fullscreen"
              >
                <span>Fullscreen</span>
                <i className="float-right text-muted fw-n">F11</i>
              </Link> */}
              <div className="dropdown-divider m-0"></div>
              {userData.IsEmployee !== 1 && (
                <span
                  onClick={() => {
                    openModal();
                  }}
                >
                  <Link className="dropdown-item" to="#">
                    Change Password
                  </Link>
                </span>
              )}
              <div className="dropdown-divider m-0"></div>
              <span onClick={() => removeDataFromStorage()}>
                <Link className="dropdown-item" to={urlPath}>
                  Logout
                </Link>
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

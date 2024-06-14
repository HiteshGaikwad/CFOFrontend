import React, { useEffect, useState } from "react";

import SideBar from "./SideBar";
import Header from "./Header";
import DatePicker from "react-datepicker";

import { Link, Outlet, useNavigate } from "react-router-dom";
import Modal from "../config/Modal";
import { useModal } from "../config/modalContext";
import Footer from "./Footer";
import { useUpload } from "../config/contextAPI/uploadModalContext";
import UploadModal from "../config/contextAPI/UploadModal";
import { useMenu } from "../config/menuContext";
import { useCompany } from "../config/contextAPI/companyContext";
import CompanyModal from "../config/contextAPI/CompanyModal";

const Home = () => {
  const defaultDate = new Date();
  const navigate = useNavigate();
  const { isModalOpen } = useModal();
  const { isUploadOpen } = useUpload();
  const { isMenuOpen } = useMenu()
  const { isCompanyOpen } = useCompany()

  const [addClass, setAddClass] = useState(false);

  return (
    <>
      {/* desktop chrome webkit blur  pace-running */}
      <div className={isMenuOpen ? 'nav-function-hidden' : ''} >
        <div className="page-wrapper">
          <div className="page-inner">
            {/* BEGIN Left Aside  */}
            <SideBar />
            {/* END Left Aside  */}
            <div className="page-content-wrapper">
              {/* BEGIN Page Header  */}
              <Header />
              {/* <!-- END Page Header -->
                <!-- BEGIN Page Content -->
                <!-- the #js-page-content id is needed for some plugins to initialize --> */}
              <main id="js-page-content" role="main" className="page-content">
                <Outlet />
                {isModalOpen && <Modal />}
                {
                  isUploadOpen && <UploadModal />
                }
                {
                  isCompanyOpen && <CompanyModal />
                }
              </main>
              {/* this overlay is activated only when mobile menu is triggered */}
              <div
                className="page-content-overlay"
                data-action="toggle"
                dataclassnamee="mobile-nav-on"
              ></div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;

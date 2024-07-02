import React from "react";
import { Link } from "react-router-dom/dist";

const Footer = () => {
  let year = new Date();
  return (
    <footer b-plww7kkrdh="" className="page-footer" role="contentinfo">
      <div
        b-plww7kkrdh=""
        className="d-flex align-items-center flex-1 text-muted"
        style={{ justifyContent: "center" }}
      >
        <span b-plww7kkrdh="" className="hidden-md-down fw-700">
          {" "}
          {year.getFullYear()} © CFO Portal by&nbsp;
          <span className="text-decoration">
            <Link
              b-plww7kkrdh=""
              to="https://we3.tech"
              className="opacity-40 fw-500"
              title="We3.Tech"
              target="_blank"
            >
              We3 Tech Works
            </Link>
          </span>
        </span>
      </div>
      <div b-plww7kkrdh=""></div>
    </footer>
  );
};

export default Footer;

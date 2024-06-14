import React from "react";
import { useNavigate } from "react-router-dom";
import { urlPath } from "../config/url";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>404- Page not found...</h1>
      <button
        type="button"
        className="btn btn-sm btn-primary text-white mr-2"
        id="btn_Save"
        onClick={() => navigate(`${urlPath}Home`)}
      >
        Home
      </button>
    </div>
  );
};

export default Error;

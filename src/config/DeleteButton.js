import React from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import Swal from "sweetalert2";
import "../App.css";

const DeleteButton = ({ onDelete }) => {
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      customClass: {
        popup: "small-alert",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
        Swal.fire({
          title: "Deleted!",
          text: "Your data has been successfully deleted.",
          icon: "success",
          customClass: {
            popup: "small-alert",
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Your data remains safe.",
          icon: "info",
          customClass: {
            popup: "small-alert",
          },
        });
      }
    });
    setTimeout(() => {
      Swal.close();
    }, 5000);
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        border: "none",
        height: "38px",
        backgroundColor: "transparent",
        width: "38px",
        borderRadius: "18px",
        marginRight: "20px",
      }}
      title="Delete"
    >
      <RiDeleteBin2Line
        style={{
          color: "#EB6400",
          fontSize: "18px",
        }}
      />
    </button>
  );
};

export default DeleteButton;

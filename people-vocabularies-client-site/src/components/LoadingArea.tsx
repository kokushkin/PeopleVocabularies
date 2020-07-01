import React from "react";
import "bootstrap";

export const LoadingArea = () => (
  <div className="container mt-5">
    {Array.from(Array(10).keys()).map(() => (
      <div className="d-flex flex-row justify-content-between m-5 bd-highlight">
        <div className="spinner-grow text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="spinner-grow text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ))}
  </div>
);

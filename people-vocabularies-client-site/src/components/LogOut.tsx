import React from "react";

interface ILogOut {
  user: any;
  onLogout: () => void;
}

export const LogOut = ({ onLogout, user }: ILogOut) => {
  return (
    <form className="form-inline">
      <label className="mr-2">Hello, {user.username}</label>
      <button
        className="btn btn-outline-warning"
        type="button"
        onClick={onLogout}
      >
        Logout
      </button>
    </form>
  );
};

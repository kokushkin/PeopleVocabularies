import React from "react";
import { useLoggedInUser } from "../hooks/useLoggedInUser";

export const LogOut = () => {
    let {user, logOut} = useLoggedInUser();
    return (
    <>           
    {user &&
        <form className="form-inline">
        <label className="mr-2">Hello, {user.username}</label>
        <button
          className="btn btn-outline-warning"
          type="button"
          onClick={logOut}
        >
          Logout
        </button>
      </form>            
      }
    </>)
}
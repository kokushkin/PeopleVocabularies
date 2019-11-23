import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
export function useLoggedInUser() {
  let [user, setUser] = useState(undefined);

  return { user, 

    logOut: async () =>  {
      await Auth.signOut();
      setUser(null);      
    }, 

    getUser: async () => {
      const user = await Auth.currentUserInfo();
      setUser(user);
    }}}

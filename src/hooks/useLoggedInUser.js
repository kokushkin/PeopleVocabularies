import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
export function useLoggedInUser() {
  let [user, setUser] = useState(undefined);

  return { user, 
    
    logOut: () => Auth.signOut().then(res =>
    Auth.currentUserInfo().then(user => setUser(user))), 

    getUser: () => Auth.currentUserInfo().then(user => setUser(user))};
}

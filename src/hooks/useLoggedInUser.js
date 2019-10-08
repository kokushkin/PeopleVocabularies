import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
export function useLoggedInUser() {
  //get user info
  let [askedToLogOut, setAskedToLogOut] = useState(false);
  useEffect(() => {
    if (askedToLogOut) {
      Auth.authCallbacks()
      const logOutUser = async () => {
        await Auth.signOut();
        setAskedToLogOut(false);
      };
      logOutUser();
    }
  }, [askedToLogOut]);
  let [user, setUser] = useState(undefined);
  useEffect(() => {
    let didCancel = false;
    const fetchUser = async () => {
      const user = await Auth.currentUserInfo();
      if (!didCancel) {
        setUser(user);
      }
    };
    fetchUser();
    return () => { didCancel = true; };
  }, [askedToLogOut]);
  return { user, logOut: () => setAskedToLogOut(true) };
}

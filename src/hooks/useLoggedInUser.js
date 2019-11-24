import { useState, useEffect, useCallback } from "react";
import { Auth } from "aws-amplify";
export function useLoggedInUser() {
  let [user, setUser] = useState(undefined);

  const logOut = useCallback(async () => {
    await Auth.signOut();
    setUser(null);
  }, []);

  const getUser = useCallback(async () => {
    const user = await Auth.currentUserInfo();
    setUser(user);
  }, []);

  return { user, logOut, getUser}};

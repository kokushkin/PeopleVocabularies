import { useState, useCallback } from "react";
import { Auth } from "aws-amplify";

export function useLoggedInUser() {
  let [user, setUser] = useState<any>(undefined);

  const logOut = useCallback(async () => {
    await Auth.signOut();
    setUser(undefined);
  }, []);

  const getUser = useCallback(async () => {
    const user = await Auth.currentUserInfo();
    setUser(user);
  }, []);

  return { user, logOut, getUser };
}

import { useState } from "react";
import SignIn from "../sign-in/sign-in";
import SignUp from "../sign-up/sign-up";

const Auth = () => {
  const [tab, setTab] = useState("sign-in");
  return (
    <>
      {tab === "sign-in" && <SignIn setTab={setTab} />}
      {tab === "sign-up" && <SignUp setTab={setTab} />}
    </>
  );
};

export default Auth;

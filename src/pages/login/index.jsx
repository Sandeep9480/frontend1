import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { userlogin, userRegistration } from "@/config/reudx/action/authAction";
import { emptyMessage } from "@/config/reudx/reducer/authReducer";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [username, SetUsername] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [userLoginMethod, setUserLoginMethod] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = () => {
    dispatch(userRegistration({ name, email, password, username }));
    router.push("/login");
  };

  const handleLogin = () => {
    dispatch(userlogin({ email, password }));
  };
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainerLeft}>
            <p className={styles.cardLeftHeading}>
              {userLoginMethod ? "Sign In " : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message.message}
            </p>
            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Username"
                    onChange={(e) => SetUsername(e.target.value)}
                  />
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <input
                type="text"
                className={styles.inputField}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                className={styles.inputField}
                placeholder="Password"
                onChange={(e) => SetPassword(e.target.value)}
              />
              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.button}
              >
                {userLoginMethod ? "Sign In " : "Sign Up"}
              </div>
            </div>
          </div>

          <div className={styles.cardContainerRight}>
            {!userLoginMethod ? (
              <p>Already Have An Account</p>
            ) : (
              <p>Dont Have An Account</p>
            )}
            <div
              onClick={() => setUserLoginMethod(!userLoginMethod)}
              className={styles.button}
            >
              {userLoginMethod ? "Sign Up " : "Sign In"}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;

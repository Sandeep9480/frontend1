import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/reudx/reducer/authReducer";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  return (
    <div>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <h1
            className={styles.navLogo}
            onClick={() => {
              router.push("/");
            }}
          >
            Pro Connect
          </h1>

          {authState.profileFetched && (
            <div style={{ display: "flex", gap: "1.2rem" }}>
              {" "}
              <p
                onClick={() => {
                  router.push("/profile");
                }}
                style={{ fontWeight: "bold", cursor: "pointer" }}
              >
                Profile
              </p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispatch(reset());
                }}
              >
                Logout
              </p>
            </div>
          )}
          {!authState.profileFetched && (
            <div className={styles.navBarOptionContainer}>
              <p
                onClick={() => {
                  router.push("/login");
                }}
                className={styles.buttonJoin}
              >
                <span>Be A Part</span>
              </p>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

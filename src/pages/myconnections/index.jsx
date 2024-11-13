import { BASE_URL } from "@/config";
import {
  acceptConnection,
  getMyConnectionRequest,
} from "@/config/reudx/action/authAction";
import DashboardLayout from "@/layout/DashbordLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

const MyConnections = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (
      authState.connectionRequest &&
      authState.connectionRequest.length != 0
    ) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          <h4>My connections</h4>
          {authState.connectionRequest.length === 0 && <h2>Pending</h2>}
          {authState.connectionRequest.length != 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted === null)
              .map((user, index) => (
                <div
                  onClick={() => {
                    router.push(`viewProfile/${user.userId.username}`);
                  }}
                  className={styles.userCard}
                  key={index}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  ></div>
                  <div className={styles.profilePicture}>
                    <img
                      src={`${BASE_URL}/${user.userId.profilePicture}`}
                      alt=""
                    />
                  </div>
                  <div classname={styles.userinfo}>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <h3>@{user.userId.username}</h3>
                    </div>
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            acceptConnection({
                              token: localStorage.getItem("token"),
                              connectionId: user._id,
                              action: "accept",
                            })
                          );
                        }}
                        className={styles.connectedBtn}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          <h4>My Network</h4>
          {authState.connectionRequest
            .filter((connection) => connection.status_accepted !== null)
            .map((user, index) => (
              <div
                onClick={() => {
                  router.push(`viewProfile/${user.userId.username}`);
                }}
                className={styles.userCard}
                key={index}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                ></div>
                <div className={styles.profilePicture}>
                  <img
                    src={`${BASE_URL}/${user.userId.profilePicture}`}
                    alt=""
                  />
                </div>
                <div className={styles.userInfo}>
                  <h3>{user.userId.name}</h3>
                  <h3>@{user.userId.username}</h3>
                </div>
              </div>
            ))}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
};

export default MyConnections;

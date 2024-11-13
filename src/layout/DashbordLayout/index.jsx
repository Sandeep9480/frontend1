import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/reudx/action/postAction";
import { getAboutUser, getAllUsers } from "@/config/reudx/action/authAction";
import { BASE_URL } from "@/config";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (authState.tokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    if (!authState.all_users_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.tokenThere]);

  // Filter out null or invalid users first
  const filteredUsers = authState.all_users?.filter(
    (user) => user !== null && user.userId !== null
  );

  return (
    <div className={styles.container}>
      <div className={styles.homeContainer}>
        {/* Left Sidebar */}
        <div className={styles.homeContainerLeft}>
          <div
            className={styles.slidBarOption}
            onClick={() => router.push("/dashboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <p>Scroll</p>
          </div>
          <div
            className={styles.slidBarOption}
            onClick={() => router.push("/discover")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <p>Discover</p>
          </div>
          <div
            className={styles.slidBarOption}
            onClick={() => router.push("/myconnections")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <p>Connections</p>
          </div>
        </div>

        {/* Feed Container */}
        <div className={styles.feedContainer}>{children}</div>

        {/* Extra Container for Top Profiles */}
        <div className={styles.extraContainer}>
          <h3>Top Profiles</h3>

          {/* Display filtered users */}
          {filteredUsers &&
            filteredUsers.map((user) => {
              const profilePicture = user.userId.profilePicture
                ? `${BASE_URL}/${user.userId.profilePicture}`
                : "/path/to/default/profile/pic"; // Replace with a default image path

              return (
                <div
                  key={user._id}
                  onClick={() => {
                    router.push(`/viewProfile/${user.userId.username}`);
                  }}
                  className={styles.profile}
                >
                  <img
                    src={profilePicture}
                    alt={`${user.userId.name}'s profile picture`}
                  />
                  <div>
                    <h4>{user.userId.name}</h4>
                    <p>@{user.userId.username}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className={styles.mobileNavbar}>
          <div onClick={() => router.push("/dashboard")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <div onClick={() => router.push("/discover")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <div onClick={() => router.push("/myconnections")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

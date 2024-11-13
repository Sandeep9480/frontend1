import { getAllUsers } from "@/config/reudx/action/authAction";
import DashboardLayout from "@/layout/DashbordLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./../../config/index";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

function index() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!authState.all_users_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Discover</h1>
        </div>
        <div className={styles.allUserProfile}>
          {authState.all_users_fetched &&
            authState.all_users
              .filter((user) => user !== null && user.userId !== null) // Filter out null users
              .map((user) => (
                <div
                  onClick={() => {
                    router.push(`/viewProfile/${user.userId.username}`);
                  }}
                  key={user._id}
                  className={styles.profile}
                >
                  <img
                    src={`${BASE_URL}/${user.userId.profilePicture}`} // Assuming `userId` has the profile picture field
                    alt={`${user.userId.name}'s profile picture`}
                  />
                  <div>
                    <h1>{user.userId.name}</h1>
                    <p>{user.userId.email}</p>
                  </div>
                </div>
              ))}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default index;

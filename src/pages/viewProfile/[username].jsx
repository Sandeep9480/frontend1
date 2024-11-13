import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashbordLayout";
import UserLayout from "@/layout/userLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/reudx/action/postAction";
import {
  getConnectionRequest,
  getMyConnectionRequest,
  sendConnectionRequest,
} from "@/config/reudx/action/authAction";
import { useRouter } from "next/router";

const viewProfilePage = ({ userProfile }) => {
  const searchParams = useSearchParams();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const router = useRouter();

  const [userPost, setUserPost] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  userProfile.pastWork.map((work) => {
    console.log("hello");
  });

  // Fetch posts and connection data
  const getUserPost = async () => {
    dispatch(getAllPosts());
    dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
    dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
  };

  useEffect(() => {
    if (postState.posts && router.query.username) {
      const filteredPosts = postState.posts.filter(
        (post) => post.userId.username === router.query.username
      );
      setUserPost(filteredPosts);
    }
  }, [postState.posts, router.query.username]);

  // Only dispatch getUserPost once on mount
  useEffect(() => {
    getUserPost();
  }, [dispatch]);

  // Filter posts for the specific user
  useEffect(() => {
    if (postState.posts && router.query.username) {
      const filteredPosts = postState.posts.filter(
        (post) => post.userId.username === router.query.username
      );
      setUserPost(filteredPosts);
    }
  }, [postState.posts, router.query.username]);

  // Check if the user is already connected
  useEffect(() => {
    authState.connections.some((user) => {
      if (user.connectionId === userProfile.userId._id) {
        setIsCurrentUserInConnection(true);
        if (
          authState.connections.find(
            (user) => user.connectionId === userProfile.userId._id
          ).status_accepted === true
        ) {
          setIsConnectionNull(false);
        }
      }
    });
    authState.connectionRequest.some((user) => {
      if (user.userId._id === userProfile.userId._id) {
        setIsCurrentUserInConnection(true);
        if (
          authState.connectionRequest.find(
            (user) => user.userId._id === userProfile.userId._id
          ).status_accepted === true
        ) {
          setIsConnectionNull(false);
        }
      }
    });
  }, [
    authState.connections,
    userProfile.userId._id,
    authState.connectionRequest,
  ]);

  // Handle the "Connect" button click
  const handleConnectionRequest = async () => {
    await dispatch(
      sendConnectionRequest({
        token: localStorage.getItem("token"),
        user_id: userProfile.userId._id,
      })
    );
    // After sending the connection, refetch the connections to update the state
    dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>
          <div className={styles.profileDetails}>
            <div className={styles.profileDetailsFlex}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "gray" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedBtn}>
                      {isConnectionNull ? "Pending.." : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleConnectionRequest();
                        // setIsCurrentUserInConnection(true);
                      }}
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/download_resume?id=${userProfile.userId._id}`
                      );
                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank"
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                      style={{ width: "1.2rem" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                <div style={{ lineHeight: "2rem" }}>{userProfile.bio}</div>
              </div>
              <div className={styles.recentPosts} style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPost.length > 0 ? (
                  userPost.map((post) => (
                    <div key={post._id} className={styles.postCard}>
                      <div
                        className={styles.card}
                        style={{
                          display: "flex",
                          gap: "1.5rem",
                          marginTop: "5%",
                        }}
                      >
                        <div className={styles.cardProfileContainer}>
                          {post.media ? (
                            <img src={`${BASE_URL}/${post.media}`} alt="" />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No posts available</p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.workhistory}>
            <h4>Work History</h4>

            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workhistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
};

// Fetch user profile based on username
export async function getServerSideProps(context) {
  try {
    const response = await clientServer.get(
      "/get_user_profile_based_on_username",
      {
        params: {
          username: context.query.username,
        },
      }
    );

    return {
      props: {
        userProfile: response.data.profile,
      },
    };
  } catch (error) {
    return {
      notFound: true, // Return 404 if user is not found
    };
  }
}

export default viewProfilePage;

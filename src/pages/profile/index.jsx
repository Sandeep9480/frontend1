import { getAboutUser } from "@/config/reudx/action/authAction";
import DashboardLayout from "@/layout/DashbordLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import UserLayout from "@/layout/userLayout";
import { BASE_URL, clientServer } from "@/config";
import { getAllPosts } from "@/config/reudx/action/postAction";

const ProfilePage = () => {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModelOpen, setisModelOpen] = useState(false);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user);
    }
  }, [authState.user]);

  useEffect(() => {
    if (authState.user != undefined) {
      if (postState.posts && authState.user.userId.username) {
        const filteredPosts = postState.posts.filter(
          (post) => post.userId.username === authState.user.userId.username
        );
        console.log(filteredPosts);
        setUserPosts(filteredPosts);
      }
    }
  }, [postState.posts]);

  // Ensure userProfile and userProfile.userId are available before rendering
  if (!userProfile || !userProfile.userId) {
    return <div>Loading...</div>; // You can replace this with a more styled loading state
  }

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("token", localStorage.getItem("token"));
    const reponse = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfile = async () => {
    const request = clientServer.post("/update_user", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const reponse = clientServer.post("/update_user_profile", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };
  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  console.log(userProfile.pastWork);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <label htmlFor="uploadProfilePicture" className={styles.backDrop}>
              <p>Edit</p>
            </label>
            <input
              onChange={(e) => {
                updateProfilePicture(e.target.files[0]);
              }}
              hidden
              type="file"
              id="uploadProfilePicture"
            />
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="Profile Background"
            />
          </div>
          <div className={styles.profileDetails}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <input
                    className={styles.nameEdit}
                    type="text"
                    value={userProfile.userId.name}
                    onChange={(e) => {
                      setUserProfile({
                        ...userProfile,
                        userId: {
                          ...userProfile.userId,
                          name: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  <p style={{ color: "gray" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                <textarea
                  value={userProfile.bio}
                  onChange={(e) => {
                    setUserProfile({ ...userProfile, bio: e.target.value });
                  }}
                  rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                  name=""
                  id=""
                  style={{ width: "100%" }}
                />
              </div>

              <div className={styles.recentPosts} style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
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
              {userProfile.pastWork && userProfile.pastWork.length > 0 ? (
                userProfile.pastWork.map((work, index) => (
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
                ))
              ) : (
                <p>No work history available</p>
              )}

              <button
                onClick={() => {
                  setisModelOpen(true);
                }}
                className={styles.addWorkBtn}
              >
                Add Work
              </button>
            </div>
          </div>
          {userProfile != authState.user && (
            <div
              onClick={() => {
                console.log("hello");
                updateProfile();
              }}
              className={styles.connectionBtn}
            >
              Update Profile
            </div>
          )}
        </div>
        {isModelOpen && (
          <div
            onClick={() => {
              // dispatch(resetPostId());
              setisModelOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              {" "}
              <input
                type="text"
                className={styles.inputField}
                placeholder="Enter Company"
                onChange={(e) => handleWorkInputChange(e)}
                name="company"
              />
              <input
                type="text"
                className={styles.inputField}
                placeholder="Enter Position"
                onChange={(e) => handleWorkInputChange(e)}
                name="position"
              />
              <input
                type="number"
                className={styles.inputField}
                placeholder="Year"
                onChange={(e) => handleWorkInputChange(e)}
                name="years"
              />
              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, inputData],
                  });
                  setisModelOpen(false);
                }}
                className={styles.connectionBtn}
              >
                Add Work
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
};

export default ProfilePage;

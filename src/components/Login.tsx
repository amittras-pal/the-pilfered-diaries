import { Button, Menu } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Books,
  BrandGoogle,
  Check,
  Logout,
  User,
  UserCheck,
  X,
} from "tabler-icons-react";
import { auth } from "../config/firebase.config";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  const { openConfirmModal, closeAll } = useModals();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { currentUser } = useAuth();

  const loginUser = () => {
    setAuthenticating(true);
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((res) => {
        showNotification({
          title: `Welcome ${res.user.displayName}`,
          message: "Your login was successful",
          icon: <Check />,
          color: "green",
        });
      })
      .catch(({ code }) => {
        if (code === "auth/popup-closed-by-user") {
          showNotification({
            title: "Sign In Cancelled",
            message: "You cancelled the sign in",
            icon: <X />,
            color: "red",
          });
        }
      })
      .finally(() => {
        setAuthenticating(false);
      });
  };

  const logoutUser = () => {
    openConfirmModal({
      title: "Are you sure you want to logout?",
      labels: { confirm: "Logout", cancel: "Cancel" },
      centered: true,
      withCloseButton: false,
      confirmProps: {
        leftIcon: <Logout />,
        color: "red",
        size: "xs",
      },
      cancelProps: {
        size: "xs",
        leftIcon: <X />,
        variant: "light",
        color: "gray",
      },
      onCancel: closeAll,
      onConfirm: () => {
        signOut(auth).then((res) => {
          showNotification({
            title: "Logged out.",
            message: "See you next time!!",
            icon: <Check />,
            color: "green",
          });
          navigate("/");
        });
      },
    });
  };

  return (
    <>
      {!currentUser ? (
        <Menu
          control={
            <Button size="xs" color="orange" loading={authenticating}>
              {authenticating ? "Signing In" : "Sign In"}
            </Button>
          }>
          <Menu.Item icon={<BrandGoogle size={18} />} onClick={loginUser}>
            Sign In With Google
          </Menu.Item>
        </Menu>
      ) : (
        <Menu
          control={
            <Button leftIcon={<UserCheck size={18} />} size="xs" color="blue">
              My Account
            </Button>
          }>
          <Menu.Item
            color={pathname === "/bookshelf" ? "blue" : "gray"}
            icon={<Books size={14} />}>
            My Bookshelf
          </Menu.Item>
          <Menu.Item
            color={pathname === "/profile" ? "blue" : "gray"}
            icon={<User size={14} />}
            onClick={() => navigate("/profile")}>
            My Account
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<Logout size={14} />}
            onClick={logoutUser}>
            Sign Out
          </Menu.Item>
        </Menu>
      )}
    </>
  );
}

export default Login;

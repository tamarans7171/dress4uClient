import { Outlet, useNavigate } from "react-router-dom";
import * as React from "react";
import { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import WomanIcon from "@mui/icons-material/Woman";
import { connect } from "react-redux";
import logo from "./logo.png";
import { useState } from "react";
// import "./navBar.css";
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function mapStateToProps(state) {
  console.log(state);
  return {
    user: state.User.user,
  };
}

export default connect(mapStateToProps)(function NavBar(props) {
  // state to style
  const [background, setBackground] = React.useState("#444444");
  const [color, setColor] = React.useState("white");
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user } = props;
  const navigate = useNavigate();
  
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    if (user.email == "managerdress@gmail.com") {
      navigate("/permitDresses");
    } else {
      navigate("/allProducts");
    }
  }, []);

  // console.log(user.email == "managerdress@gmail.com");
  function enterNav() {
    setBackground("white");
    setColor("#b74160");
  }

  function leaveNav() {
    setColor("white");
    setBackground("#b74160");
  }

  return (
    <>
      <AppBar
        className="navBar"
        backgroundcolor={background}
        position="static"
        onMouseEnter={enterNav}
        onMouseLeave={leaveNav}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Tooltip className="iconUser" title="Open settings">
              <IconButton
                className="innerIconUser"
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                {user.firstName
                  ? user.firstName &&
                    user.firstName.charAt(0) + user.lastName.charAt(0)
                  : "?"}
              </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem
                  onClick={(e) => {
                    handleCloseNavMenu(e);
                    navigate("/login");
                  }}
                >
                  <Typography textAlign="center">
                    {user._id == undefined ? "התחברות" : " החלף משתמש"}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    handleCloseNavMenu(e);
                    navigate("/allProducts");
                  }}
                >
                  <Typography textAlign="center">שמלות</Typography>
                </MenuItem>
                {user._id == "6448ed451b08bcbc87b62b2f" ? (
                  <div>
                    {" "}
                    <MenuItem
                      onClick={(e) => {
                        handleCloseNavMenu(e);
                        navigate("/permitDresses");
                      }}
                    >
                      <Typography textAlign="center">אישור תמונות</Typography>
                    </MenuItem>
                    {/* <MenuItem
                      onClick={(e) => {
                        handleCloseNavMenu(e);
                        navigate("/userPayments");
                      }}
                    >
                      <Typography textAlign="center">תשלומים</Typography>
                    </MenuItem> */}
                    <MenuItem
                      onClick={(e) => {
                        handleCloseNavMenu(e);
                        navigate("/users");
                      }}
                    >
                      <Typography textAlign="center">משתמשים</Typography>
                    </MenuItem>
                  </div>
                ) : (
                  <MenuItem
                    onClick={(e) => {
                      handleCloseNavMenu(e);
                      navigate("/addDress");
                    }}
                  >
                    <Typography textAlign="center">פרסום שמלה</Typography>
                  </MenuItem>
                )}

                {/* <MenuItem  onClick={(e)=>{handleCloseNavMenu(e);navigate("/subscription")}}>
                  <Typography textAlign="center">יצירת מנוי</Typography>
                </MenuItem> */}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              DRESS4U
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                className="navBtn"
                onClick={(e) => {
                  handleCloseNavMenu(e);
                  navigate("/login");
                }}
                sx={{
                  my: 2,
                  color: { color },
                  display: "block",
                  mx: 2,
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {user._id == undefined ? "התחברות" : " החלף משתמש"}
              </Button>
              <Button
                className="navBtn"
                onClick={(e) => {
                  handleCloseNavMenu(e);
                  navigate("/allProducts");
                }}
                sx={{
                  my: 2,
                  color: { color },
                  display: "block",
                  mx: 2,
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                שמלות
              </Button>
              {user._id == "6448ed451b08bcbc87b62b2f" ? (
                <>
                  <Button
                    className="navBtn"
                    onClick={(e) => {
                      handleCloseNavMenu(e);
                      navigate("/permitDresses");
                    }}
                    sx={{
                      my: 2,
                      color: { color },
                      display: "block",
                      mx: 2,
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    אישור תמונות
                  </Button>
                  {/* <Button
                    className="navBtn"
                    onClick={(e) => {
                      handleCloseNavMenu(e);
                      navigate("/userPayments");
                    }}
                    sx={{
                      my: 2,
                      color: { color },
                      display: "block",
                      mx: 2,
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    תשלומים{" "}
                  </Button> */}

                  <Button
                    className="navBtn"
                    onClick={(e) => {
                      handleCloseNavMenu(e);
                      navigate("/users");
                    }}
                    sx={{
                      my: 2,
                      color: { color },
                      display: "block",
                      mx: 2,
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    משתמשים{" "}
                  </Button>
                </>
              ) : (
                <Button
                  className="navBtn"
                  onClick={(e) => {
                    handleCloseNavMenu(e);
                    navigate("/addDress");
                  }}
                  sx={{
                    my: 2,
                    color: { color },
                    display: "block",
                    mx: 2,
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  פרסום שמלה
                </Button>
              )}

              {/* <Button className='navBtn'
               
               onClick={(e)=>{handleCloseNavMenu(e);navigate("/subscription")}}
                sx={{ my: 2, color: {color}, display: 'block', mx: 2, fontSize:"20px", fontWeight:"bold" }}
              >
                יצירת מנוי
                              </Button> */}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <img className="logo" src={logo} />
              </Typography>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {user.firstName ? (
                  <MenuItem
                    onClick={(e) => {
                      handleCloseUserMenu(e);
                      navigate("/sonalMenu");
                    }}
                  >
                    <Typography textAlign="center">איזור אישי</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={(e) => {
                      handleCloseUserMenu(e);
                      navigate("/login");
                    }}
                  >
                    <Typography textAlign="center">התחברות</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
});
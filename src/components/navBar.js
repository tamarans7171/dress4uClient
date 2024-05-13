import { Outlet, useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import {AppBar,Box,Toolbar,IconButton,Typography,Menu,Container,Button,Tooltip,MenuItem} from '@mui/material'
import {Menu as MenuIcon,Adb} from '@mui/icons-material'
import { connect } from "react-redux";
import logo from "./logo.png";
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
  const [background, setBackground] = useState("#444444");
  const [color, setColor] = useState("white");
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
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
    if (user.email === "rabi@gmail.com") {
      navigate("/permitDresses");
    } else {
      navigate("/allProducts");
    }
  }, []);

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
                    {user._id === undefined ? "התחברות" : " החלף משתמש"}
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
                {user._id === "649c1c1e565273026e9bcd2d" ? (
                  <div>
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
              </Menu>
            </Box>
            <Adb sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
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
                {user._id === undefined ? "התחברות" : " החלף משתמש"}
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
              {user._id === "649c1c1e565273026e9bcd2d" ? (
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
                    משתמשים
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
                <img className="logo" alt="logo" src={logo} />
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

import { useState, useEffect, forwardRef } from "react";
import React from "react";
import axios from "axios";
import "./loggin.css";
import {
  API_URL,
  doApiGet,
  doApiMethod,
  TOKEN_NAME,
} from "../services/apiService";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { connect, useDispatch } from "react-redux";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
function mapStateToProps(state) {
  console.log(state);
  return {
    user: state.User.user,
    dress: state.Dress.dress,
  };
}
export default connect(mapStateToProps)(function Loggin(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const [seePassword, setSeePassword] = useState(false);
  const { dress } = props;
  let { user } = props;
  // const [openLog, setOpenLog] = React.useState(false);
  // const [openSignUp, setOpenSignUp] = React.useState(false);
  const [logUser, setlogUser] = useState({ email: "", password: "" });
  const [signUpUser, setSignUpUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: {city:"PT", street:"DR", numHouse:27},
    phone: "",
  });
  const [displayMes, setdisplayMes] = useState({
    firstName: "none",
    lastName: "none",
    password: "none",
    phone: "none",
    email: "none",
  });
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [openAlertSignUp, setOpenAlertSignUp] = useState(false);
  const [openAlertLoggin, setOpenAlertLoggin] = useState(false);

  const handleClickSignUp = () => {
    setOpenAlertSignUp(true);
  };
  const handleClickLogin = () => {
    setOpenAlertLoggin(true);
  };

  const handleCloseSignUp = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return;
    // }

    setOpenAlertSignUp(false);
    if (state != null) {
      if (state.state) {
        console.log(state.state);
        navigate("/dress", {
          state: state.state,
        });
      } else {
        navigate(state.navAfter);
      }
    } else if (dress == undefined || dress.color == undefined) {
      navigate("/allProducts");
    } else {
      navigate("/payments", {
        state: { sum: 30, type: "newDress" },
      });
    }
  };
  const handleCloseLoggin = (event, reason) => {
    console.log(state);
    setOpenAlertLoggin(false);
    if (state != null) {
      if (state.state) {
        console.log("hiiii91");
        console.log(state.state);
        navigate("/dress", {
          state: state.state,
        });
      } else {
        console.log("hiiii97");
        navigate(state.navAfter);
      }
    } else if (dress == undefined || dress.color == undefined) {
      console.log("hiiii99");
      navigate("/allProducts");
    } else {
      console.log("hiiii102");
      navigate("/payments", {
        state: { sum: 30, type: "newDress" },
      });
    }
  };

  console.log(dress);
  async function tryLogUser() {
    if (logUser.email == "" || logUser.password == "")
      alert("you have to feel all the areas!!!");
    else {
      let userLogin = {
        email: logUser.email,
        password: logUser.password,
      };
      let url = API_URL + "/users/login";
      try {
        let resp = await doApiMethod(url, "POST", userLogin);
        // לשמור את הטוקן
        localStorage.setItem(TOKEN_NAME, resp.data.token);
        // לשגר לעמוד של רשימת המשתמשים
        let url2 = API_URL + "/users/userInfo";

        try {
          let resp2 = await doApiGet(url2);
          console.log(resp2.data);
          dispatch({ type: "UPDATEUSER", payload: resp2.data });
        } catch (error) {
          alert("סליחה, יש בעיה באתר - תחזור מאוחר יותר");
        }

        handleClickLogin();
      } catch (err) {
        console.log(err.response);
        alert("🖤אחד מהנתונים אינו נכון!");
      }
    }
  }

  function checkValidatePassword(val) {
    if (!val || !(val.length >= "6"))
      setdisplayMes({ ...displayMes, password: "inherit" });
    else setdisplayMes({ ...displayMes, password: "none" });
  }

  function checkValidateEmail(val) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val))
      setdisplayMes({ ...displayMes, email: "inherit" });
    else setdisplayMes({ ...displayMes, email: "none" });
  }

  function checkValidatePhone(val) {
    if (!/^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/.test(val))
      setdisplayMes({ ...displayMes, phone: "inherit" });
    else setdisplayMes({ ...displayMes, phone: "none" });
  }

  async function signUp() {
    if (
      signUpUser.email == "" ||
      signUpUser.password == "" ||
      signUpUser.firstName == "" ||
      signUpUser.lastName == "" ||
      signUpUser.address == "" ||
      signUpUser.phone == ""
    )
      alert("עליך למלא את כל השדות!!!");
    else {
      try {
        let url = API_URL + "/users/addUser";
        let resp = await doApiMethod(url, "POST", signUpUser);
        // לשמור את הטוקן
        let url2 = API_URL + "/users/login";
        try {
          let userInfoToken = {
            email: signUpUser.email,
            password: signUpUser.password,
          };
          let resp2 = await doApiMethod(url2, "POST", userInfoToken);
          // לשמור את הטוקן
          localStorage.setItem(TOKEN_NAME, resp2.data.token);
          // לשגר לעמוד של רשימת המשתמשים
          dispatch({ type: "UPDATEUSER", payload: resp.data });
          handleClickSignUp();
        } catch (err) {
          console.log(err.response);
          alert("🖤שגיאה באתר");
        }
      } catch (err2) {
        alert("בתובת מייל זו קיימת באתר");
      }
    }
  }

  return (
    <div className="loginbody">
      <div className="mainLogin">
        <input
          className="inputLogin"
          type="checkbox"
          id="chk"
          aria-hidden="true"
        />

        <div className="signup">
          <label className="labelLogin" htmlFor="chk" aria-hidden="true">
            הרשמה
          </label>
          <input
            className="inputLogin"
            onChange={(e) =>
              setSignUpUser({ ...signUpUser, firstName: e.target.value })
            }
            type="text"
            name="txt"
            placeholder="שם פרטי"
            required=""
          />
          <input
            className="inputLogin"
            onChange={(e) =>
              setSignUpUser({ ...signUpUser, lastName: e.target.value })
            }
            type="text"
            name="txt"
            placeholder="שם משפחה"
            required=""
          />
          <input
            className="inputLogin"
            onChange={(e) =>
              setSignUpUser({ ...signUpUser, address: e.target.value })
            }
            type="text"
            name="txt"
            placeholder="כתובת"
            required=""
          />
          <input
            className="inputLogin"
            onChange={(e) => {
              checkValidateEmail(e.target.value);
              setSignUpUser({ ...signUpUser, email: e.target.value });
            }}
            type="email"
            name="email"
            placeholder="כתוהבת מייל"
            required=""
          />
          <p
            className="emEr"
            style={{ color: "red", display: displayMes.email }}
          >
            כתובת המייל אינה תקינה
          </p>

          <input
            className="inputLogin"
            onChange={(e) => {
              checkValidatePassword(e.target.value);
              setSignUpUser({ ...signUpUser, password: e.target.value });
            }}
            type={seePassword ? "txt" : "password"}
            name="pswd"
            placeholder="סיסמא"
            required=""
          />
          {/* {!seePassword?<RemoveRedEyeIcon onClick={()=>{setSeePassword(!seePassword)}} className='eye'/>:<VisibilityOffIcon onClick={()=>{setSeePassword(!seePassword)}} className='eye'/>} */}
          <span
            className="pasEr"
            style={{ display: displayMes.password, color: "red" }}
          >
            הסיסמא צריכה להכיל לפחות 6 תוים
          </span>
          <input
            className="inputLogin"
            onChange={(e) => {
              setSignUpUser({ ...signUpUser, phone: e.target.value });
              checkValidatePhone(e.target.value);
            }}
            type="txt"
            name="phone"
            placeholder="טלפון"
            required=""
          />
          <p
            className="phnEr"
            style={{ color: "red", display: displayMes.phone }}
          >
            מספר הטלפון אינו תקין!
          </p>

          <button className="buttonLogin" onClick={signUp}>
            {state && state.endDate != null
              ? "הרשם וצור מנוי"
              : dress == undefined || dress.color == undefined
              ? "הרשם"
              : "הרשם והעלה שמלה"}
          </button>
        </div>

        <div className="login">
          <label className="labelLogin" htmlFor="chk" aria-hidden="true">
            התחברות
          </label>
          <input
            className="inputLogin"
            type="email"
            onChange={(e) => setlogUser({ ...logUser, email: e.target.value })}
            name="email"
            placeholder="מייל"
            required=""
          />
          <input
            className="inputLogin"
            type="password"
            onChange={(e) =>
              setlogUser({ ...logUser, password: e.target.value })
            }
            name="pswd"
            placeholder="סיסמה"
            required=""
          />
          <button className="buttonLogin" onClick={tryLogUser}>
            {state && state.endDate != null
              ? "התחבר וצור מנוי"
              : dress == undefined || dress.color == undefined
              ? "התחבר"
              : "התחבר והעלה שמלה"}
          </button>
        </div>
      </div>

      <Snackbar
        open={openAlertLoggin}
        autoHideDuration={6000}
        onClose={handleCloseLoggin}
      >
        <Alert
          onClose={handleCloseLoggin}
          severity="success"
          sx={{ width: "100%" }}
        >
          התחברת בהצלחה
        </Alert>
      </Snackbar>
      <Snackbar
        open={openAlertSignUp}
        autoHideDuration={6000}
        onClose={handleCloseSignUp}
      >
        <Alert
          onClose={handleCloseSignUp}
          severity="success"
          sx={{ width: "100%" }}
        >
          נרשמת בהצלחה
        </Alert>
      </Snackbar>
      {/* <Box sx={{ width: "100%", display: "inline" }}>
        <Collapse
          style={{
            position: "fixed",
            top: "77px",
            right: "11px",
          }}
          in={openSignUp}
        >
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenSignUp(false);
                  if (state != null) {
                    if(state.state) {
                      console.log(state.state);
                      navigate("/dress", {
                        state: state.state,
                      });
                    } else {

                      navigate(state.navAfter);
                    }
                  } else if (dress.color == undefined) {
                    navigate("/allProducts");
                  } else {
                    navigate("/payments", {
                      state: { sum: 30, type: "newDress" },
                    });
                  }
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            נרשמת בהצלחה!
          </Alert>
        </Collapse>
      </Box>
      <Box sx={{ width: "100%", display: "inline" }}>
        <Collapse
          style={{
            position: "fixed",
            top: "77px",
            right: "11px",
          }}
          in={openLog}
        >
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={async () => {
                  setOpenLog(false);
                  
                  if (state != null) {
                    if(state.state) {
                      console.log(state.state);
                      navigate("/dress", {
                        state: state.state,
                      });
                    } else {

                      navigate(state.navAfter);
                    }
                  } else if (dress.color == undefined) {
                    navigate("/allProducts");
                  } else {
                    navigate("/payments", {
                      state: { sum: 30, type: "newDress" },
                    });
                  }
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            התחברת בהצלחה!
          </Alert>
        </Collapse>
      </Box> */}
    </div>
  );
});

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import "./sonalSubscription.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import FocusTrap from "@mui/base/FocusTrap";
import "react-datepicker/dist/react-datepicker.css";
import date from "date-and-time";
import Fab from "@mui/material/Fab";
import DoneOutline from "@mui/icons-material/DoneOutline";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function mapStateToProps(state) {
  console.log(state);
  return {
    user: state.User.user,
    //   dress: state.Dress.dress
  };
}
export default connect(mapStateToProps)(function SonalSubscription(props) {
  const { user } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cntMonthes, setCntMonthes] = useState(0);
  const [stateOfUser, setStateOfUser] = useState();
  const [endSubscription, setendSubscription] = useState(null);
  useEffect(() => {
    if (user._id == undefined) {
      setOpen(true);
    }

    setStateOfUser(
      user.endDate != undefined
        ? new Date(user.endDate) < new Date()
          ? "renew"
          : "extension"
        : "new"
    );

    // console.log(user.endDate < new Date());
  }, []);

  const [openCnt, setOpenCnt] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);

    
    navigate("/login", {
      state: { navAfter: "/subscription", endDate: endSubscription },
    });
  };

  const handleCloseCancel = () => {
    setOpen(false);
    navigate("/allProducts");
  };

  function addMonthes(cntMonthes) {
    let endDate =
      stateOfUser == "new" || stateOfUser == "renew"
        ? new Date()
        : new Date(user.endDate);
    // console.log(endDate);
    //   endDate.setMonth(endDate.getMonth() + cntMonthes)
    //   var newDate = new Date(endDate.setMonth(endDate.getMonth()+1));
    //   newDate.setFullYear(newDate.getFullYear()-1)
    let d = date.addMonths(endDate, Number(cntMonthes));
    setendSubscription(d);
  }

  async function renewSubscription() {
    if (cntMonthes <= 0) {
      alert("עליך לבחור כמות הגדולה מ-0");
    } else {
      navigate("/payments", {
        state: {
          sum: cntMonthes * 30,
          type: stateOfUser,
          endDate: endSubscription,
        },
      });
    }
  }

  async function newSubscription() {
    user.startDate = new Date();
    user.endDate = new Date();
    user.endDate.setMonth(user.endDate.getMonth() + 1);
    console.log(user);
    navigate("/payments", {
      state: { sum: 30, type: "newSubscription", endDate: endSubscription },
    });

    await axios
      .put("http://localhost:3030/user/updateUser/" + user._id, user)
      .then((res) => {
        console.log(res.data);
        dispatch({ type: "UPDATEUSER", payload: user });
      });
  }
  const [startDate, setStartDate] = useState(new Date());
  const ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));
  function extensionSubscription() {
    console.log("extension");
  }
  function displayDate(date) {
    let newDate = new Date(date);
    return (
      newDate.getDate() +
      "/" +
      (newDate.getMonth() + 1) +
      "/" +
      newDate.getFullYear()
    );
  }
  function displayEndDate() {
    return displayDate(user.endDate);
  }
  return (
    <div>
      <div className="topSubscription">
        <h2>
          המנוי שלנו מאפשר לך לצפות בפרטי ההתקשרות עם משכירי כל השמלות
          המפורסמות באתר למשך תקופת הזמן עליה את משלמת.
          <br />
          כאשר מנוי לחודש הנו בתשלום ₪30 בלבד!
        </h2>
      </div>
      {stateOfUser ? (
        <div className="subscriptions">
          <article className="l-design-widhtSubscription">
            <div className="cardSubscription card--accentSubscription">
              <div className="headSub">
                {" "}
                <h1>
                  {stateOfUser != "new"
                    ? stateOfUser != "renew"
                      ? "עדכון פרטי מנוי"
                      : "חידוש מנוי"
                    : "יצירת מנוי"}
                </h1>
              </div>
              <FocusTrap open={openCnt} disableRestoreFocus disableAutoFocus>
                <Stack
                  style={{ padding: "13px" }}
                  alignItems="center"
                  spacing={2}
                >
                  <h1 className="h1Subscription">
                    {stateOfUser != "extension"
                      ? stateOfUser == "renew"
                        ? "פג תוקף המנוי שלך ב-" + displayEndDate()
                        : "יצירת מנוי חדש"
                      : `תוקף המנוי שלך יפוג ב- ${displayDate(user.endDate)}`}
                  </h1>
                  <div className="card--accentSubscription">
                    <h3>
                      {" "}
                      {stateOfUser == "extension"
                        ? "הכנס את מספר החודשים להארכת המנוי"
                        : "הכנס את מספר החודשים בהם המנוי יהיה תקף"}
                    </h3>
                    <label className="inputSubscription">
                      <input
                        onChange={(e) => {
                          setCntMonthes(e.target.value);
                          addMonthes(e.target.value);
                        }}
                        className="input__fieldSubscription"
                        type="number"
                        placeholder="₪30 עבור חודש מנוי"
                      />
                      <span className="input__labelSubscription">
                        מספר חודשים
                      </span>
                    </label>
                    {endSubscription != null && cntMonthes != 0 ? (
                      <h4>
                        במידה ותמשיך את הפעילות סוף תקופת המנוי שלך תיגמר ב-{" "}
                        {displayDate(endSubscription)}
                      </h4>
                    ) : (
                      ""
                    )}
                    <Fab
                      onClick={() => renewSubscription()}
                      className="buttonSubscription addDressBtn"
                      variant="extended"
                      size="medium"
                      color="secondary"
                      aria-label="add"
                    >
                      לתשלום {cntMonthes * 30} ₪
                    </Fab>
                  </div>
                </Stack>
              </FocusTrap>
            </div>
          </article>
        </div>
      ) : (
        "Loading"
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseCancel}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"הנך מתבקש להתחבר למערכת על מנת ליצור מנוי"}</DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>התחבר</Button>
          <Button onClick={handleCloseCancel}>ביטול</Button>
        </DialogActions>
      </Dialog>
    
    </div>
  );
});

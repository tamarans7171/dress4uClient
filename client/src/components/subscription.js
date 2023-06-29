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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import FocusTrap from "@mui/base/FocusTrap";
import "react-datepicker/dist/react-datepicker.css";
import date from "date-and-time";
// import "./subscription.css"

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
export default connect(mapStateToProps)(function Subscription(props) {
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

    console.log(user.endDate < new Date());
  }, []);

  const [openCnt, setOpenCnt] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

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
      .put("http://localhost:3003/user/updateUser/" + user._id, user)
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
    let newDate = new Date(date)
    return newDate.getDate() +"/"+(newDate.getMonth() + 1) + "/" + newDate.getFullYear()
  }
  function displayEndDate() {
    return displayDate(user.endDate)
  }
  return (
    <div>
      {stateOfUser ? (
        <div className="subscriptions">
          <article className="l-design-widhtSubscription">
            <h1 className="h1Subscription">המנויים שלנו</h1>
            <div className="cardSubscription card--accentSubscription">
             <div className="headSub"> <h1>
                {stateOfUser != "new"
                  ? stateOfUser != "renew"
                    ? "הארכת מנוי קיים"
                    : "האם ברצונך לחדש את המנוי שלך?"
                  : "עדיין לא יצרת מנוי בעבר, האם ברצונך ליצור מנוי?"}
              </h1>
              </div>
              {/* <h1><svg className="iconSubscription" aria-hidden="true">
            <use xlinkHref="#icon-coffee" href="#icon-coffee" />
          </svg>מנוי</h1> */}
              {/* {stateOfUser == "new" ? <button onClick={newSubscription}>יצירת מנוי</button> 
          :"renew" ? <button onClick={renewSubscription}>חידוש מנוי</button> 
          : <div><button onClick={extensionSubscription}>הארכת מנוי קיים</button>  
           <DatePicker
          selected={new Date(user.endDate)}
          onChange={(date) => setStartDate(date)}
          customInput={<ExampleCustomInput />}
        />
        </div>} */}

              
                <FocusTrap  open={openCnt} disableRestoreFocus disableAutoFocus>
                  <Stack style={{padding:"13px"}} alignItems="center" spacing={2}>
                    <div className="button-groupSubscription">
                      <button
                        onClick={() => setOpenCnt(!openCnt)}
                        className="buttonSubscription"
                      >
                        {openCnt ? "ביטול" : stateOfUser != "extension" ? "רכישת מנוי" : `תקופת המנוי שלך תגמר ב- ${displayDate(user.endDate)}`}
                      </button>
                    </div>
                    {openCnt && (
                      <>
                        <div className=" card--accentSubscription">
                          <label className="inputSubscription">
                            <input
                              onChange={(e) => {
                                setCntMonthes(e.target.value);
                                addMonthes(e.target.value);
                              }}
                              className="input__fieldSubscription"
                              type="number"
                              // placeholder=" "
                            />
                            <span className="input__labelSubscription">
                              {stateOfUser == "extension" ? "מספר החודשים להארכת המנוי" : "מספר החודשים בהם המנוי יהיה תקף"}
                            </span>
                          </label>
                          {endSubscription != null && cntMonthes != 0 ? (
                            <h2>
                              במידה ותמשיך את הפעילות סוף תקופת המנוי שלך תיגמר
                              ב- {displayDate(endSubscription)}
                            </h2>
                          ) : stateOfUser && stateOfUser == "extension" ? "המנוי שלך יגמר ב" + displayEndDate(): stateOfUser == "renew" ? "פג תוקף המנוי שלך ב-" + displayEndDate() : ""}
                          <button
                            className="buttonSubscription"
                            onClick={() => renewSubscription()}
                          >
                            לתשלום {cntMonthes * 30} ₪
                          </button>
                        </div>
                      </>
                    )}
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
      <div>
        <Alert style={{ textAlign: "left" }} severity="info">
          <AlertTitle onMouseMove={() => console.log(stateOfUser)}>
            חשוב לדעת
          </AlertTitle>
          המינוי תקף לחודש מיצירתו <strong>!</strong>
        </Alert>
      </div>
      
    </div>
  );
});

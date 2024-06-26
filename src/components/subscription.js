import { useEffect, useState,forwardRef } from "react";
import { connect,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import {Alert, AlertTitle,Stack, Button, Dialog, DialogActions, DialogTitle,Slide} from "@mui/material";
import date from "date-and-time";
import {FocusTrap} from '@mui/base/FocusTrap'
import { API_URL } from "../services/apiService";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function mapStateToProps(state) {
  return {
    user: state.User.user,
  };
}
export default connect(mapStateToProps)(function Subscription(props) {
  const { user } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cntMonthes, setCntMonthes] = useState(0);
  const [stateOfUser, setStateOfUser] = useState();
  const [endSubscription, setendSubscription] = useState(null);
  const [openCnt, setOpenCnt] = useState(false);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (user._id === undefined) {
      setOpen(true);
    }
    setStateOfUser(
      user.endDate !== undefined
        ? new Date(user.endDate) < new Date()
          ? "renew"
          : "extension"
        : "new"
    );

  }, []);

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
      stateOfUser === "new" || stateOfUser === "renew"
        ? new Date()
        : new Date(user.endDate);
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
      .put(`${API_URL}/user/updateUser/` + user._id, user)
      .then((res) => {
        dispatch({ type: "UPDATEUSER", payload: user });
      });
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
                {stateOfUser !== "new"
                  ? stateOfUser !== "renew"
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
                        {openCnt ? "ביטול" : stateOfUser !== "extension" ? "רכישת מנוי" : `תקופת המנוי שלך תגמר ב- ${displayDate(user.endDate)}`}
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
                              {stateOfUser === "extension" ? "מספר החודשים להארכת המנוי" : "מספר החודשים בהם המנוי יהיה תקף"}
                            </span>
                          </label>
                          {endSubscription !== null && cntMonthes !== 0 ? (
                            <h2>
                              במידה ותמשיך את הפעילות סוף תקופת המנוי שלך תיגמר
                              ב- {displayDate(endSubscription)}
                            </h2>
                          ) : stateOfUser && stateOfUser === "extension" ? "המנוי שלך יגמר ב" + displayEndDate(): stateOfUser === "renew" ? "פג תוקף המנוי שלך ב-" + displayEndDate() : ""}
                          <button
                            className="buttonSubscription"
                            onClick={() => renewSubscription()}
                          >
                            לתשלום ₪{cntMonthes * 30} 
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
          <AlertTitle>
            חשוב לדעת
          </AlertTitle>
          המינוי תקף לחודש מיצירתו <strong>!</strong>
        </Alert>
      </div>
      
    </div>
  );
});

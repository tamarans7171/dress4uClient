import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { CirclePicker } from "react-color";
import Box from "@mui/material/Box";
import {ClickAwayListener} from "@mui/base/ClickAwayListener";
import axios from "axios";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import { useNavigate } from "react-router-dom";
import {ErrorOutline} from '@mui/icons-material';

import {
  FavoriteBorderRounded,
  FavoriteRounded,
  AccessTime,
} from "@mui/icons-material";
import "./dress.css";
// import './carousel.css'

function mapStateToProps(state) {
  console.log(state);
  return {
    user: state.User.user,
    // dress: state.Dress.dress
  };
}
export default connect(mapStateToProps)(function Dress(props) {
  const navigate = useNavigate();
  const { user } = props;
  const [error, setError] = useState("");
  const [isFavorate, setiIsFavorate] = useState();
  const location = useLocation();
  const [dress, setDress] = useState(location.state);
  const [uploudDate, setUploudDate] = useState(
    new Date(location.state.uploadDate)
  );
  const [comment, setComment] = useState({
    user: user._id,
    dress: dress._id,
    content: "",
    nameToPublication: "",
    date: new Date(),
  });
  const [idPerference, setIdPerference] = useState();
  const [comments, setComments] = useState();
  const [open, setOpen] = React.useState(false);
  const [hasPermitionNumber, setHasPermitionNumber] = useState(false);
  const [hasPermitionComment, setHasPermitionComment] = useState(false);
  useEffect(() => {
    getComments();
    checkPermitionComment();
    checkPerferenc();
    checkPermitionNumber();
    console.log(dress);
  }, []);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  console.log("😉" + location.state);
  console.log("😉" + location);
  const styles = {
    color: "#b74160",
    width: 253,
    position: "absolute",
    top: 60,
    right: 1,
    left: 0,
    zIndex: 1,
    border: "1px solid #b74160",
    p: 1,
    bgcolor: "background.paper",
  };

  async function getComments() {
    console.log(dress._id+" 😁");
    await axios
      .get(
        "http://localhost:3003/comments/getCommentByDressId/" + dress._id,
        comment
      )
      .then((res) => {
        console.log(res.data);
        setComments(res.data);
      });
  }

  function subscribeAllDresses() {
    navigate("/sonalMenu", {
      state: {
        navigate: "subscription",
      },
    });
  }

  function subscribeSpecificDress() {
    navigate("/payments", {
      state: {
        sum: 10,
        type: "subscribeDress",
        dressToSubscribe: dress._id,
      },
    });
  }
  async function checkPerferenc() {
    axios
      .get(
        "http://localhost:3003/perferences/getPerferenceByUserAndDress/" +
          user._id +
          "/" +
          dress._id
      )
      .then((resp) => {
        if (resp.data.ans) {
          setiIsFavorate(true);
          setIdPerference(resp.data.perference._id);
        } else {
          setiIsFavorate(false);
        }
      });
  }

  async function saveComment() {
    await axios
      .post("http://localhost:3003/comments/addComment", comment)
      .then((res) => {});
  }

  async function checkPermitionComment() {
    let firstDateWithPermition = new Date();
    firstDateWithPermition.setMonth(firstDateWithPermition.getMonth());
    if (user.firstName) {
      if (user.endDate && new Date(user.endDate) > firstDateWithPermition) {
        setHasPermitionComment(true);
      }
      await axios
        .get(
          `http://localhost:3003/payments/getPaymentsWithSubscriptionToComment/${user._id}/${dress._id}`
        )
        .then((resp) => {
          if (resp.data) setHasPermitionComment(true);
          console.log(":::::::::::::::::::::::::::::::");
          console.log(resp.data);
        });
    }
  }

  async function changeFavorated() {
    if (!user.firstName) {
      alert("על מנת לסמן העדפה עליך להתחבר למערכת");
    } else {
      if (!isFavorate) {
        let newPerference = {
          user: user._id,
          dress: dress._id,
          date: new Date(),
        };
        await axios
          .post("http://localhost:3003/perferences/addPerference", newPerference)
          .then((res) => {
            console.log(res.data);
          });
      } else {
        await axios
          .delete(
            "http://localhost:3003/perference/deletePerference/" + idPerference
          )
          .then((res2) => {
            console.log(res2.data);
          });
      }
      setiIsFavorate(!isFavorate);
    }
  }

  function navToConnect() {
    navigate("/login", {
      state: { navAfter: "/dress", state: dress },
    });
  }

  async function checkPermitionNumber() {
    let now = new Date(),
      endDate = new Date(user.endDate);
    if (user && endDate && endDate > now) {
      setHasPermitionNumber(true);
    }
    await axios
      .get(
        `http://localhost:3003/payments/getPaymentsWithSubscriptionToDress/${user._id}/${dress._id}`
      )
      .then((resp) => {
        if (resp.data) setHasPermitionNumber(true);
        console.log(resp.data);
      });
  }
  return (
    <div className="dress">
      {dress && comments && (
        <div className="container-fluid">
          <div className="rowDressDetails">
            <div className="col-6 col-sm-6 detailsDress">
              <div className="rowUpDetails">
                <p>
                  אזור ההשכרה:{" "}
                  <span className="spanArea">
                    {/* {dress.area.name} -  */}

                    {dress.subArea.name}
                  </span>
                </p>
                <span>
                  {isFavorate ? (
                    <FavoriteRounded
                      sx={{ fontSize: 40, marginLeft: "9px" }}
                      onClick={changeFavorated}
                      className="iconFavorite"
                    />
                  ) : (
                    <FavoriteBorderRounded
                      sx={{ fontSize: 40, marginLeft: "9px" }}
                      onClick={changeFavorated}
                      className="iconFavorite"
                    />
                  )}
                </span>
              </div>
              <hr />
              <h1>{dress.description}</h1>
              <h3>מידה {dress.size}</h3>
              <h3 className="priceDress">{dress.price}₪</h3>
              <div className="row ">
                {" "}
                <h2 style={{ margin: "0px" }}>סגנונות: </h2>
                {dress.style.map((s, i) => (
                  <div className="styleDiv" key={i}>
                    {s.name}
                  </div>
                ))}
              </div>
              <p>
                תאריך פרסום באתר:{" "}
                {uploudDate.getDate() +
                  "/" +
                  (uploudDate.getMonth() + 1) +
                  "/" +
                  uploudDate.getFullYear()}
              </p>
              <div className="row">
                <div
                  className="colorCircle"
                  style={{ background: `${dress.color.name}` }}
                ></div>
              </div>
              <br />
              {/* <CirclePicker colors={[dress.color.name]} /> */}
              <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={handleClickAway}
              >
                <Box sx={{ position: "relative" }}>
                  <button className="buttonDetails" onClick={handleClick}>
                    להצגת מספר הטלפון של המשכיר
                  </button>
                  {open ? (
                    <Box sx={styles}>
                      {user.firstName ? (
                        hasPermitionNumber ? (
                          <div>
                            {dress.landlord.firstName +
                              " " +
                              dress.landlord.lastName}
                            <hr />
                            {dress.landlord.phone}
                          </div>
                        ) : (
                          <div>
                            אין לך גישה לפרטי ההתקשרות עם המשכיר
                            <hr />
                            <button onClick={subscribeAllDresses}>
                              רכישת מנוי לכל השמלות
                            </button><span>₪30 לחודש</span>
                            <button onClick={subscribeSpecificDress}>
                              רכישת מנוי לשמלה זו בלבד
                            </button><span>₪10 לחודש</span>
                          </div>
                        )
                      ) : (
                        <div>
                          אינך מחובר
                          <hr />
                          <button onClick={navToConnect}>
                            להתחברות למערכת
                          </button>
                        </div>
                      )}
                    </Box>
                  ) : null}
                </Box>
              </ClickAwayListener>
            </div>
            <div className="col-6 col-sm-3">
              <AwesomeSlider className="carouselImages">
                {dress.images.imgCollection.map((obj, i) => (
                  <div className="img" key={i} data-src={obj.url}></div>
                ))}
              </AwesomeSlider>
            </div>
          </div>

          <hr />
          <br />

          {/* תגובות */}
          <div className="containerComments">
           {hasPermitionComment ? (   <div className="addDress" style={{ display: "block" }}>
              <article className="l-design-widhtComment">
              
                  <div className="cardComment card--accentAdd">
                    <h2>
                      <svg className="iconAdd" aria-hidden="true">
                        <use xlinkHref="#icon-coffee" href="#icon-coffee" />
                      </svg>
                      הוספת תגובה
                    </h2>
                    <label className="inputAdd">
                      <textarea
                        onChange={(e) => {
                          setComment({ ...comment, content: e.target.value });
                        }}
                        className="input__fieldAdd textAreaDress text-right"
                        type="textarea"
                        placeholder=""
                      />
                      <span className="input__labelComment">תוכן</span>
                    </label>
                    <label className="inputAdd">
                      <textarea
                        onChange={(e) => {
                          setComment({
                            ...comment,
                            nameToPublication: e.target.value,
                          });
                        }}
                        className="input__fieldAdd text-right"
                        placeholder=" "
                      />
                      <span
                        className="input__labelAdd"
                        style={{ left: "-170px", top: "18px" }}
                      >
                        שם לפרסום
                      </span>
                    </label>
                    <p>{error}</p>
                    <div className="button-groupAdd">
                      <button className="buttonDetails" onClick={saveComment}>
                        {/* <AddIcon /> */}
                        הוסף תגובה
                      </button>
                      <button className="buttonAdd" type="reset">
                        ביטול
                      </button>
                    </div>
                  </div>
                
              </article>
            </div>
            ) : !user.firstName ? (
                  <div className="CommentMessege">
                    <ErrorOutline sx={{marginLeft:"20px"}}/>
                    <p>
                      על מנת להוסיף תגובה עליך{" "}
                      <Link
                        to={"/login"}
                        state={{ navAfter: "/dress", state: dress }}
                      >
                        להתחבר למערכת
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="CommentMessege">
                  <ErrorOutline sx={{marginLeft:"20px"}}/>
                  <p>
                    אפשרות תגובה ניתנת רק למי שרכש מנוי כללי או מנוי חד-פעמי
                    לשמלה זו בחצי שנה האחרונה
                  </p>
                </div>
                )}
            <h1 className="h1Add">תגובות ({comments.length})</h1>

            {comments &&
              comments.map((c, i) => {
                return (
                  <div key={i} className="comment">
                    <p style={{ display: "flex" }}>
                      {c.nameToPublication}{" "}
                      <AccessTime
                        color="inherit"
                        style={{
                          marginRight: "3px",
                          marginLeft: "3px",
                          opacity: "0.5",
                        }}
                        fontSize="small"
                      />
                      {new Date(c.date).toDateString()}
                    </p>
                    <p>{c.content}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
});

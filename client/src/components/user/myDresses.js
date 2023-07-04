import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import { NotInterested, DoneAllOutlined } from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import { useNavigate } from "react-router-dom";

import date from "date-and-time";
import "./myDresses.css";
function mapStateToProps(state) {
  return {
    user: state.User.user,
  };
}
export default connect(mapStateToProps)(function MyDresses(props) {
  const { user } = props;
  const navigate = useNavigate();
  const [dressesInAdd, setDressesInAdd] = useState([]);
  const [waitingDresses, setWaitingDresses] = useState([]);
  const [disPermiitionDresses, setDisPermiitionDresses] = useState([]);
  const [selectedIndexDisPermitionDress, setSelectedIndexDisPermitionDress] = useState(-1);
  const [selectedIndexDressInAdd, setSelectedIndexDressInAdd] = useState(-1);
  const [endTimeDress, setEndTimeDress] = useState()
  const [cntMonthes, setCntMonthes] = useState(0)
  const [newPayment, setNewPayment] = useState({
    user: user._id,
    amount: 30,
    date: new Date(),
    isLandlord: true,
    dress: "",
  });

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    getUserDresses();
  }, []);

  async function getUserDresses() {
    await axios
      .get("https://dress4u.onrender.com/dresses/getDressByUser/" + user._id)
      .then((res) => {
        console.log(res.data);
        res.data.forEach((element) => {
          console.log(element.status);
          switch (element.status) {
            case 0:
              setWaitingDresses([...waitingDresses, element]);
              break;
            case -1:
              setDisPermiitionDresses([...disPermiitionDresses, element]);

              break;
            case 1:
              setDressesInAdd([...dressesInAdd, element]);
              console.log("1 ------------");
              break;

            default:
              break;
          }
        });
      });
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1186,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 455,
    // bgcolor: "background.paper",
    // border: "2px solid #000",
    // boxShadow: 24,
    // p: 4,
  };

  const [open, setOpen] = useState(false);
  const [openExtentionDress, setOpenExtentionDress] = useState(false);
  const handleOpen = (indexDress) => {
    setOpen(true);
    setSelectedIndexDisPermitionDress(indexDress);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIndexDisPermitionDress(-1);
  };

  const handleOpenExtentionDress = (indexDress) => {
    setOpenExtentionDress(true);
    setSelectedIndexDressInAdd(indexDress);
     setEndTimeDress(dressesInAdd[indexDress].endTime)
  };

  const handleCloseExtentionDress = () => {
    setOpenExtentionDress(false);
    setSelectedIndexDressInAdd(-1);
   
  };

  async function uploadDress(dressIndex) {
    let tempDress = disPermiitionDresses[dressIndex];
    tempDress.status = 1;
    let tempImages = tempDress.images.imgCollection.filter(
      (image) => image.isPermited == 1
    );
    let newImages = { imgCollection: tempImages };
    await axios
      .put(
        "https://dress4u.onrender.com/images/updateImages/" + tempDress.images._id,
        newImages
      )
      .then(async (resImages) => {
        console.log(resImages.data);
        let dateToDress = new Date();
        dateToDress.setMonth(dateToDress.getMonth() + 3);
        tempDress.endTime = dateToDress;
        await axios
          .put(
            "https://dress4u.onrender.com/dresses/updateDress/" + tempDress._id,
            tempDress
          )
          .then(async (resDress) => {
            console.log(resDress.data);
            newPayment.dress = tempDress._id;
            await axios
              .post("https://dress4u.onrender.com/payments/addPayment", newPayment)
              .then((resPay) => {
                console.log(resPay.data);
              });
          });
      });
  }

  async function deleteDress(dressIndex) {
    await axios
      .delete(
        "https://dress4u.onrender.com/dresses/deleteDress/" +
          disPermiitionDresses[dressIndex]
      )
      .then(async (respDress) => {
        console.log(respDress.data);
        await axios
          .delete(
            "https://dress4u.onrender.com/images/deleteImages/" +
              disPermiitionDresses[dressIndex].images._id
          )
          .then((respImages) => {
            console.log(respImages.data);
          });
      });
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

  function addMonthes(cntMonthes) {
    let endTime =  new Date(dressesInAdd[selectedIndexDressInAdd].endTime);
    // console.log(endDate);
    //   endDate.setMonth(endDate.getMonth() + cntMonthes)
    //   var newDate = new Date(endDate.setMonth(endDate.getMonth()+1));
    //   newDate.setFullYear(newDate.getFullYear()-1)
    let d = date.addMonths(endTime, Number(cntMonthes));
    setEndTimeDress(d);
  }

  function renewSubscription(index) {
console.log(index);
let tempDress = dressesInAdd[index]
    if (cntMonthes <= 0) {
      alert("עליך לבחור כמות הגדולה מ-0");
    } else {
      navigate("/payments", {
        state: {
          sum: cntMonthes * 10,
          type: "extentionDress",
          endTime: endTimeDress,
          dressToExtention:tempDress
        },
      });
    }
  }
  return (
    <div>
      <div className="typeDressesContainer">
        <h2 className="divider line double-razor" contenteditable>
          שמלות המתפרסמות על ידך באתר
        </h2>
        {dressesInAdd.length > 0 ? (
          <div style={{ marginTop: "19px" }}>
            <div className="container containerProducts">
              <div className="row">
                {dressesInAdd.map((dress, i) => {
                  console.log(dress.images.imgCollection[0].url)
                  if (dress.dressSet == "" || dress.dressSet == undefined)
                    return (
                      <Link
                        key={i}
                        style={{ color: "#b74160" }}
                        onClick={() => {
                          handleOpenExtentionDress(i);
                        }}
                      >
                        {" "}
                        <div
                          key={i}
                          className="boxO col-lg-4 col-sm-6 detailDiv"
                        >
                          <div
                            style={{
                              backgroundImage: `url(${dress.images.imgCollection[0].url})`,
                            }}
                            className="productUp"
                          ></div>
                          <div className="productDown">
                            <h3>{dress.description}</h3>
                            <p
                              style={{
                                fontSize: "18px",
                                paddingBottom: "4px",
                                fontWeight: "bold",
                              }}
                            >
                              {dress.price}₪{" "}
                            </p>
                            <p>Size:{dress.size}</p>
                          </div>
                        </div>
                      </Link>
                    );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="messegeThereIsNotMatchDressesType">
              אין לך שמלות בפירסום
            </p>
          </>
        )}
        <Modal
          open={openExtentionDress}
          onClose={handleCloseExtentionDress}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                   <article className="l-design-widhtSubscriptionDress">
            <div className="cardSubscription card--accentSubscription">
              <div className="headSub">
                {" "}
                <h1>
                 עדכון שמלה
                </h1>
              </div>
                <Stack
                  style={{ padding: "13px",background:"white", height:"465px" }}
                  alignItems="center"
                  spacing={2}
                >
                  <h1 className="h1Subscription">
                    { `תוקף פרסום השמלה שלך יפוג ב- ${selectedIndexDressInAdd != -1 && displayDate(dressesInAdd[selectedIndexDressInAdd].endTime)}`}
                  </h1>
                  <div className="card--accentSubscription">
                    <h3>
                      {" "}
                      {"הכנס את מספר החודשים להארכת זמן פרסום השמלה"}
                    </h3>
                    <label className="inputSubscription">
                      <input
                        onChange={(e) => {
                          setCntMonthes(e.target.value);
                          addMonthes(e.target.value);
                        }}
                        className="input__fieldwidhtSubscriptionDress"
                        type="number"
                        placeholder="₪10 עבור חודש לפרסום שמלה"
                      />
                      {/* <span className="input__labelSubscription">
                        מספר חודשים
                      </span> */}
                    </label>
                    {selectedIndexDressInAdd != -1 && endTimeDress != dressesInAdd[selectedIndexDressInAdd].endTime && cntMonthes != 0 ? (
                      <h4>
                        במידה ותמשיך את הפעילות סוף תקופת המנוי שלך תיגמר ב-{" "}
                        {displayDate(endTimeDress)}
                      </h4>
                    ) : (
                      ""
                    )}
                    <Fab
                      onClick={() => renewSubscription(selectedIndexDressInAdd)}
                      className="buttonSubscription addDressBtn"
                      variant="extended"
                      size="medium"
                      color="secondary"
                      aria-label="add"
                    >
                      לתשלום {cntMonthes * 10} ₪
                    </Fab>
                  </div>
                </Stack>
            </div>
          </article>
            </Typography>
          </Box>
        </Modal>
      </div>
      <div className="typeDressesContainer">
        <h2 className="divider line double-razor" contenteditable>
          שמלות שלא אושרו
        </h2>
        {disPermiitionDresses.length > 0 ? (
          <div style={{ marginTop: "19px" }}>
            <div className="container containerProducts">
              <div className="row">
                {disPermiitionDresses.map((dress, i) => {
                  if (dress.dressSet == "" || dress.dressSet == undefined)
                    return (
                      <Link
                        onClick={() => {
                          handleOpen(i);
                        }}
                        key={i}
                        style={{ color: "#b74160" }}
                      >
                        {" "}
                        <div
                          key={i}
                          className="boxO col-lg-4 col-sm-6 detailDiv"
                        >
                          <div
                            style={{
                              backgroundImage: `url(${dress.images.imgCollection[0].url})`,
                            }}
                            className="productUp"
                          ></div>
                          <div className="productDown">
                            <h3>{dress.description}</h3>
                            <p
                              style={{
                                fontSize: "18px",
                                paddingBottom: "4px",
                                fontWeight: "bold",
                              }}
                            >
                              {dress.price}₪{" "}
                            </p>
                            <p>Size:{dress.size}</p>
                          </div>
                        </div>
                      </Link>
                    );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="messegeThereIsNotMatchDressesType">
              אין לך שמלות שלא אושרו
            </p>
          </>
        )}
      </div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div>
              <h3 className="mapContainer">
                <span className="mapColorRed"></span>תמונות שלא אושרו
                <span className="mapColorGreen"></span>תמונות שאושרו
              </h3>
            </div>
            <div>
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={{ xs: 1, sm: 2, md: 2 }}
                >
                  {disPermiitionDresses.length > 0 &&
                    selectedIndexDisPermitionDress != -1 &&
                    disPermiitionDresses[
                      selectedIndexDisPermitionDress
                    ].images.imgCollection.map((image, i) => (
                      <Grid xs={4}>
                        <Item
                          style={{
                            border: `solid 9px ${
                              image.isPermited == -1 ? "red" : "green"
                            }`,
                            background: `url(${image.url}),grey`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        ></Item>{" "}
                      </Grid>
                    ))}
                </Grid>
              </Box>
              <div className="containerButtonsDresses">
                {" "}
                <Button
                  style={{
                    paddingLeft: "25px",
                    marginLeft: "25px",
                    marginTop: "25px",
                  }}
                  onClick={() => {
                    deleteDress(selectedIndexDisPermitionDress);
                    handleClose()
                  }}
                  variant="outlined"
                  color={"error"}
                  startIcon={<NotInterested style={{ margin: "10px" }} />}
                >
                  ביטול פרסום שמלה
                </Button>
                <Button
                  style={{ paddingLeft: "25px", marginTop: "25px" }}
                  onClick={() => {
                    uploadDress(selectedIndexDisPermitionDress);
                    handleClose()

                  }}
                  variant="outlined"
                  color={"success"}
                  startIcon={<DoneAllOutlined style={{ margin: "10px" }} />}
                >
                  פרסום שמלה עם התמונות שאושרו בלבד!
                </Button>
              </div>
            </div>
          </Typography>
        </Box>
      </Modal>

      <div className="typeDressesContainer">
        <h2 className="divider line double-razor" contenteditable>
          שמלות בהמתנה לאישור המנהל
        </h2>
        {waitingDresses.length > 0 ? (
          <div style={{ marginTop: "19px" }}>
            <div className="container containerProducts">
              <div className="row">
                {waitingDresses.map((dress, i) => {
                                    console.log(dress.images.imgCollection[0].url)

                  if (dress.dressSet == "" || dress.dressSet == undefined)
                    return (
                      <Link
                        key={i}
                        style={{ color: "#b74160" }}
                        // to="/dress"
                        state={dress}
                      >
                        {" "}
                        <div
                          key={i}
                          className="boxO col-lg-4 col-sm-6 detailDiv"
                        >
                          <div
                            style={{
                              backgroundImage: `url(${dress.images.imgCollection[0].url})`,
                            }}
                            className="productUp"
                          ></div>
                          <div className="productDown">
                            <h3>{dress.description}</h3>
                            <p
                              style={{
                                fontSize: "18px",
                                paddingBottom: "4px",
                                fontWeight: "bold",
                              }}
                            >
                              {dress.price}₪{" "}
                            </p>
                            <p>Size:{dress.size}</p>
                          </div>
                        </div>
                      </Link>
                    );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="messegeThereIsNotMatchDressesType">
              אין לך שמלות בהמתנה
            </p>
          </>
        )}
      </div>
    </div>
  );
});

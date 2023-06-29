import axios from "axios";
import { useState, Fragment, forwardRef } from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import "./permitDresses.css";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { NotInterested, DoneAllOutlined } from "@mui/icons-material";
import Fab from "@mui/material/Fab";
import DoneOutline from "@mui/icons-material/DoneOutline";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

function PermitDresses() {
  const [dresses, setDresses] = useState([]);
  const [images, setImages] = useState([]);
  const [actived, setActived] = useState([]);
  // const [newPayment, setNewPayment] = useState({  user:user._id, amount:sum, date:new Date(),isLandlord:true, dress:location.state.dressToSubscribe})

  const [openAlert, setOpenAlert] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClick = () => {
    setOpenAlert(true);
  };

  const handleClose = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return;
    // }

    setOpenAlert(false);
  };

  const action = (
    <Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    getDressesToPremit();
  }, []);

  async function getDressesToPremit() {
    await axios.get("http://localhost:3003/dresses/getDresses").then((res) => {
      let DressesToPermit = res.data.filter((dress) => dress.status == 0);
      setDresses(DressesToPermit);
      console.log(DressesToPermit);
    });
  }

  function setActive(url, status) {
    if (status == 1) {
      if (!actived.includes(url)) setActived([...actived, url]);
    } else {
      if (actived.length > 0) {
        let temp = actived;
        temp = temp.filter((u) => u != url);
        setActived(temp);
      }
    }
  }

  async function savePermitions() {
    let d = 1,
      tempDresses = dresses;
    tempDresses.forEach(async (dress, dressIndex) => {
      //עובר על כל השמלות שלא קיבלו עדיין אישור
      d = 1;
      dress.images.imgCollection.forEach(async (imageObject, indexImage) => {
        if (actived.includes(imageObject.url))
          tempDresses[dressIndex].images.imgCollection[
            indexImage
          ].isPermited = 1;
        else {
          tempDresses[dressIndex].images.imgCollection[indexImage].isPermited =
            -1;
          d = 0;
        }
      });

      if (d == 1) {
        let dateToDress = new Date()
        dateToDress.setMonth(dateToDress.getMonth() + 3)
        tempDresses[dressIndex].status = 1;
        tempDresses[dressIndex].endTime = dateToDress
      } else {
        tempDresses[dressIndex].status = -1;
      }
      await axios
        .put(
          "http://localhost:3030/dress/updateDress/" +
            tempDresses[dressIndex]._id,
          tempDresses[dressIndex]
        )
        .then(async (ans) => {
          await axios
            .put(
              "http://localhost:3030/images/updateImages/" + dress.images._id,
              dress.images
            )
            .then(async(resImages) => {
              console.log(resImages.data);
              handleClick();
              setDresses([])
              if(d==1) {
                let newPayment = {  user:dress.landlord, amount:30, date:new Date(),isLandlord:true, dress:dress._id}
                await axios.post("http://localhost:3030/payment/addPayment", newPayment).then((resPay)=>{
                  console.log(resPay.data);
                })
              }
              
            });
        });
    });
    console.log(tempDresses);
  

  }

  return (
    <div className="PermitDresses">
      {dresses && dresses.length > 0 ? <div>
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 2 }}
          >
            {dresses.map((dress, indexDress) =>
              dress.images.imgCollection.map((image, indexImage) => {
                return (
                  <Grid xs={4}>
                    <Item
                      style={{
                        background: `url(${image.url}),grey`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <Button
                        style={{ paddingLeft: "25px" }}
                        onClick={() => {
                          setActive(image.url, -1);
                        }}
                        variant="contained"
                        color={
                          !actived.includes(image.url) ? "error" : "inherit"
                        }
                        startIcon={<NotInterested />}
                      ></Button>
                      <Button
                        style={{ paddingLeft: "25px" }}
                        onClick={() => {
                          setActive(image.url, 1);
                        }}
                        color={
                          actived.includes(image.url) ? "success" : "inherit"
                        }
                        startIcon={<DoneAllOutlined />}
                        variant="contained"
                      ></Button>
                    </Item>{" "}
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>
        <Fab
          variant="extended"
          onClick={savePermitions}
          size="medium"
          className="permitBtn"
          aria-label="add"
        >
          <DoneOutline sx={{ marginLeft: "5px" }} />
          {"עדכון פרטים"}
        </Fab>
      </div> : (
        <h2 className="meesegeNoDresses">אין תמונות הממתינות לאישור</h2>
      )}
     

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          הפרטים התעדכנו בהצלחה
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PermitDresses;

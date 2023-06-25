import { connect, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import "./payments.css";
function mapStateToProps(state) {
  // const {state}=state
  return {
    user: state.User.user,
    dress: state.Dress.dress,
    images: state.Images.images,
  };
}
export default connect(mapStateToProps)(function Payments(props) {
  const PRICE = 30;
  const { user } = props;
  const { dress } = props;
  const { images } = props;
  const { dressToExtention } = props;
  const { endTime } = props;
  const location = useLocation();
  const [sum, setSum] = useState(location.state.sum);
  const [type, setType] = useState(location.state.type);
  const [endDate, setEndDate] = useState(location.state.endDate);
  const [newPayment, setNewPayment] = useState({
    user: user._id,
    amount: sum,
    date: new Date(),
    isLandlord: true,
    dress: location.state.dressToSubscribe,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(location.state);

  async function subscribeDress() {
    let tempPayment = newPayment;
    tempPayment.isLandlord = false;
    console.log(tempPayment);
    await axios
      .post("http://localhost:3000/payments/addPayment", tempPayment)
      .then((resPay) => {
        console.log(resPay.data);
        navigate("/allProducts");
      });
  }

  async function saveDress() {
    // אם התשלום עבר
    axios
      .post("http://localhost:3000/images/upload-images", images, {})
      .then(async (res) => {
        console.log(res.data.imagesCreated._id);
        dress.images = res.data.imagesCreated._id;
        dress.landlord = user._id;
        await axios
          .post("http://localhost:3000/dresses/addDress", dress)
          .then(async (resp) => {
            alert(
              "יש 😊 הצלחת להעלות את השמלה לאתר, השמלה רק צריכה לעבור את אישור המנהל."
            );
            // if(resp.data.dressSet == undefined) {
            //   console.log("newPayment"+newPayment);
            //   newPayment.dress = resp.data._id;
            //   await axios.post("http://localhost:3030/payment/addPayment", newPayment).then((resPay)=>{
            //     console.log(resPay.data);
            //   })
            // } else {
            //     // newPayment.dress

            // }
            dispatch({ type: "UPDATEDRESS", payload: null });

            navigate("/allProducts");
          });
      });
  }

  async function saveSubscription() {
    let tempPayment = newPayment;
    tempPayment.isLandlord = false;
    user.endDate = endDate;
    if (type == "new") {
      user.startDate = new Date();
    }
    await axios
      .put("http://localhost:3000/users/updateUser/" + user._id, user)
      .then(async (res) => {
        console.log(res.data);
        await axios
          .post("http://localhost:3000/payments/addPayment", tempPayment)
          .then((resPay) => {
            console.log(resPay.data);
            navigate("/allProducts");
          });
      });
  }

  async function updateDressEndTime() {
    let tempDress = location.state.dressToExtention
    let tempPayment = newPayment;
    console.log(tempDress);
    tempPayment.dress =tempDress._id;
    
    tempDress.endTime = location.state.endTime;

    await axios
      .put(
        "http://localhost:3000/dresses/updateDress/" + tempDress._id,
        tempDress
      )
      .then(async (res) => {
        console.log(res.data);
        await axios
          .post("http://localhost:3000/payments/addPayment", tempPayment)
          .then((resPay) => {
            console.log(resPay.data);
            navigate("/allProducts");
          });
      });
  }
  console.log("❤️"+type);
  return (
    <div className="paymentComponent">
      <div className="addDress addDressPage">
        <article className="l-design-widhtAdd">
          <h1 className="h1Add">תשלומים</h1>
          <div className="cardAdd card--accentAdd">
            <h2>לתשלום ₪{sum}</h2>
            <h3>
              סוג תשלום:{" "}
              {type == "renew"
                ? "חידוש מנוי"
                : type == "newDress"
                ? "פרסום שמלה"
                : type == "subscribeDress"
                ? "רכישת מנוי לשמלה"
                : type == "extension"
                ? "הארכת מנוי קיים"
                : type == "new"
                ? "יצירת מנוי חדש"
                : type == "extentionDress"
                ? "הארכת זמן פרסום שמלה"
                : "???????"}
              .
            </h3>

            <PayPalScriptProvider
              className="paymentComponent"
              options={{ "client-id": "test" }}
            >
              <PayPalButtons
                style={{
                  color: "blue",
                  shape: "pill",
                  label: "pay",
                  height: 40,
                }}
              />
            </PayPalScriptProvider>
            <div className="button-groupAdd">
              <Fab
                variant="extended"
                onClick={
                  type == "subscribeDress"
                    ? subscribeDress
                    : type == "newDress"
                    ? saveDress
                    : type == "extentionDress"
                    ? updateDressEndTime
                    : saveSubscription
                }
                size="medium"
                className="addDressBtn"
                aria-label="add"
              >
                <AddIcon />
                שמירת נתונים
              </Fab>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
});

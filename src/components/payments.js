import { connect, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import "./payments.css";
import { paymentsTypes } from "../Constants/subscription";
import { API_URL, doApiMethod } from "../services/apiService";

function mapStateToProps(state) {
  return {
    user: state.User.user,
    dress: state.Dress.dress,
    images: state.Images.images,
  };
}
export default connect(mapStateToProps)(function Payments(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = props;
  const { dress } = props;
  const { images } = props;
  const { sum, type, endDate, dressToSubscribe, endTime, dressToExtention } =
    location.state;
  const newPayment = {
    user: user._id,
    amount: sum,
    date: new Date(),
    isLandlord: true,
    dress: dressToSubscribe,
  };

  async function subscribeDress() {
    let tempPayment = newPayment;
    tempPayment.isLandlord = false;
    await doApiMethod(
      `${API_URL}/payments/addPayment`,
      "POST",
      tempPayment
    ).then((res) => {
      console.log(res);
      if (res) navigate("/allProducts");
    });
  }

  async function saveDress() {
    // אם התשלום עבר
    axios
      .post(`${API_URL}/images/upload-images`, images, {})
      .then(async (res) => {
        dress.images = res.data.imagesCreated._id;
        dress.landlord = user._id;
        try {
          delete dress.defaultImage;
          await axios
            .post(`${API_URL}/dresses/addDress`, dress)
            .then(async (resp) => {
              alert(
                "יש 😊 הצלחת להעלות את השמלה לאתר, השמלה רק צריכה לעבור את אישור המנהל."
              );
              dispatch({ type: "UPDATEDRESS", payload: null });

              navigate("/allProducts");
            });
        } catch (error) {
          console.error(error);
        }
      });
  }

  async function saveSubscription() {
    let tempPayment = newPayment;
    tempPayment.isLandlord = false;
    user.endDate = endDate;
    if (type === "new") {
      user.startDate = new Date();
    }
    await axios
      .put(`${API_URL}/users/updateUser/` + user._id, user)
      .then(async (res) => {
        await axios
          .post(`${API_URL}/payments/addPayment`, tempPayment)
          .then((resPay) => {
            navigate("/allProducts");
          });
      });
  }

  async function updateDressEndTime() {
    let tempDress = dressToExtention;
    let tempPayment = newPayment;
    tempPayment.dress = tempDress._id;

    tempDress.endTime = endTime;

    await axios
      .put(
        `${API_URL}/dresses/updateDress/` + tempDress._id,
        tempDress
      )
      .then(async (res) => {
        await axios
          .post(`${API_URL}/payments/addPayment`, tempPayment)
          .then((resPay) => {
            navigate("/allProducts");
          });
      });
  }

  return (
    <div className="paymentComponent">
      <div className="addDress addDressPage">
        <article className="l-design-widhtAdd">
          <h1 className="h1Add">תשלומים</h1>
          <div className="cardAdd card--accentAdd">
            <h2>לתשלום ₪{sum}</h2>
            <h3>סוג תשלום: {paymentsTypes[type]}</h3>

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
                  type === "subscribeDress"
                    ? subscribeDress
                    : type === "newDress"
                    ? saveDress
                    : type === "extentionDress"
                    ? updateDressEndTime
                    : saveSubscription
                }
                size="medium"
                className="addDressBtn"
                aria-label="add"
              >
                <Add />
                שמירת נתונים
              </Fab>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
});

import React from "react";
import { connect } from "react-redux";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FavoriteBorderOutlined,
  Checkroom,
  CardMembership,
  ModeEdit,
} from "@mui/icons-material";
import "./sonalMenu.css";
import SonalDetails from "./sonalDetails";
import SonalSubscription from "./sonalSubscription";
import MyDresses from "./myDresses";
import FavorateDresses from "./favorateDresses";
import { useEffect } from "react";

function mapStateToProps(state) {
  console.log(state);
  return {
    user: state.User.user,
    //   dress: state.Dress.dress
  };
}
export default connect(mapStateToProps)(function SonalMenu(props) {
  const location = useLocation();
  const { user } = props;
  const [choosenNav, setChoosenNav] = useState("sonalDetails");
  useEffect(() => {
    if (
      location.state &&
      location.state.navigate &&
      location.state.navigate == "subscription"
    ) {
      setChoosenNav("sonalSubscription");
    }
  }, []);
  return (
    <div className="sonalMenu">
      <ul className="sideBar">
        <li className="lidetails">שלום {user.firstName}</li>
        <li
          onClick={() => setChoosenNav("favorateDresses")}
          className={`liSideBar ${
            choosenNav == "favorateDresses" ? "activeLi" : ""
          }`}
        >
          שמלות שאהבתי <FavoriteBorderOutlined />{" "}
        </li>
        <li
          onClick={() => setChoosenNav("myDresses")}
          className={`liSideBar ${choosenNav == "myDresses" ? "activeLi" : ""}`}
        >
          שמלות לפרסום <Checkroom />{" "}
        </li>
        <li
          onClick={() => setChoosenNav("sonalSubscription")}
          className={`liSideBar ${
            choosenNav == "sonalSubscription" ? "activeLi" : ""
          }`}
        >
          מנוי אישי <CardMembership />
        </li>
        <li
          onClick={() => setChoosenNav("sonalDetails")}
          className={`liSideBar ${
            choosenNav == "sonalDetails" ? "activeLi" : ""
          }`}
        >
          פרטים אישיים
          <ModeEdit />
        </li>
      </ul>
      <div className="contentSonal">
        {choosenNav == "sonalDetails" ? (
          <SonalDetails />
        ) : choosenNav == "sonalSubscription" ? (
          <SonalSubscription />
        ) : choosenNav == "favorateDresses" ? (
          <FavorateDresses />
        ) : choosenNav == "myDresses" ? (
          <MyDresses />
        ) : (
          <SonalDetails />
        )}
      </div>
    </div>
  );
});

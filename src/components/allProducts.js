import React, { useEffect, useState } from "react";
import Filters from "./filters.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Statistics from "./statistics.js";
import "./loading.css";
import "./allProducts.css";
import "./select_css.css";
import { Box, Typography } from "@mui/material";
import {
  LocalOfferOutlined,
  StarBorder,
  CalendarMonthOutlined,
} from "@mui/icons-material";
import { API_URL, doApiGet, doApiMethod } from "../services/apiService.js";

function mapStateToProps(state) {
  return {
    user: state.User.user,
  };
}
export default connect(mapStateToProps)(function AllProducts(props) {
  const [tempDresses, setTempDresses] = useState();
  const [dresses, setDresses] = useState();
  const [filterStyles, setFilterStyles] = useState([]);
  const [filterColor, setFilterColor] = useState();
  const [OrderBy, setOrderBy] = useState([
    "פופולארי",
    "תאריך",
    "מחיר - מהזול ליקר",
    "מחיר - מהיקר לזול",
  ]);
  const [selectValue, setSelectValue] = useState("מיין לפי");
  const [selectDis, setSelectDis] = useState(true);
  const [selestIcons, setSelestIcons] = useState([
    <StarBorder />,
    <CalendarMonthOutlined />,
    <LocalOfferOutlined />,
    <LocalOfferOutlined />,
  ]);

  useEffect(() => {
    getDresses();
  }, []);

  useEffect(() => {
    console.log(filterColor);
    console.log(filterStyles);
    var filtered = dresses; // כל השמלות
    if (filterColor || filterStyles.length > 0) {
      // במידה ויש סינון מופעל
      filtered = dresses.filter((d) => {
        if (filterColor) {
          // במידה ויש סינון צבע
          var shouldShow = filterColor === d.color._id;
          if (!shouldShow) return false; // אם הצבע לא תואם - שקר
          console.log("filterByStyle: " + filterStyles);
          if (filterStyles.length === 0) return true;
        }
        var dressStyles = d.style.map((s) => s._id);
        for (let i = 0; i < filterStyles.length; i++) {
          var isTrueStyle = dressStyles?.includes(filterStyles[i]);
          if (isTrueStyle) return true;
        }
        return false;
      });
    }
    setTempDresses(filtered);
    sort(selectValue);
  }, [filterStyles, filterColor]);

  async function getDresses() {
    const dressesData = await doApiGet(API_URL + "/dresses/getDresses");
    // מקבל את כל תתי האזורים
    const areasData = await doApiGet(API_URL + "/areas/getareas");
    let tempArr = dressesData.data.map((d) => {
      let area = areasData.data.filter((a) => d.subArea.area === a._id);
      console.log(area[0]);
      if (area[0] !== undefined) d.subArea.area = area[0];

      return d;
    });
    let t = tempArr.filter((d) => d.status === 1);
    setDresses(t);
    setTempDresses(t);
  }

  function changeOrderVal(valToChange) {
    setSelectValue(valToChange);
    sort(valToChange);
  }

  async function addViesCounter(dress) {
    dress.viewCounter += 1;
    await doApiMethod(
      `${API_URL}/dresses/updateDress/${dress._id}`,
      "PUT",
      dress
    );
  }

  function sort(val) {
    let tempSortedArray;
    let d = 1;
    console.log(val);
    switch (val) {
      case "פופולארי":
        tempSortedArray = tempDresses.sort(
          (a, b) => b.viewCounter - a.viewCounter
        );
        break;
      case "מחיר - מהזול ליקר":
        tempSortedArray = tempDresses.sort((a, b) => a.price - b.price);
        break;
      case "מחיר - מהיקר לזול":
        tempSortedArray = tempDresses.sort((a, b) => b.price - a.price);
        break;
      case "תאריך":
        tempSortedArray = tempDresses.sort(
          (a, b) =>
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
        break;
      default:
        d = 0;

        break;
    }
    if (d === 1) {
      setTempDresses(tempSortedArray);
    }
  }

  return (
    <Box pt={10}>
      {tempDresses ? (
        <div className="container">
          <Filters
            className={"filterPage"}
            updateStylesFilter={(data) => setFilterStyles(data)}
            updateColorFilter={(data) => setFilterColor(data)}
          />
          <div className="allProductsDiv">
            <div id="app-cover">
              <div id="select-box">
                <input type="checkbox" id="options-view-button" />
                <div id="select-button" className="brd">
                  <div id="selected-value">{selectValue}</div>
                  <div id="chevrons">
                    {/* <FontAwesomeIcon className='i' icon="fa-solid fa-chevron-up" /> */}
                    {/* <FontAwesomeIcon className='i' icon="fa-solid fa-chevron-down" /> */}
                    {/* <i className="fas fa-chevron-up"></i> */}
                    {/* <i className="fas fa-chevron-down"></i> */}
                  </div>
                </div>
                <div
                  onClick={() => setSelectDis(true)}
                  style={{ display: selectDis ? "inherit" : "none" }}
                  id="options"
                >
                  {OrderBy.map((orderVal, i) => {
                    return (
                      <div
                        key={i}
                        className="option"
                        onClick={() => {
                          changeOrderVal(orderVal);
                          setSelectDis(!selectDis);
                        }}
                      >
                        {/* <input className="s-c top" type="radio" name="platform" value={orderVal}/> */}
                        {/* <input className="s-c bottom" type="radio" name="platform" value={orderVal}/> */}
                        {/* <i className="fab fa-codepen"></i> */}
                        {/* <FontAwesomeIcon className='i' icon="fa-solid fa-barcode" /> */}

                        <span className="label">
                          {/* {selestIcons[i]} */}
                          {orderVal}
                        </span>
                        <span className="opt-val">{orderVal}</span>
                      </div>
                    );
                  })}

                  <div id="option-bg"></div>
                </div>
              </div>
            </div>
            {tempDresses.length > 0 ? (
              <div style={{ marginTop: "19px" }} className="col-8">
                <div className="container containerProducts">
                  <div className="row">
                    {tempDresses
                      ? tempDresses.map((dress, i) => {
                          if (dress.status === 1)
                            return (
                              <Link
                                key={i}
                                style={{ color: "#b74160" }}
                                onClick={() => addViesCounter(dress)}
                                to="/dress"
                                state={dress}
                              >
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
                                      ₪{dress.price}
                                    </p>
                                    <p>מידה:{dress.size}</p>
                                  </div>
                                </div>
                              </Link>
                            );
                        })
                      : "Loading..."}
                  </div>
                </div>
              </div>
            ) : (
              <Typography mt={6} variant="h5" textAlign={"center"}>
                אין שמלות מתאימות במאגר
              </Typography>
            )}
          </div>
          <Statistics />
        </div>
      ) : (
        <>
          <div className="loader">
            <div className="face">
              <div className="circle"></div>
            </div>
            <div className="face">
              <div className="circle"></div>
            </div>
          </div>
        </>
      )}
    </Box>
  );
});

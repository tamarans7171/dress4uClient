import React, { useEffect, useState } from "react";
import Filters from "./filters.js";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { CirclePicker } from "react-color";
import Statistics from "./statistics.js";
import "./loading.css";
import "./allProducts.css";
import "./select_css.css";
import {
  LocalOfferOutlined,
  StarBorder,
  CalendarMonthOutlined,
} from "@mui/icons-material";
function mapStateToProps(state) {
  // const {state}=state
  return {
    user: state.User.user,
  };
}
export default connect(mapStateToProps)(function AllProducts(props) {
  const { user } = props;
  const [tempDresses, setTempDresses] = useState();
  const [tempSetDresses, setSetTempDresses] = useState();
  const [dresses, setDresses] = useState();
  const [setsDresses, setSetsDresses] = useState();
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
    // getSetDresses();
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
          var shouldShow = filterColor == d.color._id;
          if (!shouldShow) return false; // אם הצבע לא תואם - שקר
          console.log("filterByStyle: " + filterStyles);
          if (filterStyles.length == 0) return true;
        }
        var dressStyles = d.style.map((s) => s._id);
        for (let i = 0; i < filterStyles.length; i++) {
          var isTrueStyle = dressStyles?.includes(filterStyles[i]);
          if (isTrueStyle) return true;
        }
        return false;
      });
    }
    console.log(filtered);
    setTempDresses(filtered);
    sort(selectValue);
  }, [filterStyles, filterColor]);

  async function getDresses() {
    
    await axios
      .get("http://localhost:3000/dresses/getDresses")
      .then(async (res) => {
        setDresses(res.data);
        setTempDresses(res.data);
        await axios
          .get("http://localhost:3000/areas/getareas")
          .then(async (areas) => {
            console.log(areas.data);
            let tempArr = res.data.map((d) => {
              let area = areas.data.filter((a) => d.subArea.area == a._id);
              console.log(area[0]);
              if (area[0] != undefined) d.subArea.area = area[0];

              return d;
            });
            let t = tempArr.filter((d) => d.status == 1);
            setDresses(t);
            setTempDresses(t);
          });
      });
  }
  // async function getSetDresses() {
  //   await axios
  //     .get("http://localhost:3030/dressSet/getDressSets")
  //     .then((res) => {
  //       setSetsDresses(res.data);
  //       setSetTempDresses(res.data);
  //       console.log(res.data);
  //     });
  // }
  async function deleteMe(id) {
    await axios
      .delete("http://localhost:3000/dresses/deleteDress/" + id)
      .then((res) => {
        console.log(res.data);
      });
  }

  function changeOrderVal(valToChange) {
    setSelectValue(valToChange);
    console.log(valToChange);
    sort(valToChange);
  }
  async function addViesCounter(dress) {
    dress.viewCounter += 1;
    await axios
      .put("http://localhost:3000/dresses/updateDress/" + dress._id, dress)
      .then((ans) => {
        console.log(ans.data);
      });
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
          d=0;

        break
    }
    if(d==1) {  
      setTempDresses(tempSortedArray);
    }
  }
  return (
    <div className="allDresses">
      {/* <h1>בחר שמלה</h1> */}
      {tempDresses ? (
        <div>
          <div className="container">
            <Filters
              className={"filterPage"}
              updateStylesFilter={(data) => setFilterStyles(data)}
              updateColorFilter={(data) => setFilterColor(data)}
            />

            <div className="allProductsDiv">
              <form id="app-cover">
                <div id="select-box">
                  <input type="checkbox" id="options-view-button" />
                  <div id="select-button" className="brd">
                    <div id="selected-value">
                      <span>{selectValue}</span>
                    </div>
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
              </form>
              {tempDresses.length > 0 ? (
                <div style={{ marginTop: "19px" }} className="col-8">
                  <div className="container containerProducts">
                    <div className="row">
                      {tempDresses ? (
                        tempDresses.length > 0 ? (
                          tempDresses.map((dress, i) => {
                            if (
                              dress.status == 1 &&
                              (dress.dressSet == "" ||
                                dress.dressSet == undefined)
                            )
                              return (
                                <Link
                                  key={i}
                                  style={{ color: "#b74160" }}
                                  onClick={() => addViesCounter(dress)}
                                  to="/dress"
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
                                    >
                                      {/* {dress.images.imgCollection.map((o,i)=>
                {
                  if(i==0){
                    return <img key={i} className='imgOption' src={o.url} alt={"dress"} />

                  }
                })} */}
                                    </div>
                                    {/* <br /> */}
                                    <div className="productDown">
                                      <h3>{dress.description}</h3>
                                      {/* <hr></hr> */}
                                      <p
                                        style={{
                                          fontSize: "18px",
                                          paddingBottom: "4px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {dress.price}₪{" "}
                                      </p>
                                      <p>מידה:{dress.size}</p>
                                      {/* <CirclePicker  colors={[dress.color.name]}/> */}
                                      {/* <button onClick={()=>deleteMe(dress._id)}>delete</button> */}
                                    </div>
                                  </div>
                                </Link>
                              );
                          })
                        ) : (
                          <>
                            <p>;;;</p>
                          </>
                        )
                      ) : (
                        "Loading..."
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="messegeThereIsNotMatchDresses">
                    {" "}
                    אין שמלות מתאימות במאגר
                  </h2>
                </>
              )}
            </div>
            <Statistics />
          </div>
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
    </div>
  );
});

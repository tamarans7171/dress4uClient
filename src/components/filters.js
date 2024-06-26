import React, { useEffect, useState } from "react";
import axios from "axios";
import { CirclePicker } from "react-color";
import MultiRangeSlider from "./slider/src/component/multiRangeSlider/MultiRangeSlider";
import "./slider/src/component/multiRangeSlider/multiRangeSlider.css";
function Filters(props) {
  const [checkedStyles, setCheckedStyles] = useState();

  const [colors, setColors] = useState([]);
  const [colorChoosen, setColorChoosen] = useState();
  const [idColorChoosen, setIdColorChoosen] = useState();
  const [colorsDictionary, setColorsDictionary] = useState({});
  const [filterStyles, setFilterStyles] = useState([]);

  const [styles, setStyles] = useState();
  useEffect(() => {
    getStyles();
    getColors();
  }, []);

  // useEffect(() => {
  //   props.updateStylesFilter(filterStyles)

  // }, [filterStyles])
  async function getColors() {
    await axios.get("http://localhost:3003/colors/getColors").then((res) => {
      let temp = {};
      console.log(res.data);
      res.data.forEach((t) => {
        temp[t.name] = t._id;
      });
      console.log(temp);
      setColorsDictionary(temp);
      let mapColors = res.data.map((c) => c.name);
      setColors(mapColors);
    });
  }

  async function getStyles() {
    await axios.get("http://localhost:3003/styles/getStyles").then((res) => {
      setStyles(res.data);
      let tempStyles = res.data.map((s) => false);
      setCheckedStyles(tempStyles);
    });
  }

  function handleChangeComplete(color, event) {
    setColorChoosen(color.hex);
    props.updateColorFilter(colorsDictionary[color.hex]);
    // console.log(,color.hex);colorsDictionary[color.hex]
    setIdColorChoosen(colorsDictionary[color.hex]);
    // console.log(state);
  }

  function updateStyles(i, status) {
    console.log(i, status, "kkkkkkkkkkkkkkk");
    let temp = checkedStyles;
    temp[i] = status;
    setCheckedStyles([...temp]);
    console.log(temp);
    let tempStyles = checkedStyles
      .map((b, i) => {
        if (b) return styles[i]._id;
      })
      .filter((x) => x != undefined);

    props.updateStylesFilter(tempStyles);
  }
  return (
    <div className="filters">
      <h3>סינון לפי סגנון</h3>
      {styles &&
        styles.map((s, i) => (
          <div key={i} className="checkbox-wrapper-39">
            <label>
              <input
                onChange={(e) => {
                  updateStyles(i, e.target.checked);
                }}
                value={s._id}
                type="checkbox"
              />
              <span className="checkbox"></span>
            </label>
            {s.name}
          </div>
        ))}
      <hr />
      <h3>סינון לפי מחיר</h3>
      <MultiRangeSlider
        min={88}
        max={1200}
        onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)}
      />
      <hr />
      <h3>סינון לפי צבע</h3>
      <CirclePicker
        color={colorChoosen}
        onChangeComplete={handleChangeComplete}
        colors={colors}
      />
    </div>
  );
}

export default Filters;

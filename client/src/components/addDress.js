import Select, { components } from "react-select";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import FileBase64 from "react-file-base64";
import { CirclePicker } from "react-color";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { border, borderColor, style } from "@mui/system";
import { Checkroom } from "@mui/icons-material";
import "./addDress.css";
import {API_URL, doApiGet, doApiMethod, TOKEN_NAME} from '../services/apiService'
function mapStateToProps(state) {
  return {
    user: state.User.user,
  };
}
export default connect(mapStateToProps)(function AddDress(props) {
  const { user } = props;
  const [temp, settemp] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [subAreas, setSubAreas] = useState();
  const [areas, setAreas] = useState([]);
  const [sizeError, setSizeError] = useState("");
  const [areaChoosen, setAreaChoosen] = useState();
  const [colors, setColors] = useState([]);
  const [colorChoosen, setColorChoosen] = useState();
  const [newDress, setNewDress] = useState({
    description: "",
    landlord: user._id,
    price: "",
    size: "",
    uploadDate: new Date(),
    style: selectedOptions,
    color: "",
    subArea: "",
    images: items,
  });
  const [setDresses, setSetDresses] = useState([]);
  const [setDressesImages, setSetDressesImages] = useState([]);
  const [styles, setStyles] = useState();
  const [colorsDictionary, setColorsDictionary] = useState({});
  const [image, setImage] = useState([]);

  // const myStyles = reactCSS({
  //   'default': {
  //     color: {
  //       width: '36px',
  //       height: '14px',
  //       borderRadius: '2px',
  //       background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
  //     },
  //     swatch: {
  //       padding: '5px',
  //       background: '#fff',
  //       borderRadius: '1px',
  //       boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
  //       display: 'inline-block',
  //       cursor: 'pointer',
  //     },
  //     popover: {
  //       position: 'absolute',
  //       zIndex: '2',
  //     },
  //     cover: {
  //       position: 'fixed',
  //       top: '0px',
  //       right: '0px',
  //       bottom: '0px',
  //       left: '0px',
  //     },
  //   },
  // });

  useEffect(() => {
    getStyles();
    getColors();
    getAreas();
  }, []);

  useEffect(() => {
    console.log(user.firstName == undefined);
    getSubAreas();
    console.log("ho");
  }, [areaChoosen]);

  async function getStyles() {
    await axios.get("http://localhost:3003/styles/getStyles").then((res) => {
      setStyles(res.data);
    });
  }

  async function getAreas() {
    await axios.get("http://localhost:3003/areas/getAreas").then((res) => {
      setAreas(res.data);
    });
  }

  async function getSubAreas() {
    if (areaChoosen)
      await axios
        .get("http://localhost:3003/subAreas/getSubAreasByArea/" + areaChoosen)
        .then((res) => {
          console.log(res.data);
          setSubAreas(res.data);
        });
  }

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

  function onFileChange(e) {
    setImage({ imgCollection: e.target.files });
    if (e.target.files && e.target.files[0]) {
      settemp(Object.values(e.target.files).map((i) => URL.createObjectURL(i)));
    }
    console.log(e.target.files);
  }

  async function saveNewDress() {
    let temp = newDress;
    temp.style = selectedOptions;
    // temp.images=items
    if (
      newDress.color == "" ||
      newDress.size == "" ||
      newDress.price == "" ||
      newDress.style == [] ||
      newDress.description == "" ||
      image.length == 0
    )
      alert("עליך למלא את כל הפרטים!");
    else {
      console.log(temp);

      var formData = new FormData();
      for (const key of Object.keys(image.imgCollection)) {
        formData.append("imgCollection", image.imgCollection[key]);
      }
      console.log(":::::  " + formData + "  /////////////////////////");
      if (
        newDress.size < 0 ||
        (newDress.size > 20 && newDress.size < 34) ||
        newDress.size > 54
      ) {
        setSizeError(
          "עליך להכניס מידה תקינה: לילדות בין 0-20, ולנשים בין 34-54"
        );
      } else {
        if (setDresses.length > 0) {
          let tempSetDresses = [...setDresses, newDress];
          let tempSetDressesImage = [...setDressesImages, formData];
          dispatch({ type: "UPDATEDRESSES", payload: tempSetDresses });
          dispatch({ type: "UPDATEARRIMAGES", payload: tempSetDressesImage });
        } else {
          dispatch({ type: "UPDATEDRESS", payload: temp });
          dispatch({ type: "UPDATEIMAGES", payload: formData });
        }

        if (user.firstName == undefined) {
          navigate("/login", { flag: -1 });
        } else {
          navigate("/payments", { state: { sum: 30, type: "newDress" } });
        }
        //      else {
        //       alert("יש 😊 הצלחת להעלות את השמלה לאתר, השמלה רק צריכה לעבור את אישור המנהל.")
        //             await axios.post("http://localhost:3030/dress/addDress", temp).then((res)=>{
        //   console.log(res,"jjjjjjjjjjjjj");
        // })
        //       navigate("/allProducts")
        //     }
      }
    }

    console.log(temp);
  }

  function changeDefaultImage(obj) {
    let tempItems = items;
    tempItems = tempItems.map((item) => {
      if (item.id == obj.id) return { ...item, defaultSelected: true };
      else return { ...item, defaultSelected: false };
    });
    console.log(tempItems);
    setItems(tempItems);
  }

  function handleChangeComplete(color, event) {
    setColorChoosen(color.hex);
    console.log(colorsDictionary[color.hex]);
    setNewDress({ ...newDress, color: colorsDictionary[color.hex] });
    // console.log(state);
  }
  const InputOption = ({
    getStyles,
    Icon,
    isDisabled,
    isFocused,
    isSelected,
    children,
    innerProps,
    ...rest
  }) => {
    const [isActive, setIsActive] = useState(false);
    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);
    const onMouseLeave = () => setIsActive(false);

    // styles
    let bg = "transparent";
    if (isFocused) bg = "#eee";
    if (isActive) bg = "#B2D4FF";

    const style = {
      alignItems: "center",
      backgroundColor: bg,
      color: "inherit",
      display: "flex ",
    };

    // prop assignment
    const props = {
      ...innerProps,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      style,
    };

    return (
      <components.Option
        {...rest}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isSelected={isSelected}
        getStyles={getStyles}
        innerProps={props}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            console.log(e.target);
          }}
        />
        {children}
      </components.Option>
    );
  };
  // console.log(selectedOptions);
  // const allOptions = [
  //   { value: "option 1", label: "option 1" },
  //   { value: "option 2", label: "option 2" },
  //   { value: "option 3", label: "option 3" },
  //   { value: "option 4", label: "option 4" }
  // ];

  const customStyles = {
    control: (base) => ({
      ...base,
      display: "block",
      width: "100%",
      padding: "calc(var(--size-bezel) * 1.5) var(--size-bezel)",
      color: "currentColor",
      background: "translate(0, 0)",
      backgroundColor: "#ffffff99",
      minHeight: "30px",
    }),
  };
  function addDressToSet() {
    let temp = newDress;
    temp.style = selectedOptions;
    // temp.images=items
    if (
      newDress.color == "" ||
      newDress.size == "" ||
      newDress.price == "" ||
      newDress.style == [] ||
      newDress.description == "" ||
      image.length == 0
    )
      alert("עליך למלא את כל הפרטים!");
    else {
      console.log(temp);
      var formData = new FormData();
      for (const key of Object.keys(image.imgCollection)) {
        formData.append("imgCollection", image.imgCollection[key]);
      }

      if (
        newDress.size < 0 ||
        (newDress.size > 20 && newDress.size < 34) ||
        newDress.size > 54
      ) {
        setSizeError(
          "עליך להכניס מידה תקינה: לילדות בין 0-20, ולנשים בין 34-54"
        );
      } else {
        setColorChoosen("");
        setSetDresses([...setDresses, temp]);
        setNewDress({
          description: "",
          landlord: user._id,
          price: "",
          size: "",
          uploadDate: new Date(),
          style: selectedOptions,
          subArea: "",
          images: items,
        });
        setSetDressesImages([...setDressesImages, formData]);
        setImage([]);
        setSelectedOptions([]);
        setAreaChoosen("");
      }
    }
  }
  return (
    <div className="addDress addDressPage">
      <article className="l-design-widhtAdd">
        <h1 className="h1Add">מלא את השדות בהתאם לשמלה אותה ברצונכם להעלות</h1>
        <div className="cardAdd card--accentAdd">
          <h2 style={{ display: "flex" }}>
            <Checkroom
              sx={{ fontSize: "40px", marginLeft: "4px", rotate: "90deg" }}
            />
            שמלה חדשה
          </h2>
          <label className="inputAdd">
            <input
              value={newDress.description}
              onChange={(e) => {
                setNewDress({ ...newDress, description: e.target.value });
              }}
              className="input__fieldAdd"
              type="text"
              placeholder=" "
            />
            <span className="input__labelAdd">תאור</span>
          </label>
          <label className="inputAdd">
            <input
              value={newDress.price}
              onChange={(e) => {
                setNewDress({ ...newDress, price: e.target.value });
              }}
              className="input__fieldAdd"
              type="number"
              placeholder=" "
            />
            <span className="input__labelAdd">מחיר</span>
          </label>
          <label className="inputAdd">
            <input
              value={newDress.size}
              onChange={(e) => {
                setNewDress({ ...newDress, size: e.target.value });
              }}
              className="input__fieldAdd"
              type="text"
              placeholder=" "
            />
            <span className="input__labelAdd">מידה</span>
          </label>
          <span className="errors">{sizeError}</span>
          <label className="inputAdd">
            {styles && (
              <div>
                <Select
                  className="input__fieldAdd"
                  defaultValue={[]}
                  isMulti
                  // value={selectedOptions.map(s=>s.value)}
                  styles={customStyles}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  onChange={(options) => {
                    if (Array.isArray(options)) {
                      setSelectedOptions(options.map((opt) => opt.value));
                    }
                  }}
                  options={styles.map((s) => {
                    return { value: s._id, label: s.name };
                  })}
                  components={{
                    Option: InputOption,
                  }}
                />
              </div>
            )}
            <span className="input__labelAdd">סגנון</span>
          </label>
          <label className="inputAdd">
            <div className="circlePicker">
              <p style={{ position: "initial" }} className="input__labelAdd">
                צבע
              </p>
              <CirclePicker
                className="ciclePickerStyle"
                styles={{ border: "black 2px solid" }}
                color={colorChoosen}
                onChangeComplete={handleChangeComplete}
                colors={colors}
              />
            </div>
          </label>
          <label className="inputAdd">
            <select
              value={areaChoosen}
              className="input__fieldAdd"
              defaultValue={""}
              onChange={(e) => setAreaChoosen(e.target.value)}
            >
              <option value="" disabled hidden>
                בחר אזור
              </option>
              {areas &&
                areas.map((s, i) => {
                  return (
                    <option className="input__fieldAdd" key={i} value={s._id}>
                      {s.name}
                    </option>
                  );
                })}
            </select>
            <span className="input__labelAdd">אזור</span>
          </label>
          <label className="inputAdd">
            <select
              value={newDress.subArea}
              className="input__fieldAdd"
              defaultValue={""}
              onChange={(e) =>
                setNewDress({ ...newDress, subArea: e.target.value })
              }
            >
              <option value="" disabled hidden>
                בחר תת-אזור
              </option>

              {subAreas ? (
                subAreas.map((s, i) => {
                  return (
                    <option className="input__fieldAdd" key={i} value={s._id}>
                      {s.name}
                    </option>
                  );
                })
              ) : (
                <option key={0} value="" disabled hidden>
                  בחר אזור
                </option>
              )}
            </select>
            <span className="input__labelAdd">תת-אזור</span>
          </label>
          <label className="inputAdd">
            <input
              className="input__fieldAdd"
              type="file"
              name="imgCollection"
              onChange={(e) => {
                onFileChange(e);
                console.log(e.target.files);
              }}
              multiple
            />

            <span className="input__labelAdd">תמונות</span>
          </label>
          <div className="button-groupAdd">
            <Fab
              variant="extended"
              onClick={saveNewDress}
              size="medium"
              className="addDressBtn"
              aria-label="add"
            >
              <AddIcon />
              {newDress.landlord == undefined
                ? "הרשם/התחבר ועדכן שמלה"
                : "עדכן שמלה"}
            </Fab>
            {/* <Fab variant="extended" onClick={addDressToSet} size="medium" color="secondary" aria-label="add">
             <AddIcon />
             {"הוסף שמלה לסט"}
            </Fab> */}
          </div>
        </div>
      </article>
      {/* {setDresses.length > 0 && <h3>כמות השמלות בסט: {setDresses.length}</h3>}
      {temp && temp.length > 0 && (
        <div>
          <h3>בחר את התמונה שתוגדר כברירת מחדל בתצוגה</h3>
          <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {temp.map((item, i) => (
              <ImageListItem
                onClick={() => {
                  changeDefaultImage(item);
                }}
                key={i}
              >
                <img
                  style={
                    item.defaultSelected
                      ? { border: "3px solid red" }
                      : { border: "3px solid black" }
                  }
                  src={`${item.name}`}
                  srcSet={`${item}`}
                  alt={item.name}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      )} */}

      <svg xmlns="http://www.w3.org/2000/svg" className="hiddenAdd">
        <symbol id="icon-coffee" viewBox="0 0 20 20">
          <title>icon-coffee</title>
          <path
            fill="currentColor"
            d="M15,17H14V9h3a3,3,0,0,1,3,3h0A5,5,0,0,1,15,17Zm1-6v3.83A3,3,0,0,0,18,12a1,1,0,0,0-1-1Z"
          />
          <rect
            fill="currentColor"
            x="1"
            y="7"
            width="15"
            height="12"
            rx="3"
            ry="3"
          />
          <path
            fill="var(--color-accent)"
            d="M7.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,0,1-1.79.89Z"
          />
          <path
            fill="var(--color-accent)"
            d="M3.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"
          />
          <path
            fill="var(--color-accent)"
            d="M11.07,5.42a5.45,5.45,0,0,1,0-4.85,1,1,0,0,1,1.79.89,3.44,3.44,0,0,0,0,3.06,1,1,0,1,1-1.79.89Z"
          />
        </symbol>
      </svg>
    </div>
  );
});

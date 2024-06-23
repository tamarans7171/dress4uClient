import React, { useState, useEffect } from "react";
import "./addDress.css";
import Select, { components } from "react-select";
import { Fab, ImageList, ImageListItem } from "@mui/material";
import { Checkroom, Add } from "@mui/icons-material";
import { CirclePicker } from "react-color";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL, doApiGet } from "../services/apiService";

function mapStateToProps(state) {
  return {
    user: state.User.user,
  };
}
export default connect(mapStateToProps)(function AddDress(props) {
  const { user } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [subAreas, setSubAreas] = useState();
  const [areas, setAreas] = useState([]);
  const [sizeError, setSizeError] = useState("");
  const [areaChoosen, setAreaChoosen] = useState();
  const [colors, setColors] = useState([]);
  const [images, setImages] = useState([]);
  const [newDress, setNewDress] = useState({
    description: "",
    landlord: user._id,
    price: "",
    size: "",
    uploadDate: new Date(),
    style: selectedOptions,
    color: "",
    subArea: "",
    images: [],
    defaultImage: images.length > 0 ? images[0] : "",
  });
  const [styles, setStyles] = useState();
  const [colorsDictionary, setColorsDictionary] = useState({});

  useEffect(() => {
    getStyles();
    getColors();
    getAreas();
  }, []);

  useEffect(() => {
    getSubAreas();
  }, [areaChoosen]);

  async function getStyles() {
    const stylesData = await doApiGet(API_URL + "/styles/getStyles");
    setStyles(stylesData.data);
  }

  async function getAreas() {
    const areasData = await doApiGet(API_URL + "/areas/getAreas");
    setAreas(areasData.data);
  }

  async function getSubAreas() {
    if (areaChoosen) {
      const subAreasByAreaData = await doApiGet(
        `${API_URL}/subAreas/getSubAreasByArea/${areaChoosen}`
      );
      setSubAreas(subAreasByAreaData.data);
    }
  }

  async function getColors() {
    const resColors = await doApiGet(`${API_URL}/colors/getColors`);
    let tempDictionaryColors = {};
    resColors.data.forEach((t) => {
      tempDictionaryColors[t.name] = t._id;
    });
    setColorsDictionary(tempDictionaryColors);
    let mapColors = resColors.data.map((c) => c.name);
    setColors(mapColors);
  }

  function onFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setImages({ imgCollection: e.target.files });
    }
  }

  async function saveNewDress() {
    let temp = {...newDress};
    temp.style = selectedOptions;
    if (
      newDress.color === "" ||
      newDress.size === "" ||
      newDress.price === "" ||
      newDress.style.length === 0 ||
      newDress.description === "" ||
      images.length === 0
    )
      alert("עליך למלא את כל הפרטים!");
    else {
      var formData = new FormData();
      for (const key of Object.keys(images.imgCollection)) {
        formData.append("imgCollection", images.imgCollection[key]);
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
        dispatch({ type: "UPDATEDRESS", payload: temp });
        dispatch({ type: "UPDATEIMAGES", payload: formData });

        if (user.firstName === undefined) {
          navigate("/login", { flag: -1 });
        } else {
          navigate("/payments", { state: { sum: 30, type: "newDress" } });
        }
      }
    }
  }

  function handleChangeComplete(color, event) {
    setNewDress({ ...newDress, color: colorsDictionary[color.hex] });
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
        <input type="checkbox" checked={isSelected} />
        {children}
      </components.Option>
    );
  };
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
                color={
                  newDress.color
                    ? Object.keys(colorsDictionary).filter(
                        (key, value) => colorsDictionary[key] === newDress.color
                      )[0]
                    : ""
                }
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
              <Add />
              {newDress.landlord === undefined
                ? "הרשם/התחבר ועדכן שמלה"
                : "עדכן שמלה"}
            </Fab>
          </div>
        </div>
      </article>

      {images.imgCollection && (
        <div>
          <h3>בחר את התמונה שתוגדר כברירת מחדל בתצוגה</h3>
          <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {Object.values(images.imgCollection).map((item, i) => (
              <ImageListItem
                onClick={() => {
                  setNewDress({ ...newDress, defaultImage: item });
                }}
                key={i}
              >
                <img
                  style={
                    item === newDress.defaultImage
                      ? { border: "3px solid red" }
                      : { border: "3px solid black" }
                  }
                  src={`${URL.createObjectURL(item)}`}
                  alt={item.name}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      )}
    </div>
  );
});

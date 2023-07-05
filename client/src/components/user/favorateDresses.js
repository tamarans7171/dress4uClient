import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  API_URL,
  doApiGet,
  doApiMethod,
  TOKEN_NAME,
} from "../../services/apiService";
import { connect } from "react-redux";
import {Link} from 'react-router-dom'

function mapStateToProps(state) {
  return {
    user: state.User.user,
  };
}

export default connect(mapStateToProps)(function FavorateDresses(props) {
  let { user } = props;
  const [state, setState] = useState([]);
  const [dresses, setDresses] = useState([]);
  const [favoratedresses, setFavorateDresses] = useState([]);

  useEffect(() => {
    getDresses()
  }, []);
  async function getDresses() {
    
    await axios
    .get("http://localhost:3003/dresses/getDresses")
    .then(async (res) => {
        setDresses(res.data);
        await axios                                                             
          .get("http://localhost:3003/areas/getareas")                  
          .then(async (areas) => {
            console.log(areas.data);
            // מקבל את כל תתי האזורים
            let tempArr = res.data.map((d) => {
              let area = areas.data.filter((a) => d.subArea.area == a._id);
              console.log(area[0]);
              if (area[0] != undefined) d.subArea.area = area[0];

              return d;
            });
            let t = tempArr.filter((d) => d.status == 1);
            setDresses(t);
            getPerfrences(t);
          });
      });
    }
    async function getPerfrences(dressesM) {
      let url = API_URL + "/perferences/getPerferenceByUser/" + user._id;
      
      try {
      let resp = await doApiGet(url);
      
      let perferencesTemp = resp.data.map((perference)=>{
        console.log(perference);
        console.log(dressesM);
        let filterAns = dressesM.filter((d)=>d._id == perference.dress)
        // console.log(filterAns);
        if(filterAns.length && filterAns.length>0)
        return filterAns[0]
      })
      setFavorateDresses(perferencesTemp);
      // console.log(perferencesTemp);
    } catch (error) {
      alert("סליחה, יש בעיה באתר - תחזור מאוחר יותר");
    }
  }

  async function addViesCounter(dress) {
    dress.viewCounter += 1;
    await axios
      .put("http://localhost:3003/dresses/updateDress/" + dress._id, dress)
      .then((ans) => {
        console.log(ans.data);
      });
  }
  return (
    <div>
      
      {favoratedresses ? (
        favoratedresses.length > 0 ? (
          favoratedresses.map((d, i) => {
            return       <Link
            key={i}
            style={{ color: "#b74160" }}
            onClick={() => addViesCounter(d)}
            to="/dress"
            state={d}
          >
            {" "}
            <div
              key={i}
              className="boxO col-lg-4 col-sm-6 detailDiv"
            >
              <div
                style={{
                  backgroundImage: `url(${d.images.imgCollection[0].url})`,
                }}
                className="productUp"
              >
              
              </div>
              {/* <br /> */}
              <div className="productDown">
                <h3>{d.description}</h3>
                {/* <hr></hr> */}
                <p
                  style={{
                    fontSize: "18px",
                    paddingBottom: "4px",
                    fontWeight: "bold",
                  }}
                >
                  {d.price}₪{" "}
                </p>
                <p>מידה:{d.size}</p>
                {/* <CirclePicker  colors={[dress.color.name]}/> */}
                {/* <button onClick={()=>deleteMe(dress._id)}>delete</button> */}
              </div>
            </div>
          </Link>;
          })
        ) : (
          <h1>אין שמלות מועדפות</h1>
        )
      ) : (
        " בטעינה..."
      )}
    </div>
  );
});

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

  useEffect(() => {
    getPerfrences();
  }, []);

  async function getPerfrences() {
    let url = API_URL + "/perferences/getPerferenceByUser/" + user._id;

    try {
      let resp = await doApiGet(url);
      
      let perferencesTemp = await resp.data.map(async(perference)=>{
        let url2 = API_URL + "/dresses/getDressById/"+perference.dress;

        try {
          let resp2 = await doApiGet(url2);
          console.log( {...perference, dress:resp2.data});
          return {...perference, dress:resp2.data}
          
        } catch (error) {
          alert("סליחה, יש בעיה באתר - תחזור מאוחר יותר");
        }

      })
      setDresses(perferencesTemp);
      console.log(perferencesTemp);
    } catch (error) {
      alert("סליחה, יש בעיה באתר - תחזור מאוחר יותר");
    }
  }

  async function addViesCounter(dress) {
    dress.viewCounter += 1;
    await axios
      .put("https://dress4u.onrender.com/dresses/updateDress/" + dress._id, dress)
      .then((ans) => {
        console.log(ans.data);
      });
  }
  return (
    <div>
      
      {dresses ? (
        dresses.length > 0 ? (
          dresses.map((d, i) => {
            return       <Link
            key={i}
            style={{ color: "#b74160" }}
            onClick={() => addViesCounter(d.dress)}
            to="/dress"
            state={d.dress}
          >
            {" "}
            <div
              key={i}
              className="boxO col-lg-4 col-sm-6 detailDiv"
            >
              <div
                style={{
                  backgroundImage: `url(${d.dress.images.imgCollection[0].url})`,
                }}
                className="productUp"
              >
              
              </div>
              {/* <br /> */}
              <div className="productDown">
                <h3>{d.dress.description}</h3>
                {/* <hr></hr> */}
                <p
                  style={{
                    fontSize: "18px",
                    paddingBottom: "4px",
                    fontWeight: "bold",
                  }}
                >
                  {d.dress.price}₪{" "}
                </p>
                <p>מידה:{d.dress.size}</p>
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

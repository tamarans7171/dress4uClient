import React from 'react'
import "../../App.css"
import "../addDress.css"
import "./sonalDetails.css"
import {connect} from 'react-redux'
import Fab from '@mui/material/Fab';
import DoneOutline from '@mui/icons-material/DoneOutline';
import { useState } from 'react';
import axios from 'axios'
function mapStateToProps(state) {
    console.log(state);
    return {
      user: state.User.user,
      //   dress: state.Dress.dress
    };
  } 
  export default connect(mapStateToProps)(function SonalDetails(props) {
    const [user, setUser] = useState(props.user)
  function updateDetails() {
    let tempUser = user
    let address = user.address.split(" ")
    let ans = address.findIndex((a) =>{
      return isNum(a)
    })
    for (let i = 0; i < ans; i++) {
      tempUser.address.street += address[i]+" "
    }
    tempUser.address.street = tempUser.address.street.trim()
    tempUser.address.numHouse = Number(address[ans])
    for (let i = ans + 1; i < address.length; i++) {
      tempUser.address.city += address[i]+" "
    }
    tempUser.address.city = tempUser.address.city.trim()
// await axios.patch()
  }

  function isNum(v) {
    return /\d/.test(v);
}
    return (
    <div className='details'>
    <div className="cardDetails card--accentDetails">
          <h2 className='h2Details'>עדכון פרטים</h2>
          <label className="inputDetails">
            <input value={user.firstName} onChange={(e) => { setUser({ ...user, firstName: e.target.value }) }} className="input__fieldDetails" type="text" placeholder={user.firstName}/>
            <span className="input__labelDetails">שם פרטי</span>
          </label>    
          <label className="inputDetails">
            <input value={user.lastName} onChange={(e) => { setUser({ ...user, lastName: e.target.value }) }} className="input__fieldDetails" type="text" placeholder=" " />
            <span className="input__labelDetails">שם משפחה</span>
          </label>    
          <label className="inputDetails">
            <input value={user.address.street+" "+user.address.numHouse+", "+user.address.city} onChange={(e) => { setUser({ ...user, address: e.target.value }) }} className="input__fieldDetails" type="text" placeholder=" " />
            <span className="input__labelDetails">כתובת</span>
          </label>
               <label className="inputDetails">
            <input value={user.phone} onChange={(e) => { setUser({ ...user, phone: e.target.value }) }} className="input__fieldDetails" type="text" placeholder=" " />
            <span className="input__labelDetails">טלפון</span>
          </label>      
          <label className="inputDetails">
            <input value={user.email} onChange={(e) => { setUser({ ...user, email: e.target.value }) }} className="input__fieldDetails" type="email" placeholder=" " />
            <span className="input__labelDetails">מייל</span>
          </label>    
          {/* <label className="inputDetails"> */}
            {/* <input value={user.password} onChange={(e) => { setUser({ ...user, password: e.target.value }) }} className="input__fieldDetails" type="password" placeholder=" " />
            <span className="input__labelDetails">סיסמא</span>
          </label>     */}
          <div>
          <Fab variant="extended" onClick={updateDetails} size="medium"className="addDressBtn"  color="secondary" aria-label="add">
             <DoneOutline sx={{marginLeft:"5px"}}/>
             {"עדכון פרטים"}
            </Fab>
          </div>
        </div>
    </div>
  )
})

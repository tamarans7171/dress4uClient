import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

function FavorateDresses() {
  const [state, setState] = useState([])
  async function getPerferfrmence() {
    await axios.get("")
  }
  useEffect(() => {
    
  }, [])
  return (
    <div></div>
  )
}

export default FavorateDresses
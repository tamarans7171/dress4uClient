import React,{ useState, useEffect} from 'react'
import { Col, Row, Statistic } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Bar } from "react-chartjs-2";
import {CategoryScale,registerables} from 'chart.js'; 
function Statistics() {
  ChartJS.register(ArcElement, Tooltip, Legend,CategoryScale,...registerables);
  // Chart.register(CategoryScale);

    const [AVGSubscription, setAVGSubscription] = useState()
    const [payments, setPayments] = useState()
    const [dresses, setDresses] = useState()
    const [stylesCnt, setStylesCnt] = useState()
    const [objectToPercentsStyles, setObjectToPercentsStyles] = useState()
    const [cntDresses, setCntDresses] = useState(0)
    
    const data = {
        labels: stylesCnt ? stylesCnt.map(s => s.name):null,
        datasets: [
          {
            label: 'אחוז שמלות',
            data: stylesCnt ? stylesCnt.map(s => s.cnt / cntDresses * 100) : null,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 102, 56, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 102, 56, 1)',

            ],
            borderWidth: 1,
            hoverOffset: 15, 
            hoverBorderWidth:3	

          },
        ],
      };
      const dataBar = {
        labels: ["ינואר", "פברואר", "מרץ", "יוני", "יולי"],
        datasets: [
          {
            label: "אחוזי מנויים",
            data: [4, 6, 4, 8, 11],
            backgroundColor: "#b74160"
          }
        ]
      };
    
      const options = {
        responsive: false,
        scales: {
          x: 
            {
              gridLines: {
                display: true,
                drawBorder: false,
                borderDash: [3, 3],
                zeroLineColor: "#b74160"
              },
              categoryPercentage: 0.7,
              barPercentage: 0.9,
              ticks: {
                beginAtZero: true
              }
            }
          ,
          y: 
            {
              display: false,
              gridLines: {
                display: false,
                zeroLineColor: "transparent"
              },
              ticks: {
                beginAtZero: true
              }
            }
          
        }
      };
    useEffect(() => {
        getPayments()
        getDresses()

    }, [])
    async function getPayments() {
        await axios.get("https://dress4u.onrender.com/payments/getPayments").then((resPay)=>{
            setPayments(resPay.data)
            console.log(resPay.data);
            let ansAVGSubscriptions = resPay.data.reduce((a, b)=>{
                return a + checkNewSubscrptionThisMonth(b)
            },0)
            setAVGSubscription(ansAVGSubscriptions)
    })

    }

    async function getDresses() {
        await axios.get("https://dress4u.onrender.com/dresses/getDresses").then(async(res)=>{
            let now = new Date()
            let relevantDresses = res.data.filter((d)=>d.endTime > now
            // && d.status ==1
            )
            setDresses(relevantDresses)
            console.log(res.data);
            let cnt = 0
            await axios.get("https://dress4u.onrender.com/styles/getStyles").then((resStyles)=>{
            let tempPercentsStyles = resStyles.data.map((style =>{
              let cntTemp = 0;
              for(var i = 0; i < res.data.length; i++) {
                let tempDressFound = res.data[i].style.filter(s => s._id == style._id)
                if (tempDressFound.length > 0) {
                    cntTemp++;
                    
                }
            }
  
                style.cnt = cntTemp
                cnt +=  cntTemp
                return style
            }))
            console.log(tempPercentsStyles);
            setCntDresses(cnt)
            setStylesCnt(tempPercentsStyles)
    })
            
    })
    }

    function checkNewSubscrptionThisMonth(payment) {
        let check = new Date()
        check.setMonth(check.getMonth - 1);
        if(payment.date > check && payment.amount == 30) {
            return 1
        }
        return 0
    }
  return (
    <div className='statisticsPage'>
   
    {/* {AVGSubscription && <Statistic title="ממוצע מנויים חדשים בחודש" value={AVGSubscription} prefix={<PlusSquareOutlined />} />}  
  
      <Statistic title="Unmerged" value={93} suffix="/ 100" /> */}
    
  {stylesCnt && <Pie data={data} options={{radius:"44"}} />}
  <hr></hr> 
  <Bar width="200" height="200" style={{marginTop:"10px"}} data={dataBar} options={options} />
 
  </div>
  )
}

export default Statistics
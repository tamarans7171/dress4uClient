import './App.css';
import {Route,Routes} from 'react-router-dom'
import NavBar from './components/navBar';
import Loggin from './components/loggin';
import AllProducts from './components/allProducts';
import AddDress from './components/addDress';
import './AppSass.scss'
import Payments from './components/payments';
import Dress from './components/dress';
import Subscription from './components/subscription';
import PermitDresses from './components/manager/permitDresses';
import SonalMenu from './components/user/sonalMenu';
import UsersPayments from './components/manager/payments';
import Users from './components/manager/users';
import Footer from './components/footer';
function App() {

  return (
    <div className='app'>
     <Routes>
      <Route path='/' element={<NavBar/>}>
        <Route path='login' element={<Loggin/>}></Route>
        <Route path='allProducts' element={<AllProducts/>}></Route>
        <Route path='dress' element={<Dress/>}></Route>
        <Route path='subscription' element={<Subscription/>}></Route>
        <Route path='addDress' element={<AddDress/>}></Route>
        <Route path='payments' element={<Payments/>}></Route>
        <Route path='permitDresses' element={<PermitDresses/>}></Route>
        <Route path='sonalMenu' element={<SonalMenu/>}></Route>
        <Route path='users' element={<Users/>}></Route>
        <Route path='userPayments' element={<UsersPayments/>}></Route>
      </Route>
     </Routes>     
     <Footer/> 
    </div>
  );
}

export default App;

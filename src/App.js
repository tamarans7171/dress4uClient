import "./App.css";
import { Route, Routes } from "react-router-dom";
import NavBar from "./Components/navBar";
import Loggin from "./Components/loggin";
import AllProducts from "./Components/allProducts";
import AddDress from "./Components/addDress";
import "./AppSass.scss";
import Payments from "./Components/payments";
import Dress from "./Components/dress";
import Subscription from "./Components/subscription";
import PermitDresses from "./Components/Manager/permitDresses";
import SonalMenu from "./Components/user/sonalMenu";
import UsersPayments from "./Components/Manager/payments";
import Users from "./Components/Manager/users";
import Footer from "./Components/footer";
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route path="login" element={<Loggin />}></Route>
          <Route path="allProducts" element={<AllProducts />}></Route>
          <Route path="dress" element={<Dress />}></Route>
          <Route path="subscription" element={<Subscription />}></Route>
          <Route path="addDress" element={<AddDress />}></Route>
          <Route path="payments" element={<Payments />}></Route>
          <Route path="permitDresses" element={<PermitDresses />}></Route>
          <Route path="sonalMenu" element={<SonalMenu />}></Route>
          <Route path="users" element={<Users />}></Route>
          <Route path="userPayments" element={<UsersPayments />}></Route>
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import Login from './Components/Login'
import Register from './Components/Register'
import ShopC from './Components/Customer/ShopC'
import HotDessertssC from './Components/Customer/HotDessertssC'
import FrozensC from './Components/Customer/FrozensC'
import YogurtsC from './Components/Customer/YogurtsC'
import IceCreamC from './Components/Customer/IceCreamsC'
import ShopM from './Components/Manager/ShopM'
import HotDessertssM from './Components/Manager/HotDessertssM'
import FrozensM from './Components/Manager/FrozensM'
import YogurtsM from './Components/Manager/YogurtsM'
import IceCreamM from './Components/Manager/IceCreamsM'
import NavBarC from './Components/Customer/NavBarC'
import BasketC from './Components/Customer/BasketC'
import NavBarM from './Components/Manager/NavBarM';
import useAuth from './Components/Hooks/useAuth';
import Payment from './Components/Customer/Payment';
import Order from './Components/Customer/Order';
import RequireAuth from './Components/Hooks/RequireAuth';
import MyOrders from './Components/Customer/MyOrders';
import AllOrders from './Components/Manager/AllOrders';
import Customers from './Components/Manager/Customers';


function App() {

  const { role } = useAuth()

  return (
    <div className="App">
      {role === 'manager' ? <NavBarM /> : <NavBarC />}



      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<ShopC />} />
        <Route path="/hotDessertss" element={<HotDessertssC />} />
        <Route path="/frozens" element={<FrozensC />} />
        <Route path="/yogurts" element={<YogurtsC />} />
        <Route path="/iceCreams" element={<IceCreamC />} />
        <Route path='/basket' element={<BasketC />} />
        <Route element={<RequireAuth allowRoles={["manager"]} />}>
        <Route path="/shopManager" element={<ShopM />} />
          <Route path="/hotDessertssManager" element={<HotDessertssM />} />
          <Route path="/frozensManager" element={<FrozensM />} />
          <Route path="/yogurtsManager" element={<YogurtsM />} />
          <Route path="/iceCreamsManager" element={<IceCreamM />} />
          <Route path='/orders' element={<AllOrders />} />
          <Route path='/customers' element={<Customers />} />
        </Route>
        <Route element={<RequireAuth allowRoles={["customer", "manager"]} />}>
          <Route path='/paymet' element={<Payment />} />
          <Route path='/order' element={<Order />} />
          <Route path='/myOrders' element={<MyOrders />} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
import React from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import '../../CSS/NavBar.css'
import 'primeicons/primeicons.css';
import { Menubar } from 'primereact/menubar';
import { removeToken } from "../../Store/authSlice";
import { useDispatch } from 'react-redux';
import useAuth from '../Hooks/useAuth'

const NavBarC = () => {

    const { _id } = useAuth()
    const dispatch = useDispatch()
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(removeToken());
        navigate("/");
    };

    const items = [
        { label: <NavLink underline="none" to="/" className={location.pathname === "/" ? "active-link" : ""}>בית</NavLink>, url: "/" },
        { label: <NavLink underline="none" to="/iceCreams" className={location.pathname === "/iceCreams" ? "active-link" : ""}>גלידות בטעמים</NavLink>, url: "/tables" },
        { label: <NavLink underline="none" to="/hotDessertss" className={location.pathname === "/hotDessertss" ? "active-link" : ""}>וופל בלגי וקרפ ותוספות</NavLink>, url: "/hotDessertss" },
        { label: <NavLink underline="none" to="/yogurts" className={location.pathname === "/yogurts" ? "active-link" : ""}>יוגורט ותוספות</NavLink>, url: "/yogurts" },
        { label: <NavLink underline="none" to="/frozens" className={location.pathname === "/frozens" ? "active-link" : ""}>פרוזן ותוספות</NavLink>, url: "/frozens" },
        _id ? { label: <NavLink underline="none" to="/myOrders" className={location.pathname === "/myOrders" ? "active-link" : ""}>הזמנות שלי</NavLink>, url: "/myOrders" } : <></>,
        _id ? { label: <NavLink underline="none" to="/" className={location.pathname === "/" ? "active-link" : ""} onClick={handleLogout}>התנתקות</NavLink>, url: "/" } : { label: <NavLink underline="none" to="/login" className={location.pathname === "/login" ? "active-link" : ""}>התחברות</NavLink>, url: "/login" },
        { label: <NavLink underline="none" to="/basket" className={location.pathname === "/basket" ? "active-link" : ""}><span id="cartIcon" className="pi pi-shopping-cart" ></span></NavLink>, url: "/basket" },
    ];

    return (
        <>
            <div>
                <Menubar model={items} />
            </div>
        </>
    )
}

export default NavBarC;



import React from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import '../../CSS/NavBar.css'
import 'primeicons/primeicons.css';
import { Menubar } from 'primereact/menubar';
import { removeToken } from "../../Store/authSlice";
import { useSelector } from "react-redux";
import { selectToken } from "../../Store/authSlice"
import { useDispatch } from 'react-redux';
import useAuth from "../Hooks/useAuth";


const NavBarM = () => {

    const { _id } = useAuth()
    const dispatch = useDispatch()
    const token = useSelector(selectToken)
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(removeToken()); 
        navigate("/");
    };


    const items = [
        { label: <NavLink underline="none" to="/" className={location.pathname === "/" ? "active-link" : ""}>בית</NavLink>, url: "/" },
        { label: <NavLink underline="none" to="/iceCreamsManager" className={location.pathname === "/iceCreamsManager" ? "active-link" : ""}>גלידות בטעמים</NavLink>, url: "/iceCreamsManager" },
        { label: <NavLink underline="none" to="/hotDessertssManager" className={location.pathname === "/hotDessertssManager" ? "active-link" : ""}>וופל בלגי וקרפ ותוספות</NavLink>, url: "/hotDessertssManager" },
        { label: <NavLink underline="none" to="/yogurtsManager" className={location.pathname === "/yogurtsManager" ? "active-link" : ""}>יוגורט ותוספות</NavLink>, url: "/yogurtsManager" },
        { label: <NavLink underline="none" to="/frozensManager" className={location.pathname === "/frozensManager" ? "active-link" : ""}>פרוזן ותוספות</NavLink>, url: "/frozensManager" },
        _id ? { label: <NavLink underline="none" to="/orders" className={location.pathname === "/orders" ? "active-link" : ""}>רשימת הזמנות</NavLink>, url: "/orders" } : <></>,
        _id ? { label: <NavLink underline="none" to="/customers" className={location.pathname === "/customers" ? "active-link" : ""}>הלקוחות שלנו</NavLink>, url: "/customers" } : <></>,
        _id ? { label: <NavLink underline="none" to="/" className={location.pathname === "/" ? "active-link" : ""} onClick={handleLogout}>התנתקות</NavLink>, url: "/" } : { label: <NavLink underline="none" to="/login" className={location.pathname === "/login" ? "active-link" : ""}>התחברות</NavLink>, url: "/login" }
    ];


    return (
        <>
            <div>
                <Menubar model={items} />
            </div>
        </>
    )
}

export default NavBarM




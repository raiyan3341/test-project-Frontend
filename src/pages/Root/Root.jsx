import React from 'react';
import { Outlet } from 'react-router'; // React Router theke Outlet import kora dorkar
import Navbar from '../../components/Navbar'; // Apnar Navbar folder path onujayi
import Footer from '../../components/Footer'; // Apnar Footer folder path onujayi

const Root = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;
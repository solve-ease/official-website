import React from "react";

import Nav from "./nav";

import imgUrl from "../assets/images/logo192.png"

import {Button1, Button2} from "./buttons";

const Header = function(){
    return (
        <header className="header flex flex-center">
            <div className="head-sub flex">
            <div className="logo-div">
            <img src={imgUrl} style={{width: "32px"}} alt="Logo"/> 
            <h1 className="logo-text">Solve-Ease</h1>

            </div>
            
            <Nav />
            <div>
            <a rel="noreferrer noopener" href="https://github.com/solve-ease/" target="_blank"  className="text-decor-none git-social"><i class='bx bxl-github'></i></a>
            <Button1 />
            <Button2 />

            </div>
            
            </div>
        </header>
    );

}

export default Header;
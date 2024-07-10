import React from "react";
import "../buttons.css"

function Button1(){
    return(
        <a href="login/" className="side-login text-decor-none">Login</a>
    );
}

function Button2(){
    return(
        <a href="register/" className="side-register text-decor-none">Get Started</a>
    );
}

export {Button1, Button2};


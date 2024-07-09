import React from "react";

import Nav from "./nav";

const Header = function(){
    return (
        <header className="header">
            <h1 className="logo">MyApp</h1>
            <Nav />
        </header>
    );

}

export default Header;
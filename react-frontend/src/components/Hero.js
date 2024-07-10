import React from "react";
// import imageUrl from "../assets/images/hero-img.jpg"
function Hero() {
    return (

        <section className="hero">
            {/* <img style={{width: '100%'}} src={imageUrl} alt="hero image" /> */}
            <div className="hero-content">
                <h2>Welcome to Our E-commerce Platform</h2>
                <p>
                    Discover a world of convenience and quality products at your fingertips.
                    Our e-commerce platform offers a wide range of items, from electronics
                    to fashion, all just a click away. With secure payments, fast shipping,
                    and excellent customer service, we're here to make your online shopping
                    experience exceptional.
                </p>
            </div>

        </section>
        
    );


}

export default Hero;

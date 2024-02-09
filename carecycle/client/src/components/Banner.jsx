import React from "react";

const Banner = () => {
    return (
        <div className="fixed w-full h-[85px] z-49">
            <img
                className="absolute w-full h-[85px] top-[46px] left-0 object-cover"
                alt="Atelier Culture Velo"
                src="./photos/cv_atelier-ete1.jpg"
            />
        </div>
    );
};

export default Banner;

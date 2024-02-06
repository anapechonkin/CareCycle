import React from "react";

const Navbar = ({ userType }) => {
    const userRole = userType === 'admin' ? 'Admin' : userType === 'editor' ? 'Volunteer' : 'CAA/Employee';

    return (
        <div className="fixed w-full h-[46px] top-0 left-0 bg-black flex justify-between items-center px-4">
            <div className="[font-family:'Holtwood_One_SC-Regular',Helvetica] font-normal text-[#15839b] text-lg">
                {userRole}
            </div>
            <div className="space-x-4">
                <span className="[font-family:'Holtwood_One_SC-Regular',Helvetica] font-normal text-white text-lg">
                    DASHBOARD
                </span>
                <span className="[font-family:'Holtwood_One_SC-Regular',Helvetica] font-normal text-white text-lg">
                    FR/EN
                </span>
                <span className="[font-family:'Holtwood_One_SC-Regular',Helvetica] font-normal text-white text-lg">
                    LOGOUT
                </span>
            </div>
        </div>
    );
};

export default Navbar;

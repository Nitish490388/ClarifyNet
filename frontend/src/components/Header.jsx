import React from "react";
import { CiLogout } from "react-icons/ci";

const Header = () => {
  const isLoggedIn = false;

  return (
    <nav className="__header h-[60px] bg-gray-900 text-white p-3 flex justify-between items-center">
      <h3 className="font-bold cursor-pointer">
        ClarifyNet
      </h3>
      <div className="__btn_container flex justify-center items-center gap-3">
        {
          isLoggedIn ? (<>
            <button

              className="bg-red-500 transition hover:bg-red-700 text-white font-bold py-3 px-4 rounded"
            >
              <CiLogout />
            </button>

          </>) : (<>
            <button

              className="bg-blue-500 transition hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign In
            </button>
          </>)
        }
      </div>
    </nav>
  );
};

export default Header;

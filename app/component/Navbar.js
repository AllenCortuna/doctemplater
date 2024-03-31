import Link from "next/link";
import React from "react";
// import { Martian_Mono } from "next/font/google";
// const geo = Martian_Mono({
//   subsets: ["latin"],
//   weight: [ "400" ,"500", "600","700"],
// });

export const Navbar = () => {
  return (
    <div className="navbar bg-base-100 px-20 bg-zinc-200">
      <div className="flex-1">
        <Link href={"/"} className={`text-md font-[600] text-zinc-600`}>
          Document Web App
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-xs">
          {/* <li>
            <Link href={""}>Create</Link>
          </li> */}

          <li>
            <details>
              <summary className="border hover:border-zinc-700">Menu</summary>
              <ul className="p-2 bg-base-100 rounded-t-none w-40 primary-text text-xs border border-zinc-300">
                <li>
                  <Link href={"/folder"}>Folder</Link>
                </li>
                <li>
                  <Link href={"/"}>Home</Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

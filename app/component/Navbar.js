import Image from "next/image";
import Link from "next/link";
import React from "react";
import dpwhLogo from '../../public/dpwhLogo.png'
export const Navbar = () => {
  return (
    <div className="navbar bg-base-200 border-b shadow px-4 md:px-10">
      <div className="flex-1">
        <Link href={"/"} className={`text-md font-[600] text-zinc-600 flex gap-5`}>
          <Image src={dpwhLogo} alt="DPWH Logo.png"  width={40} height={40}/>
          <p className="my-auto"><b>MODEO</b></p>
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="">Menu</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 mt-6 shadow">
            <li><Link href={"/"}>Home</Link></li>
            <li><Link href={"/documentation"}>Documentation</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

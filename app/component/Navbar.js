import Link from "next/link";
import React from "react";

export const Navbar = () => {
  return (
    <div className="navbar bg-base-100 px-20 bg-zinc-200">
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost text-xl font-semibold">
          GOODs Document System
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href={"/search-cert"}>Create</Link>
          </li>

          <li>
            <details>
              <summary>Menu</summary>
              <ul className="p-2 bg-base-100 rounded-t-none w-40">
                <li>
                  <Link href={"/"}>Toturials</Link>
                </li>
                <li>
                  <Link href={"/"}>Trobleshoot</Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

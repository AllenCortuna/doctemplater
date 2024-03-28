"use client";
import Link from "next/link";
import UploadExcel from "./component/UploadExcel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-24">
      {/* <Link href={"/search-cert"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          Create Certificate
        </button>
      </Link> */}
      <UploadExcel/>
    </main>
  );
}

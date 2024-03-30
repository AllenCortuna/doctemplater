"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-24">
      <Link href={"/upload-award"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          Create Award
        </button>
      </Link>
    </div>
  );
}

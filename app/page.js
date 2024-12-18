"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-24">
      {/* <Link href={"/create-batch-award"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          Create Award (batch)
        </button>
      </Link> */}

      <Link href={"/create-pio-cert"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          Cerfication Ate Ney
        </button>
      </Link>

      <Link href={"/create-3strike"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          3 Strike Policy
        </button>
      </Link>

      <Link href={"/create-memo"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          Create Memo PIO
        </button>
      </Link>

      <Link href={"/create-award"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          Create Award
        </button>
      </Link>

      <Link href={"/create-ntp"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          Create NTP
        </button>
      </Link>

      <Link href={"/create-bonds"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          Create Bonds
        </button>
      </Link>

      <Link href={"/create-oblig"}>
        <button className="btn btn-outline rounded-md text-zinc-500 text-md">
          Create Obligation Jecelle
        </button>
      </Link>
    </div>
  );
}

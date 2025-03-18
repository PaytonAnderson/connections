import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen">
      <Link href="connections" className=" pt-20">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ">
          Go to Connections
        </button>
      </Link>
    </div>
  );
}

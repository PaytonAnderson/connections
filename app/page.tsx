// app/page.tsx (or pages/index.tsx)
import Link from "next/link";
import Head from "next/head"; // Import Head component to modify metadata

export default function Home() {
  return (
    <>
      {/* Open Graph and Twitter Card metadata */}
      <Head>
        <meta property="og:title" content="Connections - NYT Clone" />
        <meta
          property="og:description"
          content="A clone of the New York Times Connections game."
        />
        <meta property="og:image" content="/logo.jfif" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta name="twitter:title" content="Connections - NYT Clone" />
        <meta
          name="twitter:description"
          content="A clone of the New York Times Connections game."
        />
        <meta name="twitter:image" content="/logo.jfif" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="flex justify-center min-h-screen">
        <Link href="connections" className="pt-20">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Go to Connections
          </button>
        </Link>
      </div>
    </>
  );
}

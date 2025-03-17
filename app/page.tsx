import Link from "next/link";

export default function Home() {
  return (
    <div>
      Hello
      <Link href="connections">connections</Link><br></br>
      <Link href="connections2">connections2</Link>
    </div>
  );
}

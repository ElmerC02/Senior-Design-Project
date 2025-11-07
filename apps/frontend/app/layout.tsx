import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Uncool Math Games</Link>
          <Link href="/games">Games</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <div style={{ marginLeft: "auto" }}>
            <Link href="/account" style={{ marginRight: 12 }}>Account</Link>
            <Link href="/login">Login</Link>
          </div>
        </nav>
        <main className="container">{children}</main>
        <footer className="footer">© CIT 480 – Uncool Math Games</footer>
      </body>
    </html>
  );
}

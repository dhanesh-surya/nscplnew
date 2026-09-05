import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container not-found">
      <div className="code">404</div>
      <h1>Page not found</h1>
      <p className="lead" style={{ margin: "0 auto 24px" }}>
        The page you are looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}

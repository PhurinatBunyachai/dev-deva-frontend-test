export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)]">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <a href="/" className="btn btn-primary">
        Go Home
      </a>
    </div>
  );
}

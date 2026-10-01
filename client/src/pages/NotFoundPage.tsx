import { Link } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Not found');
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-7xl font-black text-primary">404</p>
      <h1 className="text-2xl font-bold">This page took a wrong turn</h1>
      <p className="text-base-content/70">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to the catalog
      </Link>
    </div>
  );
}

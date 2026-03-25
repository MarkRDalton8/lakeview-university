import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LIBRARY } from '../data';

export default function LibraryBook() {
  const { slug } = useParams();
  const book = LIBRARY.find(b => b.slug === slug);

  useEffect(() => {
    // Fire Piano experience when book loads
    if (window.tp) {
      window.tp.experience.execute();
    }
  }, [slug]);

  if (!book) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1>Book Not Found</h1>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <Link to="/" style={{ color: '#0066cc', textDecoration: 'none' }}>
        ← Back to Digital Commons
      </Link>

      <div style={{ marginTop: '32px' }}>
        {book.locked && (
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: '#ff4444',
            color: 'white',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            🔒 LIBRARY ACCESS REQUIRED
          </div>
        )}

        <h1 style={{ fontSize: '32px', marginBottom: '16px', lineHeight: '1.2' }}>
          {book.title}
        </h1>

        <div style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Author:</strong> {book.author}
        </div>
        <div style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Type:</strong> {book.type}
        </div>
        <div style={{ color: '#666', marginBottom: '24px' }}>
          <strong>Published:</strong> {book.year} • {book.pages} pages
        </div>

        {book.locked ? (
          <div style={{
            padding: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            marginTop: '40px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ marginBottom: '16px' }}>Digital Library Access Required</h2>
            <p style={{ marginBottom: '24px', opacity: 0.9 }}>
              Subscribe to Lakeview Digital Commons to access our complete digital library collection.
            </p>
            <div id="piano-offer-container"></div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Read Online</h2>
            <p>This book is freely accessible. Full text would appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

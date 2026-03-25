import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LIBRARY } from '../data';

export default function LibraryBook() {
  const { slug } = useParams();
  const book = LIBRARY.find(b => b.slug === slug);

  // Only use Piano inline content lock for this specific book
  const usePianoInlineLock = slug === 'quantum-computing';

  useEffect(() => {
    // Re-trigger Composer on route change for SPA
    if (window.tp && window.tp.experience) {
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', background: '#FAF8F5', minHeight: '100vh' }}>
      {usePianoInlineLock && (
        <style>{`
          .piano-container--active ~ * {
            display: none;
          }
          .piano-container--active {
            position: relative;
          }
          .piano-container--active::before {
            content: "";
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            height: 200px;
            pointer-events: none;
            background-image: linear-gradient(
              to top,
              #FAF8F5 0%,
              #FAF8F5 20%,
              rgba(250, 248, 245, 0) 100%
            );
          }
        `}</style>
      )}

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

        <div style={{
          padding: '20px',
          background: '#f5f5f5',
          borderLeft: '4px solid #8E242A',
          marginBottom: '32px'
        }}>
          <h3 style={{ marginBottom: '12px', fontSize: '14px', textTransform: 'uppercase', color: '#666' }}>
            About This Book
          </h3>
          <p style={{ lineHeight: '1.6' }}>
            A comprehensive exploration of {book.title.toLowerCase()}, this {book.type.toLowerCase()} provides
            essential knowledge and practical insights for students and professionals alike. Essential reading
            for anyone seeking to deepen their understanding of this subject.
          </p>
        </div>

        {/* Piano inline lock pattern - only for quantum-computing */}
        {usePianoInlineLock && book.locked && <div className="piano-container"></div>}

        {/* Conditional rendering based on lock status and pattern */}
        {book.locked && !usePianoInlineLock ? (
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
          <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
            <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Table of Contents</h2>
            <ul style={{ lineHeight: '2', marginLeft: '20px', marginBottom: '24px' }}>
              <li>Chapter 1: Introduction</li>
              <li>Chapter 2: Historical Context</li>
              <li>Chapter 3: Fundamental Principles</li>
              <li>Chapter 4: Advanced Concepts</li>
              <li>Chapter 5: Practical Applications</li>
              <li>Chapter 6: Case Studies</li>
              <li>Chapter 7: Future Directions</li>
              <li>Chapter 8: Conclusion</li>
            </ul>

            <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Chapter 1: Introduction</h2>
            <p style={{ marginBottom: '16px' }}>
              This opening chapter establishes the foundation for the concepts explored throughout the book.
              We examine the historical development of the field and introduce key terminology and frameworks
              that will be essential for understanding subsequent chapters.
            </p>

            <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Chapter 2: Historical Context</h2>
            <p style={{ marginBottom: '16px' }}>
              Understanding the historical evolution of this field provides crucial context for contemporary
              approaches and methodologies. This chapter traces the development of key ideas from their origins
              to modern applications.
            </p>

            <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Chapter 3: Fundamental Principles</h2>
            <p style={{ marginBottom: '16px' }}>
              Here we delve into the core principles that underpin the entire field. These foundational concepts
              are essential for anyone seeking to work effectively in this area and will be referenced throughout
              the remainder of the text.
            </p>

            <p style={{ marginTop: '32px', fontStyle: 'italic', color: '#666' }}>
              Additional chapters continue to explore advanced topics, practical applications, and cutting-edge
              research in this field. Full access to all {book.pages} pages available to Digital Commons subscribers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

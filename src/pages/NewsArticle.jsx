import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NEWS } from '../data';

export default function NewsArticle() {
  const { slug } = useParams();
  const article = NEWS.find(n => n.slug === slug);

  useEffect(() => {
    // Fire Piano experience when news loads
    if (window.tp) {
      window.tp.experience.execute();
    }
  }, [slug]);

  if (!article) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1>Article Not Found</h1>
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
        {article.locked && (
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
            🔒 SUBSCRIBER ACCESS REQUIRED
          </div>
        )}

        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          background: '#e3f2fd',
          color: '#1976d2',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '16px',
          marginLeft: article.locked ? '8px' : '0'
        }}>
          {article.category}
        </div>

        <h1 style={{ fontSize: '32px', marginBottom: '16px', lineHeight: '1.2' }}>
          {article.title}
        </h1>

        <div style={{ color: '#666', marginBottom: '24px' }}>
          {article.date}
        </div>

        <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '32px', color: '#333' }}>
          {article.excerpt}
        </p>

        {article.locked ? (
          <div style={{
            padding: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ marginBottom: '16px' }}>Full Story Access Required</h2>
            <p style={{ marginBottom: '24px', opacity: 0.9 }}>
              Subscribe to Lakeview Digital Commons to read the complete story and access all campus news.
            </p>
            <div id="piano-offer-container"></div>
          </div>
        ) : (
          <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
            <p style={{ marginBottom: '16px' }}>
              Full article content would appear here for unlocked news articles.
              This story is freely accessible to demonstrate the site structure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

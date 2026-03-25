import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { JOURNALS } from '../data';

export default function JournalArticle() {
  const { slug } = useParams();
  const article = JOURNALS.find(j => j.slug === slug);

  useEffect(() => {
    // Fire Piano experience when article loads
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

        <h1 style={{ fontSize: '32px', marginBottom: '16px', lineHeight: '1.2' }}>
          {article.title}
        </h1>

        <div style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Authors:</strong> {article.authors}
        </div>
        <div style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Journal:</strong> {article.journal}
        </div>
        <div style={{ color: '#666', marginBottom: '24px' }}>
          <strong>Published:</strong> {article.year} • {article.volume}
        </div>

        <div style={{
          padding: '20px',
          background: '#f5f5f5',
          borderLeft: '4px solid #0066cc',
          marginBottom: '32px'
        }}>
          <h3 style={{ marginBottom: '12px', fontSize: '14px', textTransform: 'uppercase', color: '#666' }}>
            Abstract
          </h3>
          <p style={{ lineHeight: '1.6' }}>{article.abstract}</p>
        </div>

        {article.locked ? (
          <div style={{
            padding: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ marginBottom: '16px' }}>Full Article Access Required</h2>
            <p style={{ marginBottom: '24px', opacity: 0.9 }}>
              Subscribe to Lakeview Digital Commons to read the complete article and access our full research library.
            </p>
            <div id="piano-offer-container"></div>
          </div>
        ) : (
          <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
            <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Introduction</h2>
            <p style={{ marginBottom: '16px' }}>
              This is where the full article content would appear for unlocked articles.
              For demo purposes, this article is freely accessible.
            </p>

            <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Methodology</h2>
            <p style={{ marginBottom: '16px' }}>
              Article content continues here...
            </p>

            <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Results</h2>
            <p style={{ marginBottom: '16px' }}>
              Article content continues here...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

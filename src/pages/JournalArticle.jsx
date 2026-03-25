import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { JOURNALS } from '../data';

export default function JournalArticle() {
  const { slug } = useParams();
  const article = JOURNALS.find(j => j.slug === slug);

  useEffect(() => {
    // Re-trigger Composer on route change for SPA
    if (window.tp && window.tp.experience) {
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', background: '#FAF8F5', minHeight: '100vh' }}>
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

        {/* Teaser: Abstract is always visible */}
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

        {/* Piano inline template container — only on locked content */}
        {article.locked && <div className="piano-container"></div>}

        {/* Full article content — hidden when piano-container--active */}
        <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Introduction</h2>
          <p style={{ marginBottom: '16px' }}>
            This paper presents novel approaches to modeling synaptic plasticity using graph neural networks,
            demonstrating significant improvements in predictive accuracy for cortical microcircuit simulations.
            The methodology combines advanced computational techniques with biological insights to create more
            accurate models of brain function.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Methodology</h2>
          <p style={{ marginBottom: '16px' }}>
            We employed a multi-layered approach combining experimental data collection with computational modeling.
            Our graph neural network architecture was specifically designed to capture the complex relationships
            between synaptic connections in cortical circuits.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Results</h2>
          <p style={{ marginBottom: '16px' }}>
            The results demonstrate a 34% improvement in predictive accuracy compared to traditional modeling
            approaches. Our analysis reveals key insights into the mechanisms underlying synaptic plasticity
            and suggests new directions for future research in computational neuroscience.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Discussion</h2>
          <p style={{ marginBottom: '16px' }}>
            These findings have significant implications for our understanding of neural computation and could
            inform the development of more sophisticated artificial intelligence systems inspired by biological
            neural networks.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Conclusion</h2>
          <p style={{ marginBottom: '16px' }}>
            This research opens new avenues for investigating synaptic plasticity through computational methods
            and demonstrates the power of combining machine learning with neuroscience research.
          </p>
        </div>
      </div>
    </div>
  );
}

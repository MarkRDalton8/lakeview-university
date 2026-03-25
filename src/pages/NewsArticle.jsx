import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NEWS } from '../data';

export default function NewsArticle() {
  const { slug } = useParams();
  const article = NEWS.find(n => n.slug === slug);

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

        {/* Teaser: First 2-3 paragraphs are always visible */}
        <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '24px', color: '#333' }}>
          {article.excerpt}
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
          University officials announced the landmark achievement during a press conference this morning,
          highlighting the significance of this development for both the institution and the broader community.
          The initiative represents a major milestone in the university's ongoing commitment to excellence.
        </p>

        {/* Piano inline template container — only on locked content */}
        {article.locked && <div className="piano-container"></div>}

        {/* Remaining article content — hidden when piano-container--active */}
        <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
          "This is a transformative moment for our community," said University President Dr. Sarah Chen.
          "The impact of this initiative will be felt for generations to come, as we continue to push
          the boundaries of what's possible in higher education and research."
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
          The development comes after months of careful planning and coordination between multiple university
          departments, community stakeholders, and external partners. Faculty members and students alike
          have expressed enthusiasm about the opportunities this will create.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
          Details about the timeline for implementation and specific programs that will be affected are
          expected to be released in the coming weeks. The university has committed to providing regular
          updates as the initiative progresses.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
          Community members interested in learning more can attend an information session scheduled for
          next week in the main auditorium. Additional resources and FAQs will be made available on the
          university's website.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', fontStyle: 'italic', color: '#666' }}>
          This story is developing. Check back for updates as more information becomes available.
        </p>
      </div>
    </div>
  );
}

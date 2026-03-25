import { Link } from 'react-router-dom';
import { JOURNALS, COURSES, LIBRARY, NEWS } from '../data';

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '8px' }}>Lakeview University</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>Digital Commons</p>
      </header>

      {/* Journals Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid #0066cc', paddingBottom: '8px' }}>
          📚 Academic Journals
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {JOURNALS.map(journal => (
            <Link
              key={journal.id}
              to={`/journals/${journal.slug}`}
              style={{
                display: 'block',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              {journal.locked && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  background: '#ff4444',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  🔒 LOCKED
                </div>
              )}
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#0066cc' }}>
                {journal.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                {journal.authors}
              </p>
              <p style={{ fontSize: '13px', color: '#999' }}>
                {journal.journal} • {journal.year}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid #0066cc', paddingBottom: '8px' }}>
          🎓 Courses
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {COURSES.map(course => (
            <Link
              key={course.id}
              to={`/courses/${course.slug}`}
              style={{
                display: 'block',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              {course.locked && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  background: '#ff4444',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  🔒 LOCKED
                </div>
              )}
              <div style={{ fontSize: '13px', color: '#666', fontWeight: 'bold', marginBottom: '4px' }}>
                {course.code}
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#0066cc' }}>
                {course.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {course.instructor} • {course.term}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Library Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid #0066cc', paddingBottom: '8px' }}>
          📖 Digital Library
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {LIBRARY.map(book => (
            <Link
              key={book.id}
              to={`/library/${book.slug}`}
              style={{
                display: 'block',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              {book.locked && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  background: '#ff4444',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  🔒 LOCKED
                </div>
              )}
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#0066cc' }}>
                {book.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                {book.author}
              </p>
              <p style={{ fontSize: '13px', color: '#999' }}>
                {book.type} • {book.year} • {book.pages} pages
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid #0066cc', paddingBottom: '8px' }}>
          📰 Campus News
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {NEWS.map(article => (
            <Link
              key={article.id}
              to={`/news/${article.slug}`}
              style={{
                display: 'block',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              {article.locked && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  background: '#ff4444',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  🔒 LOCKED
                </div>
              )}
              <div style={{
                display: 'inline-block',
                padding: '4px 8px',
                background: '#e3f2fd',
                color: '#1976d2',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {article.category}
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#0066cc' }}>
                {article.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                {article.excerpt}
              </p>
              <p style={{ fontSize: '13px', color: '#999' }}>
                {article.date}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

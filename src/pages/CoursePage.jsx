import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSES } from '../data';

export default function CoursePage() {
  const { slug } = useParams();
  const course = COURSES.find(c => c.slug === slug);

  useEffect(() => {
    // Fire Piano experience when course loads
    if (window.tp) {
      window.tp.experience.execute();
    }
  }, [slug]);

  if (!course) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1>Course Not Found</h1>
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
        {course.locked && (
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
            🔒 ENROLLMENT REQUIRED
          </div>
        )}

        <div style={{ color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>
          {course.code}
        </div>

        <h1 style={{ fontSize: '32px', marginBottom: '16px', lineHeight: '1.2' }}>
          {course.title}
        </h1>

        <div style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Instructor:</strong> {course.instructor}
        </div>
        <div style={{ color: '#666', marginBottom: '8px' }}>
          <strong>Term:</strong> {course.term}
        </div>
        <div style={{ color: '#666', marginBottom: '24px' }}>
          <strong>Enrolled:</strong> {course.enrolled} students • {course.modules} modules
        </div>

        {course.locked ? (
          <div style={{
            padding: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            marginTop: '40px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ marginBottom: '16px' }}>Course Access Required</h2>
            <p style={{ marginBottom: '24px', opacity: 0.9 }}>
              Subscribe to Lakeview Digital Commons to access course materials and lectures.
            </p>
            <div id="piano-offer-container"></div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Course Materials</h2>
            <ul style={{ lineHeight: '2' }}>
              <li>Week 1: Introduction</li>
              <li>Week 2: Fundamentals</li>
              <li>Week 3: Advanced Topics</li>
              <li>Week 4: Case Studies</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSES } from '../data';

export default function CoursePage() {
  const { slug } = useParams();
  const course = COURSES.find(c => c.slug === slug);

  useEffect(() => {
    // Re-trigger Composer on route change for SPA
    if (window.tp && window.tp.experience) {
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

        {/* Teaser: Course overview is always visible */}
        <div style={{
          padding: '20px',
          background: '#f5f5f5',
          borderLeft: '4px solid #227845',
          marginBottom: '32px'
        }}>
          <h3 style={{ marginBottom: '12px', fontSize: '14px', textTransform: 'uppercase', color: '#666' }}>
            Course Overview
          </h3>
          <p style={{ lineHeight: '1.6' }}>
            This course provides comprehensive coverage of {course.title.toLowerCase()}, combining theoretical
            foundations with practical applications. Students will engage with cutting-edge concepts and develop
            the skills needed to excel in this field.
          </p>
        </div>

        {/* Piano inline template container — only on locked content */}
        {course.locked && <div className="piano-container"></div>}

        {/* Course materials — hidden when piano-container--active */}
        <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Course Materials</h2>
          <ul style={{ lineHeight: '2', marginLeft: '20px', marginBottom: '24px' }}>
            <li>Week 1: Introduction & Fundamentals</li>
            <li>Week 2: Core Concepts & Theory</li>
            <li>Week 3: Advanced Topics</li>
            <li>Week 4: Practical Applications</li>
            <li>Week 5: Case Studies</li>
            <li>Week 6: Group Project</li>
            <li>Week 7: Advanced Techniques</li>
            <li>Week 8: Real-World Examples</li>
          </ul>

          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Learning Objectives</h2>
          <p style={{ marginBottom: '16px' }}>
            By the end of this course, students will be able to apply core principles, analyze complex problems,
            and develop practical solutions using industry-standard tools and methodologies.
          </p>

          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Assessments</h2>
          <ul style={{ lineHeight: '2', marginLeft: '20px', marginBottom: '24px' }}>
            <li>Weekly quizzes (20%)</li>
            <li>Midterm exam (25%)</li>
            <li>Group project (30%)</li>
            <li>Final exam (25%)</li>
          </ul>

          <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Required Readings</h2>
          <p style={{ marginBottom: '16px' }}>
            All course readings will be made available through the Digital Commons library. Additional resources
            and supplementary materials will be posted to the course portal throughout the semester.
          </p>
        </div>
      </div>
    </div>
  );
}

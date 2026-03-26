import { useState, useEffect } from 'react';
import { JOURNALS, COURSES, LIBRARY, NEWS } from '../data';

const LockBadge = ({ locked }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase",
    background: locked ? "rgba(142, 36, 42, 0.1)" : "rgba(34, 120, 69, 0.1)",
    color: locked ? "#8E242A" : "#227845",
    border: `1px solid ${locked ? "rgba(142, 36, 42, 0.2)" : "rgba(34, 120, 69, 0.2)"}`,
  }}>
    {locked ? "🔒 License Required" : "✓ Open Access"}
  </span>
);

const ContentCard = ({ children, to, style }) => (
  <a href={to} style={{
    display: 'block',
    background: "white", borderRadius: 8, padding: "24px 28px",
    border: "1px solid #E2DDD5",
    transition: "all 0.25s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    textDecoration: 'none',
    color: 'inherit',
    ...style,
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor = "#8E242A"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(142,36,42,0.08)"; }}
  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2DDD5"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
  >
    {children}
  </a>
);

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [currentSection, setCurrentSection] = useState("home");
  const [showNewsletter, setShowNewsletter] = useState(false);

  // Piano ID — Passive session detection (no modal triggered)
  useEffect(() => {
    const tp = window.tp || [];
    tp.push(["init", function() {
      // Passively check for existing Piano ID session (no modal triggered)
      const user = window.tp.pianoId.getUser();
      if (user) {
        setIsLoggedIn(true);
        setUserName((user.firstName || "") + " " + (user.lastName || ""));
        setUserEmail(user.email || "");
      }
    }]);
  }, []);

  // Scroll detection for newsletter sticky square
  useEffect(() => {
    const handleScroll = () => {
      const newsSection = document.getElementById('news');
      if (newsSection) {
        const rect = newsSection.getBoundingClientRect();
        // Show newsletter when Campus News section is visible, hide when not
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setShowNewsletter(true);
        } else {
          setShowNewsletter(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogin = () => {
    if (window.tp && window.tp.pianoId) {
      window.tp.pianoId.show({ screen: "login" });
    }
  };

  const handleLogout = () => {
    if (window.tp && window.tp.pianoId) {
      window.tp.pianoId.logout();
    }
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
  };

  const styles = {
    app: { fontFamily: "'DM Sans', sans-serif", background: "#FAF8F5", minHeight: "100vh", color: "#1A1A1A" },
    header: {
      background: "linear-gradient(135deg, #1B1B3A 0%, #2C1810 100%)",
      borderBottom: "3px solid #C4A44A",
      position: "sticky", top: 0, zIndex: 100,
    },
    headerInner: {
      maxWidth: 1200, margin: "0 auto", padding: "0 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 72,
    },
    logo: { display: "flex", alignItems: "center", gap: 14 },
    logoIcon: {
      width: 44, height: 44, borderRadius: "50%", background: "#C4A44A",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22, fontWeight: 800, color: "#1B1B3A", fontFamily: "'Playfair Display', serif",
    },
    logoText: { color: "white" },
    logoName: { fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', serif", letterSpacing: "-0.3px" },
    logoSub: { fontSize: 10, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C4A44A", fontWeight: 500 },
    nav: { display: "flex", gap: 0, alignItems: "center" },
    navBtn: (active) => ({
      background: "none", border: "none", color: active ? "#C4A44A" : "rgba(255,255,255,0.7)",
      fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer", padding: "8px 16px",
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.3px",
      borderBottom: active ? "2px solid #C4A44A" : "2px solid transparent",
      transition: "all 0.2s ease",
    }),
    authArea: { display: "flex", alignItems: "center", gap: 12 },
    loginBtn: {
      background: "#C4A44A", color: "#1B1B3A", border: "none", borderRadius: 6,
      padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.3px",
      transition: "all 0.2s ease",
    },
    userPill: {
      display: "flex", alignItems: "center", gap: 8,
      background: "rgba(255,255,255,0.1)", borderRadius: 24, padding: "6px 16px 6px 8px",
    },
    avatar: {
      width: 28, height: 28, borderRadius: "50%", background: "#C4A44A",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700, color: "#1B1B3A",
    },
    main: { maxWidth: 1200, margin: "0 auto", padding: "40px 32px 80px" },
    hero: {
      background: "linear-gradient(135deg, #1B1B3A 0%, #3A1F2B 50%, #2C1810 100%)",
      borderRadius: 16, padding: "64px 56px", marginBottom: 48, position: "relative", overflow: "hidden",
    },
    heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: "white", marginBottom: 16, lineHeight: 1.2 },
    heroSub: { fontSize: 17, color: "rgba(255,255,255,0.75)", maxWidth: 560, lineHeight: 1.6, marginBottom: 32 },
    heroCta: {
      background: "#C4A44A", color: "#1B1B3A", border: "none", borderRadius: 8,
      padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
    },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1B1B3A", marginTop: 48 },
    sectionSub: { fontSize: 14, color: "#6B6560", marginBottom: 28, lineHeight: 1.5 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, marginBottom: 24 },
    cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, marginBottom: 6, color: "#1B1B3A", lineHeight: 1.3 },
    cardMeta: { fontSize: 12, color: "#8A8580", marginBottom: 8, lineHeight: 1.4 },
    cardBody: { fontSize: 13, color: "#4A4540", lineHeight: 1.6, marginBottom: 12 },
    tag: (color) => ({
      display: "inline-block", padding: "2px 10px", borderRadius: 12,
      fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase",
      background: color === "blue" ? "#EBF0F7" : color === "green" ? "#E8F5ED" : "#F5EDE8",
      color: color === "blue" ? "#2A4A7A" : color === "green" ? "#227845" : "#8E242A",
    }),
    statBox: {
      textAlign: "center", padding: "24px 16px", background: "rgba(255,255,255,0.1)",
      borderRadius: 12, flex: 1, minWidth: 120,
    },
    statNum: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#C4A44A" },
    statLabel: { fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: "1px", textTransform: "uppercase", marginTop: 4 },
    footer: {
      background: "#1B1B3A", color: "rgba(255,255,255,0.5)", padding: "40px 32px",
      textAlign: "center", fontSize: 12, letterSpacing: "0.3px",
    },
  };

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>L</div>
            <div style={styles.logoText}>
              <div style={styles.logoName}>Lakeview University</div>
              <div style={styles.logoSub}>Digital Commons</div>
            </div>
          </div>
          <nav style={styles.nav}>
            <button style={styles.navBtn(currentSection === 'home')} onClick={() => scrollToSection('home')}>Home</button>
            <button style={styles.navBtn(currentSection === 'journals')} onClick={() => scrollToSection('journals')}>Journals</button>
            <button style={styles.navBtn(currentSection === 'courses')} onClick={() => scrollToSection('courses')}>Training</button>
            <button style={styles.navBtn(currentSection === 'library')} onClick={() => scrollToSection('library')}>Library</button>
            <button style={styles.navBtn(currentSection === 'news')} onClick={() => scrollToSection('news')}>Campus News</button>
            {isLoggedIn && <a href="/account" style={{ ...styles.navBtn(false), textDecoration: 'none' }}>My Account</a>}
          </nav>
          <div style={styles.authArea}>
            {!isLoggedIn ? (
              <button style={styles.loginBtn} onClick={handleLogin}>Sign In</button>
            ) : (
              <>
                <div style={styles.userPill}>
                  <div style={styles.avatar}>{userName.charAt(0)}</div>
                  <span style={{ fontSize: 13, color: "white", fontWeight: 500 }}>{userName.split(" ")[0]}</span>
                </div>
                <button onClick={handleLogout} style={{
                  ...styles.loginBtn, background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)"
                }}>
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={{ position: "absolute", top: -60, right: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(196,164,74,0.06)" }} />
          <div style={{ position: "absolute", bottom: -80, right: 120, width: 200, height: 200, borderRadius: "50%", background: "rgba(196,164,74,0.04)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: "#C4A44A", marginBottom: 16, fontWeight: 600 }}>Est. 1892</div>
            <h1 style={styles.heroTitle}>Knowledge Without Boundaries</h1>
            <p style={styles.heroSub}>
              Access Lakeview University's complete digital ecosystem — peer-reviewed journals, course materials,
              digital library, and campus news — all with your institutional site license.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              {!isLoggedIn ? (
                <button style={styles.heroCta} onClick={handleLogin}>Sign In with Piano ID</button>
              ) : (
                <span style={{ ...styles.heroCta, display: 'inline-block' }}>Browse content below →</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
              {[
                { num: "12,400+", label: "Journal Articles" },
                { num: "340", label: "Online Training" },
                { num: "48,000", label: "Digital Volumes" },
                { num: "15,000", label: "Active Licenses" },
              ].map((s, i) => (
                <div key={i} style={styles.statBox}>
                  <div style={styles.statNum}>{s.num}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Journals */}
        <h2 id="journals" style={styles.sectionTitle}>Academic Journals</h2>
        <p style={styles.sectionSub}>Peer-reviewed research from Lakeview faculty and affiliated scholars</p>
        <div style={styles.grid}>
          {JOURNALS.map(j => (
            <ContentCard key={j.id} to={`/journals/${j.slug}`}>
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={styles.tag("blue")}>{j.volume}</span>
                <LockBadge locked={j.locked} />
              </div>
              <h3 style={styles.cardTitle}>{j.title}</h3>
              <div style={styles.cardMeta}>{j.authors}</div>
              <div style={styles.cardMeta}>{j.journal} · {j.year}</div>
              <p style={styles.cardBody}>{j.abstract.substring(0, 100) + "..."}</p>
            </ContentCard>
          ))}
        </div>

        {/* Training */}
        <h2 id="courses" style={styles.sectionTitle}>Online Training</h2>
        <p style={styles.sectionSub}>Spring 2026 semester training materials and learning modules</p>
        <div style={styles.grid}>
          {COURSES.map(c => (
            <ContentCard key={c.id} to={`/courses/${c.slug}`}>
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={styles.tag("green")}>{c.code}</span>
                <LockBadge locked={c.locked} />
              </div>
              <h3 style={styles.cardTitle}>{c.title}</h3>
              <div style={styles.cardMeta}>{c.instructor} · {c.term}</div>
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                <div style={{ fontSize: 12, color: "#6B6560" }}><strong style={{ color: "#1B1B3A" }}>{c.enrolled}</strong> enrolled</div>
                <div style={{ fontSize: 12, color: "#6B6560" }}><strong style={{ color: "#1B1B3A" }}>{c.modules}</strong> modules</div>
              </div>
            </ContentCard>
          ))}
        </div>

        {/* Library */}
        <h2 id="library" style={styles.sectionTitle}>Digital Library</h2>
        <p style={styles.sectionSub}>Textbooks, reference materials, and academic collections</p>
        <div style={styles.grid}>
          {LIBRARY.map(b => (
            <ContentCard key={b.id} to={`/library/${b.slug}`}>
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={styles.tag("red")}>{b.type}</span>
                <LockBadge locked={b.locked} />
              </div>
              <h3 style={styles.cardTitle}>{b.title}</h3>
              <div style={styles.cardMeta}>{b.author}</div>
              <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                <div style={{ fontSize: 12, color: "#6B6560" }}><strong style={{ color: "#1B1B3A" }}>{b.year}</strong></div>
                <div style={{ fontSize: 12, color: "#6B6560" }}><strong style={{ color: "#1B1B3A" }}>{b.pages}</strong> pages</div>
              </div>
            </ContentCard>
          ))}
        </div>

        {/* News */}
        <h2 id="news" style={styles.sectionTitle}>Campus News</h2>
        <p style={styles.sectionSub}>Latest updates and announcements from Lakeview University</p>
        <div style={styles.grid}>
          {NEWS.map(n => (
            <ContentCard key={n.id} to={`/news/${n.slug}`}>
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={styles.tag("blue")}>{n.category}</span>
                <LockBadge locked={n.locked} />
              </div>
              <h3 style={styles.cardTitle}>{n.title}</h3>
              <div style={styles.cardMeta}>{n.date}</div>
              <p style={styles.cardBody}>{n.excerpt.substring(0, 100) + "..."}</p>
            </ContentCard>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div>© 2026 Lakeview University · Digital Commons Platform</div>
        <div style={{ marginTop: 8, opacity: 0.6 }}>Demo site showcasing Piano integration for institutional access management</div>
      </footer>

      {/* Sticky Square Newsletter - Piano will inject template here */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(500px);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(500px);
          }
        }
        .piano-newsletter-container {
          position: fixed;
          right: 40px;
          bottom: 40px;
          width: 350px;
          z-index: 1000;
          transform: translateX(500px);
          pointer-events: none;
        }
        .piano-newsletter-container.show {
          animation: slideIn 1s cubic-bezier(0.05, 0.36, 0.29, 1.1) forwards;
          pointer-events: auto;
        }
        .piano-newsletter-container.hide {
          animation: slideOut 0.5s cubic-bezier(0.36, 0.05, 1.1, 0.29) forwards;
          pointer-events: none;
        }
      `}</style>
      <div className={`piano-newsletter-container ${showNewsletter ? 'show' : 'hide'}`}></div>
    </div>
  );
}

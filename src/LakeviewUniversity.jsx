import { useState, useEffect, useRef } from "react";

// ============================================================
// PIANO SDK CONFIGURATION — Replace these values with your
// real Piano sandbox/production credentials
// ============================================================
const PIANO_CONFIG = {
  AID: "QiNgMM49pu",                     // Piano Application ID
  SANDBOX: false,                        // true for sandbox, false for production
  PIANO_JS_URL: "https://experience.tinypass.com/xbuilder/experience/load?aid=QiNgMM49pu",
};

// ============================================================
// PIANO SDK INTEGRATION HOOKS (wire these up for real demos)
// ============================================================
/*
  Drop this in your <head> or load dynamically:

  <script src="https://sandbox.tinypass.com/xbuilder/experience/load?aid=YOUR_AID"></script>

  Then initialize:

  tp = window.tp || [];
  tp.push(["setAid", "YOUR_AID"]);
  tp.push(["setSandbox", true]);
  tp.push(["setUsePianoIdUserProvider", true]);

  // Piano ID login
  tp.push(["init", function() {
    tp.pianoId.show({
      screen: "login",
      loggedIn: function(data) {
        // data.user contains the authenticated user
        console.log("Logged in:", data.user);
      },
      loggedOut: function() {
        console.log("User logged out");
      }
    });
  }]);

  // My Account widget
  tp.push(["init", function() {
    tp.myaccount.show({
      displayMode: "inline",
      containerSelector: "#piano-my-account"
    });
  }]);

  // Experience execution (for gating content)
  tp.push(["init", function() {
    tp.experience.execute();
  }]);

  // Check access for site license
  tp.push(["init", function() {
    tp.api.callApi("/access/list", {}, function(response) {
      // response.data contains active accesses including site licenses
      console.log("User accesses:", response.data);
    });
  }]);
*/

// ============================================================
// MOCK DATA
// ============================================================
const JOURNALS = [
  { id: 1, title: "Advances in Computational Neuroscience", authors: "Chen, R., Patel, S., & Okonkwo, A.", journal: "Lakeview Journal of Neural Systems", year: 2025, volume: "Vol. 42, Issue 3", abstract: "This paper presents novel approaches to modeling synaptic plasticity using graph neural networks, demonstrating significant improvements in predictive accuracy for cortical microcircuit simulations.", locked: true },
  { id: 2, title: "Sustainable Urban Water Systems: A Meta-Analysis", authors: "Lindström, K. & Nguyen, T.H.", journal: "Environmental Sciences Review", year: 2025, volume: "Vol. 18, Issue 1", abstract: "A comprehensive meta-analysis of 847 studies examining the efficacy of green infrastructure interventions in urban stormwater management across diverse climatic zones.", locked: true },
  { id: 3, title: "Reconsidering Keynesian Multipliers in Digital Economies", authors: "Hawthorne, J.P.", journal: "Lakeview Economic Papers", year: 2024, volume: "Vol. 31, Issue 4", abstract: "This working paper argues that traditional fiscal multiplier estimates require fundamental revision when applied to economies with significant digital platform intermediation.", locked: false },
  { id: 4, title: "Machine Learning Approaches to Ancient Text Reconstruction", authors: "Al-Rashid, M. & Fernandez, C.", journal: "Digital Humanities Quarterly", year: 2025, volume: "Vol. 9, Issue 2", abstract: "We present a transformer-based model trained on fragmentary classical texts that achieves state-of-the-art results in reconstructing damaged papyri and inscriptions.", locked: true },
];

const COURSES = [
  { id: 1, code: "CS 4710", title: "Deep Learning & Neural Networks", instructor: "Prof. R. Chen", term: "Spring 2026", enrolled: 142, modules: 14, locked: true },
  { id: 2, code: "ECON 3250", title: "Behavioral Economics & Decision Making", instructor: "Prof. J.P. Hawthorne", term: "Spring 2026", enrolled: 89, modules: 12, locked: true },
  { id: 3, code: "ENV 2100", title: "Introduction to Climate Science", instructor: "Dr. K. Lindström", term: "Spring 2026", enrolled: 215, modules: 16, locked: false },
  { id: 4, code: "DH 4400", title: "Computational Methods in Humanities", instructor: "Prof. M. Al-Rashid", term: "Spring 2026", enrolled: 67, modules: 10, locked: true },
];

const LIBRARY = [
  { id: 1, title: "Principles of Quantum Computing", author: "Sarah Mitchell", type: "Textbook", year: 2024, pages: 482, locked: true },
  { id: 2, title: "The Oxford Handbook of Political Economy", author: "Various Authors", type: "Reference", year: 2023, pages: 1120, locked: true },
  { id: 3, title: "Data Structures: An Intuitive Approach", author: "James Park", type: "Textbook", year: 2025, pages: 356, locked: false },
  { id: 4, title: "Collected Papers in Molecular Biology", author: "Lakeview Press", type: "Collection", year: 2025, pages: 890, locked: true },
];

const NEWS = [
  { id: 1, title: "Lakeview Secures $48M Federal Grant for Climate Research Center", date: "Mar 21, 2026", category: "Research", excerpt: "The National Science Foundation has awarded Lakeview University its largest-ever research grant to establish a new Center for Climate Resilience and Adaptation.", locked: false },
  { id: 2, title: "Spring Commencement Speaker Announced: Dr. Mae Jemison", date: "Mar 18, 2026", category: "Campus", excerpt: "Former NASA astronaut and physician Dr. Mae Jemison will deliver the keynote address at Lakeview's 2026 Spring Commencement ceremony.", locked: false },
  { id: 3, title: "Engineering Team Wins National Robotics Championship", date: "Mar 15, 2026", category: "Athletics & Clubs", excerpt: "Lakeview's Robotics Society took first place at the National Collegiate Robotics Championship held in Austin, Texas.", locked: true },
  { id: 4, title: "New Student Housing Complex Breaks Ground on North Campus", date: "Mar 12, 2026", category: "Campus", excerpt: "Construction has officially begun on Lakeview's new 600-bed sustainable housing complex, designed to achieve LEED Platinum certification.", locked: true },
];

// ============================================================
// COMPONENTS
// ============================================================

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

const ContentCard = ({ children, onClick, style }) => (
  <div onClick={onClick} style={{
    background: "white", borderRadius: 8, padding: "24px 28px",
    border: "1px solid #E2DDD5", cursor: onClick ? "pointer" : "default",
    transition: "all 0.25s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    ...style,
  }}
  onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = "#8E242A"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(142,36,42,0.08)"; }}}
  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2DDD5"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
  >
    {children}
  </div>
);

// ============================================================
// MAIN APP
// ============================================================
export default function LakeviewUniversity() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasLicense, setHasLicense] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const pianoAccountRef = useRef(null);

  // Simulated Piano ID login
  const handleLogin = () => {
    /*
      REAL INTEGRATION:
      tp.pianoId.show({
        screen: "login",
        loggedIn: function(data) {
          setIsLoggedIn(true);
          setUserName(data.user.firstName + " " + data.user.lastName);
          setUserEmail(data.user.email);
          // Check for site license access
          tp.api.callApi("/access/list", {}, function(response) {
            const hasSiteLicense = response.data.some(a => a.resource.type === "site_license");
            setHasLicense(hasSiteLicense);
          });
        }
      });
    */
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    /*
      REAL INTEGRATION:
      tp.pianoId.logout();
    */
    setIsLoggedIn(false);
    setHasLicense(false);
    setUserName("");
    setUserEmail("");
    setCurrentPage("home");
  };

  const handleMockLogin = () => {
    setIsLoggedIn(true);
    setUserName("Sarah Mitchell");
    setUserEmail("s.mitchell@lakeview.edu");
    setShowLoginModal(false);
  };

  const activateLicense = () => {
    /*
      REAL INTEGRATION:
      tp.offer.show({
        templateId: "YOUR_SITE_LICENSE_TEMPLATE_ID",
        onCheckoutComplete: function() {
          setHasLicense(true);
        }
      });
    */
    setHasLicense(true);
    setShowLicenseModal(false);
  };

  const navItems = [
    { key: "home", label: "Home" },
    { key: "journals", label: "Journals" },
    { key: "courses", label: "Training" },
    { key: "library", label: "Library" },
    { key: "news", label: "Campus News" },
  ];
  if (isLoggedIn) navItems.push({ key: "account", label: "My Account" });

  const canAccess = (locked) => !locked || hasLicense;

  // ============================================================
  // STYLES
  // ============================================================
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
    licenseBanner: {
      background: hasLicense ? "linear-gradient(90deg, #227845, #2A9D5C)" : "linear-gradient(90deg, #8E242A, #B8393F)",
      borderRadius: 10, padding: "16px 28px", marginBottom: 32,
      display: "flex", alignItems: "center", justifyContent: "space-between", color: "white",
    },
    sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#1B1B3A" },
    sectionSub: { fontSize: 14, color: "#6B6560", marginBottom: 28, lineHeight: 1.5 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 },
    cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, marginBottom: 6, color: "#1B1B3A", lineHeight: 1.3 },
    cardMeta: { fontSize: 12, color: "#8A8580", marginBottom: 8, lineHeight: 1.4 },
    cardBody: { fontSize: 13, color: "#4A4540", lineHeight: 1.6, marginBottom: 12 },
    tag: (color) => ({
      display: "inline-block", padding: "2px 10px", borderRadius: 12,
      fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase",
      background: color === "blue" ? "#EBF0F7" : color === "green" ? "#E8F5ED" : "#F5EDE8",
      color: color === "blue" ? "#2A4A7A" : color === "green" ? "#227845" : "#8E242A",
    }),
    overlay: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
    },
    modal: {
      background: "white", borderRadius: 16, padding: "40px 44px", maxWidth: 440, width: "100%",
      boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
    },
    modalTitle: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 8 },
    modalSub: { fontSize: 13, color: "#6B6560", marginBottom: 28, lineHeight: 1.5 },
    input: {
      width: "100%", padding: "12px 16px", border: "1px solid #D8D3CC", borderRadius: 8,
      fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 12, boxSizing: "border-box",
      outline: "none", background: "#FAF8F5",
    },
    modalBtn: {
      width: "100%", padding: "14px", background: "#1B1B3A", color: "white", border: "none",
      borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", marginTop: 8,
    },
    lockedOverlay: {
      position: "absolute", inset: 0, background: "rgba(250,248,245,0.85)",
      borderRadius: 8, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)",
    },
    statBox: {
      textAlign: "center", padding: "24px 16px", background: "rgba(255,255,255,0.1)",
      borderRadius: 12, flex: 1, minWidth: 120,
    },
    statNum: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#C4A44A" },
    statLabel: { fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: "1px", textTransform: "uppercase", marginTop: 4 },
    accountSection: {
      background: "white", borderRadius: 12, border: "1px solid #E2DDD5", padding: "32px 36px", marginBottom: 24,
    },
    accountLabel: { fontSize: 11, color: "#8A8580", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 },
    accountValue: { fontSize: 15, color: "#1A1A1A", fontWeight: 500 },
    footer: {
      background: "#1B1B3A", color: "rgba(255,255,255,0.5)", padding: "40px 32px",
      textAlign: "center", fontSize: 12, letterSpacing: "0.3px",
    },
  };

  // ============================================================
  // PAGE RENDERERS
  // ============================================================

  const renderHome = () => (
    <>
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
            ) : !hasLicense ? (
              <button style={styles.heroCta} onClick={() => setShowLicenseModal(true)}>Activate Site License</button>
            ) : (
              <button style={styles.heroCta} onClick={() => setCurrentPage("journals")}>Browse Journals →</button>
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

      {isLoggedIn && (
        <div style={styles.licenseBanner}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
              {hasLicense ? "✓ Site License Active" : "Site License Not Activated"}
            </div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              {hasLicense
                ? "You have full access to all Lakeview University digital resources."
                : "Activate your institutional license to access premium content."}
            </div>
          </div>
          {!hasLicense && (
            <button onClick={() => setShowLicenseModal(true)} style={{
              background: "white", color: "#8E242A", border: "none", borderRadius: 6,
              padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>Activate License</button>
          )}
        </div>
      )}

      <h2 style={styles.sectionTitle}>Featured Research</h2>
      <p style={styles.sectionSub}>Latest publications from Lakeview faculty and researchers</p>
      <div style={styles.grid}>
        {JOURNALS.slice(0, 3).map(j => (
          <ContentCard key={j.id}>
            <div style={{ marginBottom: 12 }}><LockBadge locked={j.locked && !hasLicense} /></div>
            <h3 style={styles.cardTitle}>{j.title}</h3>
            <div style={styles.cardMeta}>{j.authors} · {j.journal} · {j.year}</div>
            <p style={styles.cardBody}>{canAccess(j.locked) ? j.abstract : j.abstract.substring(0, 80) + "..."}</p>
          </ContentCard>
        ))}
      </div>
    </>
  );

  const renderJournals = () => (
    <>
      <h2 style={styles.sectionTitle}>Academic Journals</h2>
      <p style={styles.sectionSub}>Peer-reviewed research from Lakeview faculty and affiliated scholars</p>
      <div style={styles.grid}>
        {JOURNALS.map(j => (
          <ContentCard key={j.id} style={{ position: "relative" }}>
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={styles.tag("blue")}>{j.volume}</span>
              <LockBadge locked={j.locked && !hasLicense} />
            </div>
            <h3 style={styles.cardTitle}>{j.title}</h3>
            <div style={styles.cardMeta}>{j.authors}</div>
            <div style={styles.cardMeta}>{j.journal} · {j.year}</div>
            {canAccess(j.locked) ? (
              <p style={styles.cardBody}>{j.abstract}</p>
            ) : (
              <div style={{ position: "relative", minHeight: 80 }}>
                <p style={{ ...styles.cardBody, filter: "blur(4px)", userSelect: "none" }}>{j.abstract}</p>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <button onClick={isLoggedIn ? () => setShowLicenseModal(true) : handleLogin} style={{
                    background: "#1B1B3A", color: "white", border: "none", borderRadius: 6,
                    padding: "8px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {isLoggedIn ? "Activate License to Read" : "Sign In to Access"}
                  </button>
                </div>
              </div>
            )}
          </ContentCard>
        ))}
      </div>
    </>
  );

  const renderCourses = () => (
    <>
      <h2 style={styles.sectionTitle}>Online Training</h2>
      <p style={styles.sectionSub}>Spring 2026 semester training materials and learning modules</p>
      <div style={styles.grid}>
        {COURSES.map(c => (
          <ContentCard key={c.id}>
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={styles.tag("green")}>{c.code}</span>
              <LockBadge locked={c.locked && !hasLicense} />
            </div>
            <h3 style={styles.cardTitle}>{c.title}</h3>
            <div style={styles.cardMeta}>{c.instructor} · {c.term}</div>
            <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
              <div style={{ fontSize: 12, color: "#6B6560" }}>
                <span style={{ fontWeight: 700, color: "#1A1A1A" }}>{c.modules}</span> modules
              </div>
              <div style={{ fontSize: 12, color: "#6B6560" }}>
                <span style={{ fontWeight: 700, color: "#1A1A1A" }}>{c.enrolled}</span> enrolled
              </div>
            </div>
            {!canAccess(c.locked) && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#FBF4F4", borderRadius: 8, border: "1px solid rgba(142,36,42,0.1)" }}>
                <div style={{ fontSize: 12, color: "#8E242A", fontWeight: 600 }}>
                  🔒 Course materials require an active site license
                </div>
              </div>
            )}
            {canAccess(c.locked) && (
              <button style={{
                marginTop: 16, width: "100%", padding: "10px", background: "#1B1B3A", color: "white",
                border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Enter Course →
              </button>
            )}
          </ContentCard>
        ))}
      </div>
    </>
  );

  const renderLibrary = () => (
    <>
      <h2 style={styles.sectionTitle}>Digital Library</h2>
      <p style={styles.sectionSub}>E-books, textbooks, and reference collections</p>
      <div style={styles.grid}>
        {LIBRARY.map(b => (
          <ContentCard key={b.id}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{
                width: 72, height: 96, borderRadius: 6, flexShrink: 0,
                background: `linear-gradient(135deg, ${b.type === "Textbook" ? "#1B1B3A" : b.type === "Reference" ? "#3A1F2B" : "#2C1810"}, ${b.type === "Textbook" ? "#2C3A6B" : b.type === "Reference" ? "#6B2A4A" : "#5C3820"})`,
                display: "flex", alignItems: "center", justifyContent: "center", color: "#C4A44A",
                fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                textAlign: "center", padding: 8, lineHeight: 1.3, boxSizing: "border-box",
              }}>
                {b.type}
              </div>
              <div style={{ flex: 1 }}>
                <LockBadge locked={b.locked && !hasLicense} />
                <h3 style={{ ...styles.cardTitle, marginTop: 8 }}>{b.title}</h3>
                <div style={styles.cardMeta}>{b.author} · {b.year} · {b.pages} pages</div>
                {canAccess(b.locked) ? (
                  <button style={{
                    marginTop: 8, padding: "6px 16px", background: "none", color: "#1B1B3A",
                    border: "1px solid #1B1B3A", borderRadius: 6, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>Read Online</button>
                ) : (
                  <div style={{ fontSize: 12, color: "#8A8580", marginTop: 8, fontStyle: "italic" }}>
                    License required for full access
                  </div>
                )}
              </div>
            </div>
          </ContentCard>
        ))}
      </div>
    </>
  );

  const renderNews = () => (
    <>
      <h2 style={styles.sectionTitle}>Campus News</h2>
      <p style={styles.sectionSub}>The latest from Lakeview University</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {NEWS.map(n => (
          <ContentCard key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <span style={styles.tag(n.category === "Research" ? "blue" : n.category === "Campus" ? "green" : "red")}>{n.category}</span>
                <span style={{ fontSize: 12, color: "#8A8580" }}>{n.date}</span>
              </div>
              <h3 style={styles.cardTitle}>{n.title}</h3>
              {canAccess(n.locked) ? (
                <p style={styles.cardBody}>{n.excerpt}</p>
              ) : (
                <p style={{ ...styles.cardBody, color: "#B0AAA5", fontStyle: "italic" }}>
                  Full article available with site license...
                </p>
              )}
            </div>
            <LockBadge locked={n.locked && !hasLicense} />
          </ContentCard>
        ))}
      </div>
    </>
  );

  const renderAccount = () => (
    <>
      <h2 style={styles.sectionTitle}>My Account</h2>
      <p style={styles.sectionSub}>Manage your profile, subscriptions, and site license</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={styles.accountSection}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 20, color: "#1B1B3A" }}>Profile Information</h3>
          <div style={{ marginBottom: 16 }}>
            <div style={styles.accountLabel}>Full Name</div>
            <div style={styles.accountValue}>{userName}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={styles.accountLabel}>Email</div>
            <div style={styles.accountValue}>{userEmail}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={styles.accountLabel}>Institution</div>
            <div style={styles.accountValue}>Lakeview University</div>
          </div>
          <div>
            <div style={styles.accountLabel}>Department</div>
            <div style={styles.accountValue}>Computer Science</div>
          </div>
        </div>

        <div style={styles.accountSection}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 20, color: "#1B1B3A" }}>Site License</h3>
          <div style={{
            padding: "20px 24px", borderRadius: 10,
            background: hasLicense ? "linear-gradient(135deg, #E8F5ED, #F0FBF4)" : "#FBF4F4",
            border: `1px solid ${hasLicense ? "rgba(34,120,69,0.2)" : "rgba(142,36,42,0.2)"}`,
            marginBottom: 20,
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: hasLicense ? "#227845" : "#8E242A", marginBottom: 4 }}>
              {hasLicense ? "✓ Active — Institutional License" : "No Active License"}
            </div>
            <div style={{ fontSize: 12, color: hasLicense ? "#3A7A52" : "#B0605F" }}>
              {hasLicense
                ? "Lakeview University Site License · Expires Aug 31, 2026 · Seat 1,247 of 15,000"
                : "You don't have an active site license. Contact your institution's library to activate."}
            </div>
          </div>
          {!hasLicense && (
            <button onClick={() => setShowLicenseModal(true)} style={{
              width: "100%", padding: "12px", background: "#1B1B3A", color: "white", border: "none",
              borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>Activate Site License</button>
          )}
          {hasLicense && (
            <div>
              <div style={styles.accountLabel}>License Details</div>
              <div style={{ fontSize: 13, color: "#4A4540", lineHeight: 2 }}>
                Type: Institutional Site License<br/>
                Resources: Journals, Training, Library, News (Full Access)<br/>
                Issued: Sep 1, 2025<br/>
                Renewal: Automatic
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PIANO MY ACCOUNT WIDGET CONTAINER */}
      <div style={{ ...styles.accountSection, marginTop: 0 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 8, color: "#1B1B3A" }}>
          Piano Account Management
        </h3>
        <p style={{ fontSize: 13, color: "#8A8580", marginBottom: 20 }}>
          Manage your subscriptions, payment methods, and account settings.
        </p>
        {/*
          REAL INTEGRATION — Piano My Account inline widget:
          tp.push(["init", function() {
            tp.myaccount.show({
              displayMode: "inline",
              containerSelector: "#piano-my-account"
            });
          }]);
        */}
        <div
          id="piano-my-account"
          ref={pianoAccountRef}
          style={{
            minHeight: 300, border: "2px dashed #D8D3CC", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#8A8580", fontSize: 14, padding: 32, textAlign: "center",
            background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 20px)",
          }}
        >
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎹</div>
            <div style={{ fontWeight: 700, color: "#6B6560", marginBottom: 6 }}>Piano My Account Widget</div>
            <div style={{ fontSize: 12, maxWidth: 380, lineHeight: 1.6 }}>
              This container renders the Piano My Account inline widget.<br/>
              Configure <code style={{ background: "#F0ECE6", padding: "2px 6px", borderRadius: 4 }}>tp.myaccount.show()</code> with
              <code style={{ background: "#F0ECE6", padding: "2px 6px", borderRadius: 4 }}>containerSelector: "#piano-my-account"</code>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button onClick={handleLogout} style={{
          background: "none", color: "#8E242A", border: "1px solid #8E242A", borderRadius: 8,
          padding: "10px 28px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}>Sign Out</button>
      </div>
    </>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo} onClick={() => setCurrentPage("home")} role="button">
            <div style={styles.logoIcon}>L</div>
            <div style={styles.logoText}>
              <div style={styles.logoName}>Lakeview University</div>
              <div style={styles.logoSub}>Digital Commons</div>
            </div>
          </div>
          <nav style={styles.nav}>
            {navItems.map(n => (
              <button key={n.key} style={styles.navBtn(currentPage === n.key)} onClick={() => setCurrentPage(n.key)}>
                {n.label}
              </button>
            ))}
          </nav>
          <div style={styles.authArea}>
            {isLoggedIn ? (
              <div style={styles.userPill}>
                <div style={styles.avatar}>{userName[0]}</div>
                <span style={{ color: "white", fontSize: 13, fontWeight: 500 }}>{userName}</span>
              </div>
            ) : (
              <button style={styles.loginBtn} onClick={handleLogin}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={styles.main}>
        {currentPage === "home" && renderHome()}
        {currentPage === "journals" && renderJournals()}
        {currentPage === "courses" && renderCourses()}
        {currentPage === "library" && renderLibrary()}
        {currentPage === "news" && renderNews()}
        {currentPage === "account" && renderAccount()}
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
          Lakeview University
        </div>
        <div>© 2026 Lakeview University Digital Commons · Powered by Piano · Demo Site — Not a Real Institution</div>
        <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          Piano ID · Piano VX · Site License Management
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div style={styles.overlay} onClick={() => setShowLoginModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            {/*
              REAL INTEGRATION:
              Replace this modal with tp.pianoId.show({ screen: "login", displayMode: "inline", containerSelector: "#piano-login-container" })
            */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ ...styles.logoIcon, margin: "0 auto 16px", width: 56, height: 56, fontSize: 28 }}>L</div>
              <div style={styles.modalTitle}>Sign In to Lakeview</div>
              <div style={styles.modalSub}>Access journals, courses, and library resources with your university credentials.</div>
            </div>
            <div id="piano-login-container" style={{ marginBottom: 20 }}>
              {/* Piano ID inline login renders here in production */}
              <input style={styles.input} placeholder="Email address" defaultValue="s.mitchell@lakeview.edu" readOnly />
              <input style={styles.input} type="password" placeholder="Password" defaultValue="••••••••••" readOnly />
            </div>
            <button style={styles.modalBtn} onClick={handleMockLogin}>
              Sign In with Piano ID
            </button>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#8A8580" }}>
              <span style={{ cursor: "pointer", color: "#1B1B3A", fontWeight: 600 }}>Create Account</span> · <span style={{ cursor: "pointer", color: "#1B1B3A", fontWeight: 600 }}>Forgot Password</span>
            </div>
            <div style={{ textAlign: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid #E8E4DE", fontSize: 11, color: "#B0AAA5" }}>
              Secured by Piano ID
            </div>
          </div>
        </div>
      )}

      {/* LICENSE ACTIVATION MODAL */}
      {showLicenseModal && (
        <div style={styles.overlay} onClick={() => setShowLicenseModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            {/*
              REAL INTEGRATION:
              tp.offer.show({
                templateId: "YOUR_SITE_LICENSE_TEMPLATE_ID",
                containerSelector: "#piano-license-container",
                displayMode: "inline"
              });
            */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
              <div style={styles.modalTitle}>Activate Site License</div>
              <div style={styles.modalSub}>
                As a Lakeview University affiliate, you are eligible for full institutional access
                to all digital resources.
              </div>
            </div>
            <div id="piano-license-container" style={{
              padding: "20px 24px", background: "#F7F5F0", borderRadius: 10,
              border: "1px solid #E2DDD5", marginBottom: 24,
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Institutional Site License</div>
              <div style={{ fontSize: 12, color: "#6B6560", lineHeight: 1.6 }}>
                ✓ 12,400+ journal articles<br/>
                ✓ 340 online courses<br/>
                ✓ 48,000+ digital library volumes<br/>
                ✓ Full campus news archive<br/>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #E2DDD5", fontWeight: 600, color: "#227845" }}>
                  Included with your university affiliation — no charge
                </div>
              </div>
            </div>
            <button style={{ ...styles.modalBtn, background: "#227845" }} onClick={activateLicense}>
              Activate My License
            </button>
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#B0AAA5" }}>
              Managed by Piano VX · Site License
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Piano ID — Session detection + login/logout event listeners
  useEffect(() => {
    const tp = window.tp || [];
    tp.push(["init", function() {
      const user = window.tp.pianoId.getUser();
      if (user) {
        setIsLoggedIn(true);
        setUserName((user.firstName || "") + " " + (user.lastName || ""));
      }

      window.tp.pianoId.show({
        loggedIn: function(data) {
          setIsLoggedIn(true);
          setUserName((data.user.firstName || "") + " " + (data.user.lastName || ""));
        },
        loggedOut: function() {
          setIsLoggedIn(false);
          setUserName("");
        }
      });
    }]);
  }, []);

  // Piano My Account widget
  useEffect(() => {
    const tp = window.tp || [];
    tp.push(["init", function() {
      // Only show My Account widget if user is logged in
      if (window.tp.pianoId.getUser()) {
        window.tp.myaccount.show({
          displayMode: "inline",
          containerSelector: "#piano-my-account"
        });
      }
    }]);
  }, [isLoggedIn]);

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
    // Navigate back to home after logout
    navigate('/');
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
    navLink: (active) => ({
      background: "none", border: "none", color: active ? "#C4A44A" : "rgba(255,255,255,0.7)",
      fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer", padding: "8px 16px",
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.3px",
      borderBottom: active ? "2px solid #C4A44A" : "2px solid transparent",
      transition: "all 0.2s ease",
      textDecoration: 'none',
      display: 'inline-block',
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
    pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#1B1B3A", marginBottom: 8 },
    pageSub: { fontSize: 14, color: "#6B6560", marginBottom: 32 },
    widgetContainer: {
      minHeight: 400,
      background: "white",
      borderRadius: 12,
      border: "1px solid #E2DDD5",
      padding: 32,
      overflow: "auto",
      boxSizing: "border-box",
    },
    loginPrompt: {
      minHeight: 400,
      background: "white",
      borderRadius: 12,
      border: "1px solid #E2DDD5",
      padding: 64,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    footer: {
      background: "#1B1B3A", color: "rgba(255,255,255,0.5)", padding: "40px 32px",
      textAlign: "center", fontSize: 12, letterSpacing: "0.3px",
    },
  };

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        #piano-my-account * {
          box-sizing: border-box;
          max-width: 100%;
        }
        #piano-my-account iframe {
          max-width: 100% !important;
        }
      `}</style>

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
            <a href="/" style={styles.navLink(false)}>Home</a>
            <a href="/#journals" style={styles.navLink(false)}>Journals</a>
            <a href="/#courses" style={styles.navLink(false)}>Training</a>
            <a href="/#library" style={styles.navLink(false)}>Library</a>
            <a href="/#news" style={styles.navLink(false)}>Campus News</a>
            {isLoggedIn && <a href="/account" style={styles.navLink(true)}>My Account</a>}
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
        <h1 style={styles.pageTitle}>My Account</h1>
        <p style={styles.pageSub}>
          Manage your profile, subscriptions, and site license.
        </p>

        {isLoggedIn ? (
          <div id="piano-my-account" style={styles.widgetContainer} />
        ) : (
          <div style={styles.loginPrompt}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>🔒</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#1B1B3A" }}>
              Sign In Required
            </h2>
            <p style={{ fontSize: 14, color: "#6B6560", marginBottom: 32, maxWidth: 400 }}>
              Please sign in to view and manage your account settings, subscriptions, and site license.
            </p>
            <button onClick={handleLogin} style={{
              background: "#1B1B3A", color: "white", border: "none", borderRadius: 8,
              padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Sign In with Piano ID
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div>© 2026 Lakeview University · Digital Commons Platform</div>
        <div style={{ marginTop: 8, opacity: 0.6 }}>Demo site showcasing Piano integration for institutional access management</div>
      </footer>
    </div>
  );
}

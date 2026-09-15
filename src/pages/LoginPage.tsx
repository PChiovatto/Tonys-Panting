import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  const inputStyle: React.CSSProperties = {
    height: 46,
    width: "100%",
    border: "1.5px solid #E8E2D8",
    borderRadius: 8,
    padding: "0 14px",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 14,
    color: "#1A1A1A",
    background: "white",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 500,
    fontSize: 13,
    color: "#1A1A1A",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div className="login-shell">
      {/* LEFT PANEL */}
      <aside className="login-left">
        <div>
          <div
            className="font-display"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 22,
              color: "#F5F1EB",
              letterSpacing: "-0.02em",
            }}
          >
            Tony&apos;s <span style={{ color: "#C4291C" }}>Painting</span>
          </div>
          <span
            style={{
              display: "inline-block",
              marginTop: 10,
              background: "rgba(196,41,28,0.15)",
              color: "#C4291C",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 4,
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            Staff Portal
          </span>
        </div>

        <p
          className="login-mid-quote"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
            maxWidth: 240,
            margin: 0,
          }}
        >
          Every lead matters. Every project counts.
        </p>

        <div>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
              margin: 0,
            }}
          >
            Internal access only.
          </p>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.20)",
              marginTop: 4,
            }}
          >
            2024 Tony&apos;s Painting
          </p>
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <main className="login-right">
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 380,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: 36,
                color: "#1A1A1A",
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Welcome back.
            </h1>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: 15,
                color: "#6B6560",
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              Sign in to your dashboard.
            </p>
          </div>

          <div>
            <label htmlFor="login-email" style={labelStyle}>Email</label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@tonyspainting.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#C4291C")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E2D8")}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="login-password" style={labelStyle}>Password</label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#C4291C")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E2D8")}
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: 13,
                color: "#C4291C",
                background: "rgba(196,41,28,0.08)",
                padding: "10px 14px",
                borderRadius: 6,
                borderLeft: "3px solid #C4291C",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              height: 50,
              width: "100%",
              background: loading ? "#8B1A10" : "#C4291C",
              color: "white",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 4,
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#8B1A10")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#C4291C")}
          >
            {loading ? (
              <span
                aria-label="Signing in"
                style={{
                  width: 20,
                  height: 20,
                  border: "2.5px solid rgba(255,255,255,0.4)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }}
              />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </main>

      <style>{`
        .login-shell {
          display: flex;
          flex-direction: row;
          min-height: 100dvh;
          width: 100%;
          background: #F8F8F6;
        }
        .login-left {
          width: 40%;
          background: #1A1A1A;
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .login-right {
          width: 60%;
          background: #F8F8F6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
        }
        @media (max-width: 767px) {
          .login-shell {
            flex-direction: column;
          }
          .login-left {
            width: 100%;
            min-height: 200px;
            height: 200px;
            padding: 24px 24px;
          }
          .login-mid-quote {
            display: none;
          }
          .login-right {
            width: 100%;
            padding: 32px 24px;
            flex: 1;
            align-items: flex-start;
            padding-top: 40px;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;

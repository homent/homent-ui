import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { loginWithEmail, storeAuthData } from '../../services/authService';

/**
 * Simple Login Page
 * - Controlled inputs for email/password
 * - Basic client-side validation
 * - Simulated API call (replace with real /api/auth/login)
 * - Stores token in localStorage (or sessionStorage if not remembered)
 *
 * Save as: /e:/Projects/HomeFlux/web/src/app/login/login.jsx
 */

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validate = () => {
        if (!email) return "Email is required.";
        // simple email check
        if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email.";
        if (!password) return "Password is required.";
        if (password.length < 6) return "Password must be at least 6 characters.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setLoading(true);
        try {
            const data = await loginWithEmail(email, password);

            // Store authentication data
            const userInfo = { email: email };
            storeAuthData(data, userInfo, remember);

            // Redirect to app home (adjust route as needed)
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleSubmit} style={styles.card} aria-labelledby="login-heading">
                <h2 id="login-heading" style={styles.title}>
                    Sign in
                </h2>

                {error && <div role="alert" style={styles.error}>{error}</div>}

                <label style={styles.label}>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="you@example.com"
                        autoComplete="username"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Password
                    <div style={styles.passwordRow}>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            style={styles.showBtn}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            disabled={loading}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </label>

                <div style={styles.row}>
                    <label style={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            disabled={loading}
                        />
                        Remember me
                    </label>

                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        style={styles.linkBtn}
                        disabled={loading}
                    >
                        Forgot?
                    </button>
                </div>

                <button type="submit" style={styles.submit} disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <div style={styles.footer}>
                    <span>Don't have an account?</span>
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        style={styles.linkBtn}
                        disabled={loading}
                    >
                        Create account
                    </button>
                </div>

                <div style={styles.hrRow}>
                    <span style={styles.hrLine} />
                    <small style={{ margin: "0 12px", color: "#666" }}>or</small>
                    <span style={styles.hrLine} />
                </div>

                <div style={styles.oauthRow}>
                    <button
                        type="button"
                        style={styles.oauthBtn}
                        onClick={() => toast('OAuth flow not implemented yet')}
                        disabled={loading}
                    >
                        Continue with Google
                    </button>
                    <button
                        type="button"
                        style={styles.oauthBtn}
                        onClick={() => toast('OAuth flow not implemented yet')}
                        disabled={loading}
                    >
                        Continue with GitHub
                    </button>
                </div>
            </form>
        </div>
    );
}

/* Inline styles to keep file self-contained */
const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: 24,
    },
    card: {
        width: 420,
        maxWidth: "100%",
        padding: 24,
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 6px 24px rgba(15, 23, 42, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    title: { margin: 0, fontSize: 20 },
    label: { display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#333" },
    input: {
        marginTop: 4,
        padding: "10px 12px",
        fontSize: 14,
        borderRadius: 6,
        border: "1px solid #d0d7de",
        outline: "none",
    },
    passwordRow: { display: "flex", gap: 8, alignItems: "center" },
    showBtn: {
        padding: "8px 10px",
        fontSize: 13,
        borderRadius: 6,
        border: "1px solid #d0d7de",
        background: "#fff",
        cursor: "pointer",
    },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
    checkboxLabel: { display: "flex", gap: 8, alignItems: "center", fontSize: 13 },
    linkBtn: {
        border: "none",
        background: "transparent",
        color: "#0366d6",
        cursor: "pointer",
        padding: 6,
        fontSize: 13,
    },
    submit: {
        marginTop: 6,
        padding: "10px 12px",
        fontSize: 15,
        borderRadius: 6,
        border: "none",
        background: "#0366d6",
        color: "#fff",
        cursor: "pointer",
    },
    footer: { display: "flex", justifyContent: "center", gap: 8, alignItems: "center", marginTop: 6 },
    hrRow: { display: "flex", alignItems: "center", marginTop: 6 },
    hrLine: { flex: 1, height: 1, background: "#e6e9ef" },
    oauthRow: { display: "flex", gap: 8, marginTop: 8 },
    oauthBtn: {
        flex: 1,
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #d0d7de",
        background: "#fff",
        cursor: "pointer",
        fontSize: 13,
    },
    error: {
        padding: 10,
        background: "#fff1f0",
        color: "#86181d",
        borderRadius: 6,
        border: "1px solid #f7c0c0",
        fontSize: 13,
    },
};
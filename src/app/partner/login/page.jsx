import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { loginWithEmail, loginWithPhone, storeAuthData } from '../../services/authService';

/**
 * Partner Login Page
 * - Supports both email/password and phone/OTP login
 * - Phone login requires OTP verification (password not allowed)
 * - Sign in button enabled only after phone number and OTP are entered
 * - Controlled inputs with validation
 * - API integration for authentication
 */

export default function LoginPage() {
    const navigate = useNavigate();

    const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [remember, setRemember] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [error, setError] = useState("");

    const validate = () => {
        if (loginMethod === "email") {
            if (!email) return "Email is required.";
            if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email.";
            if (!password) return "Password is required.";
            if (password.length < 6) return "Password must be at least 6 characters.";
        } else {
            // Phone login - OTP required
            if (!phone) return "Phone number is required.";
            if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) return "Enter a valid 10-digit phone number.";
            if (!otpSent) return "Please send OTP first.";
            if (!otp) return "OTP is required.";
            if (otp.length !== 6) return "Enter a valid 6-digit OTP.";
        }
        return "";
    };

    const sendOtpRequest = (phoneNumber) =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                if (phoneNumber === "9876543210") {
                    resolve({ success: true, message: "OTP sent successfully" });
                } else {
                    reject(new Error("Failed to send OTP. Please check your phone number."));
                }
            }, 1000);
        });

    const handleSendOtp = async () => {
        if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
            setError("Enter a valid 10-digit phone number.");
            return;
        }

        setOtpLoading(true);
        setError("");

        try {
            await sendOtpRequest(phone);
            setOtpSent(true);
            toast.success("OTP sent to your phone number");
        } catch (err) {
            setError(err.message || "Failed to send OTP.");
        } finally {
            setOtpLoading(false);
        }
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
            let data;

            if (loginMethod === "email") {
                data = await loginWithEmail(email, password);
            } else {
                data = await loginWithPhone(phone, otp);
            }

            // Store authentication data
            const userInfo = {
                email: loginMethod === "email" ? email : undefined,
                phone: loginMethod === "phone" ? phone : undefined,
            };
            storeAuthData(data, userInfo, remember);

            // Redirect to app home (adjust route as needed)
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const switchLoginMethod = (method) => {
        setLoginMethod(method);
        setError("");
        setOtpSent(false);
        setOtp("");
        if (method === "email") {
            setPhone("");
        } else {
            setEmail("");
            setPassword(""); // Clear password when switching to phone
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleSubmit} style={styles.card} aria-labelledby="login-heading">
                <h2 id="login-heading" style={styles.title}>
                    Sign in
                </h2>

                {/* Login Method Toggle */}
                <div style={styles.methodToggle}>
                    <button
                        type="button"
                        onClick={() => switchLoginMethod("email")}
                        style={{
                            ...styles.methodBtn,
                            ...(loginMethod === "email" ? styles.methodBtnActive : {})
                        }}
                        disabled={loading}
                    >
                        Email
                    </button>
                    <button
                        type="button"
                        onClick={() => switchLoginMethod("phone")}
                        style={{
                            ...styles.methodBtn,
                            ...(loginMethod === "phone" ? styles.methodBtnActive : {})
                        }}
                        disabled={loading}
                    >
                        Phone
                    </button>
                </div>

                {error && <div role="alert" style={styles.error}>{error}</div>}

                {loginMethod === "email" ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <label style={styles.label}>
                            Phone Number
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                style={styles.input}
                                placeholder="9876543210"
                                autoComplete="tel"
                                disabled={loading}
                            />
                        </label>

                        {!otpSent ? (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                style={styles.sendOtpBtn}
                                disabled={otpLoading || loading}
                            >
                                {otpLoading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        ) : (
                            <label style={styles.label}>
                                Enter OTP
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    style={styles.input}
                                    placeholder="123456"
                                    autoComplete="one-time-code"
                                    disabled={loading}
                                />
                                <small style={styles.otpHint}>
                                    OTP sent to {phone}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtp("");
                                        }}
                                        style={styles.resendBtn}
                                        disabled={loading}
                                    >
                                        Change number
                                    </button>
                                </small>
                            </label>
                        )}
                    </>
                )}

                <div style={styles.row}>
                    <label style={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            disabled={loading}
                        />
                        Remember
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

                <button 
                    type="submit" 
                    style={styles.submit} 
                    disabled={
                        loading || 
                        (loginMethod === "phone" && (!phone || !otpSent || !otp || otp.length !== 6))
                    }
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <div style={styles.footer}>
                    <span>Don't have an account?</span>
                    <button
                        type="button"
                        style={styles.linkBtn}
                        disabled={loading}
                    >
                        <a href="/partner/register" className="hover:text-blue-600">
                            Create account
                        </a>
                    </button>
                </div>

                {/* <div style={styles.hrRow}>
                    <span style={styles.hrLine} />
                    <small style={{ margin: "0 12px", color: "#666" }}>or</small>
                    <span style={styles.hrLine} />
                </div> */}

                {/* <div style={styles.oauthRow}>
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
                </div> */}
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
    methodToggle: {
        display: "flex",
        borderRadius: 6,
        border: "1px solid #d0d7de",
        overflow: "hidden",
        marginBottom: 8,
    },
    methodBtn: {
        flex: 1,
        padding: "8px 12px",
        border: "none",
        background: "#fff",
        cursor: "pointer",
        fontSize: 14,
        transition: "background-color 0.2s",
    },
    methodBtnActive: {
        background: "#0366d6",
        color: "#fff",
    },
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
    sendOtpBtn: {
        padding: "10px 12px",
        fontSize: 14,
        borderRadius: 6,
        border: "1px solid #0366d6",
        background: "#fff",
        color: "#0366d6",
        cursor: "pointer",
        marginTop: 8,
    },
    orDivider: { display: "flex", alignItems: "center", margin: "16px 0" },
    orLine: { flex: 1, height: 1, background: "#e6e9ef" },
    otpHint: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    resendBtn: {
        border: "none",
        background: "transparent",
        color: "#0366d6",
        cursor: "pointer",
        fontSize: 12,
        padding: 0,
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

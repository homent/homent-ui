"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  loginWithEmail,
  loginWithPhone,
  storeAuthData,
} from "../../services/authService";

export default function LoginPage() {
  const navigate = useRouter();

  const [loginMethod, setLoginMethod] = useState("email");
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
      if (password.length < 6)
        return "Password must be at least 6 characters.";
    } else {
      if (!phone) return "Phone number is required.";
      if (!/^\d{10}$/.test(phone)) return "Enter a valid 10-digit phone number.";
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
          resolve({ success: true });
        } else {
          reject(
            new Error("Failed to send OTP. Please check your phone number.")
          );
        }
      }, 1000);
    });

  const handleSendOtp = async () => {
    if (!phone || !/^\d{10}$/.test(phone)) {
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
      console.log("Login response:", data);
      localStorage.setItem(
        "userLoginDetails",
        JSON.stringify(data)
      );

      // ❌ Show error ONLY if BOTH are NOT verified
      if (!data.isEmailVerified && !data.isMobileVerified) {
        setError(
          "Please verify either your email or mobile number to continue."
        );
        return;
      }

      // ✅ Allow login if ANY one is verified
      const userInfo = {
        email: loginMethod === "email" ? email : undefined,
        phone: loginMethod === "phone" ? phone : undefined,
      };

      storeAuthData(data, userInfo, remember);
      navigate.push("/properties", { replace: true });
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
      setPassword("");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Sign in</h2>

        <div style={styles.methodToggle}>
          <button
            type="button"
            onClick={() => switchLoginMethod("email")}
            style={{
              ...styles.methodBtn,
              ...(loginMethod === "email" ? styles.methodBtnActive : {}),
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
              ...(loginMethod === "phone" ? styles.methodBtnActive : {}),
            }}
            disabled={loading}
          >
            Phone
          </button>
        </div>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        {loginMethod === "email" ? (
          <>
            <label style={styles.label}>
              Email
              <input
                placeholder="Enter Your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
            </label>

            <label style={styles.label}>
              Password
              <input
                placeholder="Enter Your Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                disabled={loading}
              />
            </label>
          </>
        ) : (
          <>
            <label style={styles.label}>
              Phone Number
              <input
                type="tel"
                value={phone}
                placeholder="Enter Your Phone Number"
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                style={styles.input}
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
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  style={styles.input}
                  disabled={loading}
                />
              </label>
            )}
          </>
        )}

        <button
          type="submit"
          style={styles.submit}
          disabled={
            loading ||
            (loginMethod === "phone" &&
              (!phone || !otpSent || !otp || otp.length !== 6))
          }
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

/* STYLES – UNCHANGED */
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
  },
  methodBtn: {
    flex: 1,
    padding: "8px 12px",
    border: "none",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  methodBtnActive: {
    background: "#b98321",
    color: "#fff",
  },
  label: { display: "flex", flexDirection: "column", gap: 8 },
  input: {
    padding: "10px 12px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #d0d7de",
  },
  sendOtpBtn: {
    padding: "10px 12px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #bd8a2a",
    background: "#fff",
    cursor: "pointer",
  },
  submit: {
    marginTop: 6,
    padding: "10px 12px",
    fontSize: 15,
    borderRadius: 6,
    border: "none",
    background: "#b98321",
    color: "#fff",
    cursor: "pointer",
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

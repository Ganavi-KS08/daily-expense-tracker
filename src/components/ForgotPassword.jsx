import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Auth.css";

export default function ForgotPassword({ setAuthView }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);

    if (error) alert(error.message);
    else alert("Reset email sent 📩");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleReset} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p
          className="forgot-password"
          onClick={() => setAuthView("login")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}
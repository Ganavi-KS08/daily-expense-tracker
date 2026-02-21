import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Auth.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) alert(error.message);
    else alert("Signup Successful 🎉");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) alert(error.message);
    else alert("Login Successful 🚀");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>💸 Daily Expense Tracker</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="button-group">
          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>

          <button
            className="signup"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
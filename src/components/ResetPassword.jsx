import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Auth.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleUpdatePassword = async () => {
  if (!password) {
    alert("Enter new password");
    return;
  }

  setLoading(true);

  const { error } = await supabase.auth.updateUser({
    password,
  });

  setLoading(false);

  if (error) {
    alert(error.message);
  } else {
    alert("Password updated successfully 🎉");

    await supabase.auth.signOut();

    window.location.hash = "";
    window.location.reload();
  }
};
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set New Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleUpdatePassword} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
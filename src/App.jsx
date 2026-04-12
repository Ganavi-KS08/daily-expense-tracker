import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Auth from "./components/Auth";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [authView, setAuthView] = useState("login");

  useEffect(() => {
    const checkRecoveryMode = async () => {
      const hash = window.location.hash;

      if (
        hash.includes("type=recovery") ||
        hash.includes("access_token")
      ) {
        setAuthView("reset");
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    checkRecoveryMode();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);

        if (event === "PASSWORD_RECOVERY") {
          setAuthView("reset");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;

  if (authView === "reset") {
    return <ResetPassword />;
  }

  if (session) {
    return (
      <Dashboard
        session={session}
        expenses={expenses}
        setExpenses={setExpenses}
      />
    );
  }

  if (authView === "forgot") {
    return <ForgotPassword setAuthView={setAuthView} />;
  }

  return <Auth setAuthView={setAuthView} />;
}

export default App;
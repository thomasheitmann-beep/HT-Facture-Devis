import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase.js";

const ERROR_MESSAGES = {
  "auth/invalid-email": "Adresse e-mail invalide.",
  "auth/user-disabled": "Ce compte a été désactivé.",
  "auth/user-not-found": "E-mail ou mot de passe incorrect.",
  "auth/wrong-password": "E-mail ou mot de passe incorrect.",
  "auth/invalid-credential": "E-mail ou mot de passe incorrect.",
  "auth/too-many-requests": "Trop de tentatives. Réessayez dans quelques minutes.",
  "auth/network-request-failed": "Connexion impossible — vérifiez votre réseau.",
};

export default function LoginGate({ children }) {
  const [user, setUser] = useState(undefined); // undefined = chargement initial, null = déconnecté
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || "Connexion impossible. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-sm">
        Chargement…
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm">HT</div>
            <div className="font-bold text-slate-900">HT Maintenance</div>
          </div>
          <p className="text-sm text-slate-500 mb-5">Connectez-vous pour accéder à vos devis, factures et commandes.</p>

          <label className="flex flex-col gap-1 text-sm mb-3">
            <span className="text-slate-500 font-medium">E-mail</span>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm mb-4">
            <span className="text-slate-500 font-medium">Mot de passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />
          </label>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-semibold rounded-lg px-3 py-2 text-sm transition-colors"
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => signOut(auth)}
        className="no-print fixed bottom-20 md:bottom-3 left-3 z-40 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-full px-3 py-1.5 shadow-sm"
        title={user.email}
      >
        Se déconnecter
      </button>
      {children}
    </>
  );
}

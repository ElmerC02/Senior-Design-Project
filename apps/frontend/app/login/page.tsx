"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Demo only — authentication coming soon.");
  }

  return (
    <section>
      <h1 className="header">Login</h1>
      <form onSubmit={onSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Email<br/>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width:"100%", padding:8, border:"1px solid #e5e7eb", borderRadius:4 }} />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password<br/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width:"100%", padding:8, border:"1px solid #e5e7eb", borderRadius:4 }} />
          </label>
        </div>
        <button type="submit">Login</button>
        <button type="button" style={{ marginLeft: 8 }}>Forgot Password</button>
      </form>
    </section>
  );
}

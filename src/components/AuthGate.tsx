import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('donation_token');

  const handleLogin = async () => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('donation_token', data.token);
      localStorage.setItem('donation_user', JSON.stringify(data.user));
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleRegister = async () => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Register failed');
      localStorage.setItem('donation_token', data.token);
      localStorage.setItem('donation_user', JSON.stringify(data.user));
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Register failed');
    }
  };

  if (token) return <>{children}</>;

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
      <h3 className="font-display text-lg font-semibold mb-4">Please sign in to continue</h3>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('login')} className={`px-3 py-2 rounded ${mode === 'login' ? 'bg-primary text-white' : 'bg-secondary'}`}>
          Login
        </button>
        <button onClick={() => setMode('register')} className={`px-3 py-2 rounded ${mode === 'register' ? 'bg-primary text-white' : 'bg-secondary'}`}>
          Register
        </button>
      </div>

      {mode === 'register' && (
        <div className="space-y-2 mb-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      )}

      <div className="space-y-2 mb-4">
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        <Label>Password</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {error && <p className="text-sm text-destructive mb-2">{error}</p>}

      <div className="flex gap-2">
        {mode === 'login' ? (
          <Button onClick={handleLogin}>Login</Button>
        ) : (
          <Button onClick={handleRegister}>Create Account</Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">Your credentials are stored only on this demo backend. For production, secure your tokens properly.</p>
    </div>
  );
};

export default AuthGate;

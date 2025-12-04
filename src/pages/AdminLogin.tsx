import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@mentorsfoundation.org');
  const [password, setPassword] = useState('adminpassword');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Check if user is admin
      if (data.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      localStorage.setItem('donation_token', data.token);
      localStorage.setItem('donation_user', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-8 w-full max-w-md">
        <h1 className="font-display text-2xl font-bold mb-2">Admin Portal</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to view donations and manage the portal</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" variant="donate" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">Demo credentials:</span>
            <br />
            Email: admin@mentorsfoundation.org
            <br />
            Password: adminpassword
          </p>
        </div> */}
      </div>
    </main>
  );
};

export default AdminLogin;

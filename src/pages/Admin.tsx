import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const Admin = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('donation_token');
    const userData = localStorage.getItem('donation_user');

    if (!token || !userData) {
      navigate('/admin-login');
      return;
    }

    setUser(JSON.parse(userData));

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setPayments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load payments');
      }
    };
    load();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('donation_token');
    localStorage.removeItem('donation_user');
    navigate('/admin-login');
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Donations</h2>
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="bg-card rounded-lg border overflow-x-auto">
            {payments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No donations yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border/50">
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Donor</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Currency</th>
                    <th className="px-4 py-3 font-semibold">Reference</th>
                    <th className="px-4 py-3 font-semibold">Tx ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-t border-border/50 hover:bg-secondary/30">
                      <td className="px-4 py-3">{new Date(p.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3">{p.donor_name || p.user_name || p.user_email || '—'}</td>
                      <td className="px-4 py-3 font-medium">{p.amount}</td>
                      <td className="px-4 py-3">{p.currency}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.reference || '—'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.tx_id || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin;

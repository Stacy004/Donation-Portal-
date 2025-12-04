import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const Admin = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [sendingEmail, setSendingEmail] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('donation_token');

  useEffect(() => {
    const userData = localStorage.getItem('donation_user');

    if (!token || !userData) {
      navigate('/admin-login');
      return;
    }

    setUser(JSON.parse(userData));
    loadPayments();
  }, [navigate, token]);

  const loadPayments = async () => {
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

  const handleSendEmail = async (paymentId: number) => {
    setSendingEmail(paymentId);
    try {
      const res = await fetch(`${API_BASE}/admin/send-confirmation/${paymentId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to send email');
      setSuccess('Confirmation email sent successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send email');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSendingEmail(null);
    }
  };

  const handleDelete = async (paymentId: number) => {
    if (!confirm('Are you sure you want to delete this donation record?')) return;
    
    setDeleting(paymentId);
    try {
      const res = await fetch(`${API_BASE}/admin/payments/${paymentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setPayments(payments.filter(p => p.id !== paymentId));
      setSuccess('Donation deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleting(null);
    }
  };

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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Donations Management</h2>
          
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div className="space-y-3">
            {payments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground bg-card rounded-lg border">
                <p>No donations yet</p>
              </div>
            ) : (
              payments.map((payment) => (
                <div key={payment.id} className="bg-card border rounded-lg overflow-hidden">
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedId(expandedId === payment.id ? null : payment.id)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary/50 transition"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left min-w-0">
                      <div className="flex-shrink-0">
                        {expandedId === payment.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{payment.donor_name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{payment.donor_email || 'No email'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-lg">{payment.amount} {payment.currency}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedId === payment.id && (
                    <div className="border-t border-border/50 px-4 py-4 bg-secondary/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h3 className="font-semibold text-sm mb-3 text-foreground">Donor Information</h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Name</p>
                              <p className="font-medium">{payment.donor_name || '—'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Email</p>
                              <p className="font-medium break-all">{payment.donor_email || '—'}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-sm mb-3 text-foreground">Donation Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <p className="text-muted-foreground">Amount</p>
                              <p className="font-medium">{payment.amount} {payment.currency}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-muted-foreground">GHS Equivalent</p>
                              <p className="font-medium">GHS {payment.ghs_equivalent?.toLocaleString() || '—'}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-muted-foreground">Payment Method</p>
                              <p className="font-medium text-capitalize">{payment.payment_method || '—'}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-muted-foreground">Reference</p>
                              <p className="font-medium">{payment.reference || '—'}</p>
                            </div>
                            {payment.tx_id && (
                              <div className="flex justify-between">
                                <p className="text-muted-foreground">Transaction ID</p>
                                <p className="font-medium text-xs">{payment.tx_id}</p>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium">{new Date(payment.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 border-t border-border/50 pt-4">
                        <Button
                          size="sm"
                          onClick={() => handleSendEmail(payment.id)}
                          disabled={sendingEmail === payment.id}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {sendingEmail === payment.id ? 'Sending...' : 'Send Confirmation'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(payment.id)}
                          disabled={deleting === payment.id}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleting === payment.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin;

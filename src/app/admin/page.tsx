'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Mail, 
  Users, 
  FileText, 
  Send, 
  Eye, 
  Reply, 
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface DashboardData {
  subscribers: {
    total: number;
    confirmed: number;
    pending: number;
    unsubscribed: number;
    last30Days: number;
    recent: any[];
  };
  posts: {
    total: number;
    published: number;
    drafts: number;
    recent: any[];
  };
  newsletters: {
    totalSent: number;
    recent: any[];
  };
  messages: {
    unreadCount: number;
    total: number;
    recent: any[];
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'messages'>('overview');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [sendingNewsletter, setSendingNewsletter] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify');
      if (response.ok) {
        setIsAuthenticated(true);
        loadDashboard();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        loadDashboard();
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
    router.push('/');
  };

  const sendNewsletter = async (slug: string) => {
    if (!confirm(`Send newsletter for post: ${slug}?`)) return;
    
    setSendingNewsletter(slug);
    try {
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NEWSLETTER_API_KEY}`
        },
        body: JSON.stringify({ slug }),
      });

      if (response.ok) {
        alert('Newsletter sent successfully!');
        loadDashboard();
      } else {
        alert('Failed to send newsletter');
      }
    } catch (error) {
      alert('Error sending newsletter');
    } finally {
      setSendingNewsletter(null);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
      });
      loadDashboard();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const sendReply = async (messageId: number) => {
    if (!replyText.trim()) return;

    setSendingReply(true);
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });

      if (response.ok) {
        alert('Reply sent successfully!');
        setReplyText('');
        setSelectedMessage(null);
        loadDashboard();
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      alert('Error sending reply');
    } finally {
      setSendingReply(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
          <div className="text-foreground-muted">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 pb-20">
          <div className="mx-auto max-w-md px-4">
            <h1 className="text-3xl font-display font-bold text-foreground mb-8">
              Admin Login
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-editorial w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-editorial w-full"
                  required
                />
              </div>
              {loginError && (
                <div className="text-accent-secondary text-sm">{loginError}</div>
              )}
              <button type="submit" className="btn-editorial-primary w-full">
                Login
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">
              Admin Dashboard
            </h1>
            <button onClick={handleLogout} className="btn-editorial">
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-4 font-sans text-sm uppercase tracking-wider ${
                activeTab === 'overview'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-foreground-muted'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 px-4 font-sans text-sm uppercase tracking-wider ${
                activeTab === 'posts'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-foreground-muted'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-4 px-4 font-sans text-sm uppercase tracking-wider ${
                activeTab === 'messages'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-foreground-muted'
              }`}
            >
              Messages
              {dashboardData && dashboardData.messages.unreadCount > 0 && (
                <span className="ml-2 bg-accent-secondary text-white text-xs px-2 py-1 rounded-full">
                  {dashboardData.messages.unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          {activeTab === 'overview' && dashboardData && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="editorial-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground-muted text-sm mb-2">Total Subscribers</p>
                      <p className="text-3xl font-display font-bold text-foreground">
                        {dashboardData.subscribers.confirmed}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-accent-primary" />
                  </div>
                  <p className="text-xs text-foreground-muted mt-2">
                    +{dashboardData.subscribers.last30Days} last 30 days
                  </p>
                </div>

                <div className="editorial-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground-muted text-sm mb-2">Published Posts</p>
                      <p className="text-3xl font-display font-bold text-foreground">
                        {dashboardData.posts.published}
                      </p>
                    </div>
                    <FileText className="w-8 h-8 text-accent-primary" />
                  </div>
                  <p className="text-xs text-foreground-muted mt-2">
                    {dashboardData.posts.drafts} drafts
                  </p>
                </div>

                <div className="editorial-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground-muted text-sm mb-2">Newsletters Sent</p>
                      <p className="text-3xl font-display font-bold text-foreground">
                        {dashboardData.newsletters.totalSent}
                      </p>
                    </div>
                    <Send className="w-8 h-8 text-accent-primary" />
                  </div>
                </div>

                <div className="editorial-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground-muted text-sm mb-2">Unread Messages</p>
                      <p className="text-3xl font-display font-bold text-foreground">
                        {dashboardData.messages.unreadCount}
                      </p>
                    </div>
                    <Mail className="w-8 h-8 text-accent-secondary" />
                  </div>
                  <p className="text-xs text-foreground-muted mt-2">
                    {dashboardData.messages.total} total
                  </p>
                </div>
              </div>

              {/* Recent Subscribers */}
              <div className="editorial-card">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  Recent Subscribers
                </h2>
                <div className="space-y-2">
                  {dashboardData.subscribers.recent.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="flex justify-between items-center py-2 border-b border-border-subtle last:border-0"
                    >
                      <span className="text-foreground">{sub.email}</span>
                      <span className="text-xs text-foreground-muted">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && dashboardData && (
            <div className="editorial-card">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                Recent Posts
              </h2>
              <div className="space-y-4">
                {dashboardData.posts.recent.map((post: any) => (
                  <div
                    key={post.slug}
                    className="flex justify-between items-start py-4 border-b border-border-subtle last:border-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-foreground-muted mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-foreground-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        {post.emailSent ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Email sent
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-foreground-muted">
                            <Clock className="w-3 h-3" />
                            Not sent
                          </span>
                        )}
                      </div>
                    </div>
                    {!post.emailSent && (
                      <button
                        onClick={() => sendNewsletter(post.slug)}
                        disabled={sendingNewsletter === post.slug}
                        className="btn-editorial text-xs ml-4"
                      >
                        {sendingNewsletter === post.slug ? 'Sending...' : 'Send Newsletter'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && dashboardData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Message List */}
              <div className="editorial-card">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  Contact Messages
                </h2>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {dashboardData.messages.recent.map((message: any) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-4 border rounded cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'border-accent-primary bg-card-hover'
                          : message.status === 'unread'
                          ? 'border-border bg-background-elevated'
                          : 'border-border-subtle'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-foreground">
                          {message.name || message.email}
                        </span>
                        <span className="text-xs text-foreground-muted">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground-muted mb-2">
                        {message.subject || 'No subject'}
                      </p>
                      <div className="flex items-center gap-2">
                        {message.status === 'unread' && (
                          <span className="text-xs px-2 py-1 bg-accent-secondary text-white rounded">
                            Unread
                          </span>
                        )}
                        {message.status === 'replied' && (
                          <span className="text-xs px-2 py-1 bg-green-600 text-white rounded">
                            Replied
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Detail & Reply */}
              {selectedMessage && (
                <div className="editorial-card">
                  <h2 className="text-xl font-display font-bold text-foreground mb-4">
                    Message Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">From:</p>
                      <p className="text-foreground">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Subject:</p>
                      <p className="text-foreground">
                        {selectedMessage.subject || 'No subject'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Message:</p>
                      <p className="text-foreground whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>

                    {selectedMessage.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(selectedMessage.id)}
                        className="btn-secondary text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        Mark as Read
                      </button>
                    )}

                    {selectedMessage.status !== 'replied' && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Send Reply:
                        </p>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          className="input-editorial w-full min-h-[150px] mb-4"
                        />
                        <button
                          onClick={() => sendReply(selectedMessage.id)}
                          disabled={sendingReply || !replyText.trim()}
                          className="btn-editorial-primary w-full"
                        >
                          <Reply className="w-4 h-4" />
                          {sendingReply ? 'Sending...' : 'Send Reply'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

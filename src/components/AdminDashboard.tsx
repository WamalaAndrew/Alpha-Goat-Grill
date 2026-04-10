import React, { useEffect, useState, useMemo } from 'react';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, updateDoc, doc, orderBy, increment } from 'firebase/firestore';
import { Package, Calendar as CalendarIcon, Users, CheckCircle, Clock, Filter, ArrowUpDown, Search, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'customers'>('orders');
  const [resView, setResView] = useState<'table' | 'calendar'>('table');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Sorting
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc'|'desc'}>(() => {
    const saved = localStorage.getItem('adminOrderSort');
    return saved ? JSON.parse(saved) : { key: 'createdAt', direction: 'desc' };
  });

  useEffect(() => {
    localStorage.setItem('adminOrderSort', JSON.stringify(sortConfig));
  }, [sortConfig]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user && user.email === 'wamalaandrew632@gmail.com') {
        setIsAdmin(true);
        fetchData();
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchData = () => {
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    const qReservations = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const unsubReservations = onSnapshot(qReservations, (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qUsers = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubOrders();
      unsubReservations();
      unsubUsers();
    };
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status.");
    }
  };

  const adjustPoints = async (userId: string, amount: number) => {
    try {
      await updateDoc(doc(db, 'users', userId), { points: increment(amount) });
    } catch (error) {
      console.error("Error adjusting points:", error);
      alert("Failed to adjust points.");
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedOrders = useMemo(() => {
    let result = [...orders];

    // Filtering
    if (filterStatus) result = result.filter(o => o.status === filterStatus);
    if (filterPayment) result = result.filter(o => o.paymentMethod === filterPayment);
    if (filterEmail) {
      const search = filterEmail.toLowerCase();
      result = result.filter(o => 
        (o.userEmail || '').toLowerCase().includes(search) || 
        (o.guestEmail || '').toLowerCase().includes(search) ||
        (o.guestName || '').toLowerCase().includes(search)
      );
    }
    if (filterDateFrom) {
      const from = new Date(filterDateFrom).getTime();
      result = result.filter(o => (o.createdAt?.toMillis() || 0) >= from);
    }
    if (filterDateTo) {
      const to = new Date(filterDateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter(o => (o.createdAt?.toMillis() || 0) <= to.getTime());
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'createdAt') {
        aVal = a.createdAt?.toMillis() || 0;
        bVal = b.createdAt?.toMillis() || 0;
      } else if (sortConfig.key === 'customer') {
        aVal = (a.userEmail || a.guestName || '').toLowerCase();
        bVal = (b.userEmail || b.guestName || '').toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [orders, filterStatus, filterPayment, filterEmail, filterDateFrom, filterDateTo, sortConfig]);

  const calendarEvents = useMemo(() => {
    return reservations.map(r => {
      const start = new Date(`${r.date}T${r.time}`);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Assume 2 hours duration
      return {
        title: `${r.name} (${r.guests} guests)`,
        start,
        end,
        resource: r
      };
    });
  }, [reservations]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-golden"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 text-center">
        <h1 className="font-heading text-4xl text-charcoal mb-4">Access Denied</h1>
        <p className="text-charcoal/70 mb-8">You do not have permission to view this page.</p>
        <button onClick={() => navigate('/')} className="bg-golden text-charcoal px-6 py-3 rounded-full font-bold hover:bg-golden/90 transition-colors">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-charcoal text-cream py-6 px-4 md:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-heading text-2xl tracking-widest uppercase">
            Alpha Goat <span className="text-golden">Admin</span>
          </h1>
          <button onClick={() => navigate('/')} className="text-cream/70 hover:text-golden transition-colors text-sm font-bold">
            View Live Site
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-charcoal/5 flex items-center gap-4">
            <div className="bg-golden/20 p-4 rounded-xl text-golden">
              <Package size={28} />
            </div>
            <div>
              <p className="text-charcoal/50 font-bold text-sm">Total Orders</p>
              <p className="text-3xl font-heading font-bold text-charcoal">{orders.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-charcoal/5 flex items-center gap-4">
            <div className="bg-spice/10 p-4 rounded-xl text-spice">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-charcoal/50 font-bold text-sm">Pending Orders</p>
              <p className="text-3xl font-heading font-bold text-charcoal">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-charcoal/5 flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-xl text-primary">
              <CalendarIcon size={28} />
            </div>
            <div>
              <p className="text-charcoal/50 font-bold text-sm">Reservations</p>
              <p className="text-3xl font-heading font-bold text-charcoal">{reservations.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-charcoal/5 flex items-center gap-4">
            <div className="bg-charcoal/10 p-4 rounded-xl text-charcoal">
              <Users size={28} />
            </div>
            <div>
              <p className="text-charcoal/50 font-bold text-sm">Customers</p>
              <p className="text-3xl font-heading font-bold text-charcoal">{customers.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-charcoal/10 pb-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`font-bold text-lg px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-charcoal text-cream' : 'text-charcoal/50 hover:bg-charcoal/5'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`font-bold text-lg px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'reservations' ? 'bg-charcoal text-cream' : 'text-charcoal/50 hover:bg-charcoal/5'}`}
          >
            Reservations
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`font-bold text-lg px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'customers' ? 'bg-charcoal text-cream' : 'text-charcoal/50 hover:bg-charcoal/5'}`}
          >
            Loyalty Points
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-charcoal/5 flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-charcoal/50 mb-1">Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-cream/50 border border-charcoal/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-golden">
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal/50 mb-1">Payment</label>
                <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} className="bg-cream/50 border border-charcoal/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-golden">
                  <option value="">All</option>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal/50 mb-1">Date From</label>
                <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className="bg-cream/50 border border-charcoal/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-golden" />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal/50 mb-1">Date To</label>
                <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} className="bg-cream/50 border border-charcoal/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-golden" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-bold text-charcoal/50 mb-1">Search Customer</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                  <input 
                    type="text" 
                    placeholder="Email or Name..." 
                    value={filterEmail}
                    onChange={e => setFilterEmail(e.target.value)}
                    className="w-full bg-cream/50 border border-charcoal/10 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-golden"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-charcoal/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-charcoal/5 text-charcoal/70 text-sm uppercase tracking-wider">
                      <th className="p-4 font-bold cursor-pointer hover:bg-charcoal/10 transition-colors" onClick={() => handleSort('createdAt')}>
                        <div className="flex items-center gap-2">Date <ArrowUpDown size={14} /></div>
                      </th>
                      <th className="p-4 font-bold cursor-pointer hover:bg-charcoal/10 transition-colors" onClick={() => handleSort('customer')}>
                        <div className="flex items-center gap-2">Customer <ArrowUpDown size={14} /></div>
                      </th>
                      <th className="p-4 font-bold">Type & Payment</th>
                      <th className="p-4 font-bold cursor-pointer hover:bg-charcoal/10 transition-colors" onClick={() => handleSort('itemCount')}>
                        <div className="flex items-center gap-2">Items <ArrowUpDown size={14} /></div>
                      </th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal/5">
                    {processedOrders.map(order => (
                      <tr key={order.id} className="hover:bg-charcoal/5 transition-colors">
                        <td className="p-4 text-sm text-charcoal/70">
                          {order.createdAt?.toDate().toLocaleString()}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-charcoal">{order.guestName || order.userEmail || 'Guest'}</p>
                          <p className="text-xs text-charcoal/50">{order.guestPhone || order.guestEmail || ''}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="capitalize text-sm font-medium">{order.orderType}</span>
                            <span className="text-xs bg-charcoal/10 px-2 py-0.5 rounded uppercase font-bold">{order.paymentMethod}</span>
                          </div>
                          {order.orderType === 'delivery' && (
                            <p className="text-xs text-charcoal/50 truncate max-w-[150px]" title={order.address}>{order.address}</p>
                          )}
                        </td>
                        <td className="p-4 font-bold">{order.itemCount}</td>
                        <td className="p-4">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider outline-none cursor-pointer ${
                              order.status === 'completed' ? 'bg-primary/20 text-primary' : 
                              order.status === 'out_for_delivery' ? 'bg-golden/20 text-golden' :
                              order.status === 'cancelled' ? 'bg-charcoal/20 text-charcoal' :
                              'bg-spice/20 text-spice'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                              className="bg-charcoal text-cream px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary transition-colors flex items-center gap-2 ml-auto"
                            >
                              <CheckCircle size={16} /> Dispatch
                            </button>
                          )}
                          {order.status === 'out_for_delivery' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="bg-primary text-cream px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/80 transition-colors flex items-center gap-2 ml-auto"
                            >
                              <CheckCircle size={16} /> Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {processedOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-charcoal/50">No orders match your filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setResView('table')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${resView === 'table' ? 'bg-charcoal text-cream' : 'bg-white text-charcoal border border-charcoal/10'}`}
              >
                Table View
              </button>
              <button 
                onClick={() => setResView('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${resView === 'calendar' ? 'bg-charcoal text-cream' : 'bg-white text-charcoal border border-charcoal/10'}`}
              >
                Calendar View
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-charcoal/5 overflow-hidden p-4">
              {resView === 'calendar' ? (
                <div style={{ height: 600 }}>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    defaultView="month"
                    className="font-sans"
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-charcoal/5 text-charcoal/70 text-sm uppercase tracking-wider">
                        <th className="p-4 font-bold">Date Submitted</th>
                        <th className="p-4 font-bold">Name</th>
                        <th className="p-4 font-bold">Contact</th>
                        <th className="p-4 font-bold">Date & Time</th>
                        <th className="p-4 font-bold">Guests</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {reservations.map(res => (
                        <tr key={res.id} className="hover:bg-charcoal/5 transition-colors">
                          <td className="p-4 text-sm text-charcoal/70">
                            {res.createdAt?.toDate().toLocaleString()}
                          </td>
                          <td className="p-4 font-bold text-charcoal">{res.name}</td>
                          <td className="p-4">
                            <p className="text-sm">{res.email}</p>
                            <p className="text-xs text-charcoal/50">{res.phone}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold">{res.date}</p>
                            <p className="text-sm text-charcoal/70">{res.time}</p>
                          </td>
                          <td className="p-4 font-bold">{res.guests}</td>
                        </tr>
                      ))}
                      {reservations.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-charcoal/50">No reservations found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl shadow-sm border border-charcoal/5 overflow-hidden">
            <div className="p-6 border-b border-charcoal/10">
              <h2 className="font-heading font-medium text-2xl text-charcoal">Loyalty Points Management</h2>
              <p className="text-charcoal/60 text-sm mt-1">View and adjust customer reward points.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-charcoal/5 text-charcoal/70 text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">User ID</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold">Current Points</th>
                    <th className="p-4 font-bold text-right">Adjust Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {customers.map(customer => (
                    <tr key={customer.id} className="hover:bg-charcoal/5 transition-colors">
                      <td className="p-4 text-sm font-mono text-charcoal/70">{customer.id}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${customer.role === 'admin' ? 'bg-spice/20 text-spice' : 'bg-charcoal/10 text-charcoal'}`}>
                          {customer.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-golden text-lg">{customer.points || 0} pts</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => adjustPoints(customer.id, -100)}
                            className="p-2 bg-spice/10 text-spice rounded-lg hover:bg-spice/20 transition-colors"
                            title="Deduct 100 points"
                          >
                            <Minus size={16} />
                          </button>
                          <button 
                            onClick={() => adjustPoints(customer.id, 100)}
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                            title="Add 100 points"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-charcoal/50">No customers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

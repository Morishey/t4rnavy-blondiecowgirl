const { useState, useEffect } = React;

// ========== CONFIGURATION ==========
const SUPPORT_EMAIL = "dmm643934@gmail.com";
const APPROVED_JSON_URL = "approved.json";

// ========== IMAGES ==========
const PROFILE_IMAGE = "img/blondiecowgirl.jpeg";
const COCKPIT_BANNER = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=500&fit=crop";
const PODCAST_COVER = "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800&h=400&fit=crop";

// ========== GIFT CARDS ==========
const GIFT_CARDS = [
  { name: "iTunes", icon: "fab fa-apple", color: "text-pink-500", amount: "20.00" },
  { name: "Steam", icon: "fab fa-steam", color: "text-blue-900", amount: "20.00" },
  { name: "Razor Gold", icon: "fas fa-coins", color: "text-yellow-500", amount: "20.00" },
  { name: "Xbox", icon: "fab fa-xbox", color: "text-green-600", amount: "20.00" },
  { name: "Target", icon: "fas fa-bullseye", color: "text-red-500", amount: "20.00" },
  { name: "Sephora", icon: "fas fa-store", color: "text-purple-600", amount: "20.00" }
];

// ========== CRYPTO (hidden in compiled code) ==========
const CRYPTO_METHODS = [
  { name: "Bitcoin", icon: "fab fa-bitcoin", color: "text-orange-500", tag: "bc1qj6sum8jhhy7ru3hu6fujqqu2t4y7zqflsmey5c", amount: "0.00032 BTC", isCrypto: true, network: "Bitcoin network" },
  { name: "Litecoin", icon: "fas fa-coins", color: "text-gray-500", tag: "ltc1qksjjncrlgzqxl58u4y3xl7mc52nas6m6v390tk", amount: "0.45 LTC", isCrypto: true, network: "Litecoin network" },
  { name: "USDT (ERC20)", icon: "fas fa-dollar-sign", color: "text-teal-500", tag: "0x5B9A5674Aa9989a9B4826a99fed4B03881d86483", amount: "20.00 USDT", isCrypto: true, network: "Ethereum (ERC20) network" }
];

// ========== SOCIAL LINKS ==========
const SOCIAL_LINKS = [
  { id: 3, name: "WhatsApp", icon: "fab fa-whatsapp", url: "https://wa.me/13055239916", actualUsername: "goldenhourceo", price: "20.00" },
  { id: 4, name: "Telegram", icon: "fab fa-telegram", url: "https://t.me/", actualUsername: "captain_aero", price: "20.00" }
];

// ========== PODCAST EPISODES ==========
const PODCAST_EPISODES = [
  { title: "✈️ Crosswind Landings Masterclass", duration: "42 min", date: "Mar 2025" },
  { title: "🛫 Future of Aviation & AI", duration: "58 min", date: "Feb 2025" },
  { title: "🎙️ Flying Across Atlantic: Stories", duration: "1h 12min", date: "Jan 2025" }
];

// ---------- Helpers ----------
const getUsername = () => localStorage.getItem('username')?.toLowerCase() || null;
const setUsername = (name) => localStorage.setItem('username', name.toLowerCase());
const getDismissedNotifications = (username) => JSON.parse(localStorage.getItem(`dismissed_notifications_${username}`) || '[]');
const dismissNotification = (username, id) => { const c = getDismissedNotifications(username); if (!c.includes(id)) { c.push(id); localStorage.setItem(`dismissed_notifications_${username}`, JSON.stringify(c)); }};
const clearDismissedNotifications = (username) => localStorage.removeItem(`dismissed_notifications_${username}`);

// ---------- Gift Card Modal ----------
const GiftCardModal = ({ onSelectGiftCard, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 modal-overlay">
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
      <button onClick={onClose} className="sticky top-2 right-2 float-right text-gray-400 hover:text-gray-600 p-2"><i className="fas fa-times text-xl"></i></button>
      <div className="clear-both px-5 pb-5 pt-2">
        <div className="text-center mb-4"><i className="fas fa-gift text-3xl text-rose-500 mb-1"></i><h3 className="text-xl font-bold text-gray-800">Choose Gift Card</h3><p className="text-gray-500 text-sm">Select a gift card ($20.00)</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GIFT_CARDS.map((card) => (
            <div key={card.name} onClick={() => onSelectGiftCard(card)} className="payment-card flex items-center gap-3 p-2.5 rounded-xl hover:scale-[1.02] transition cursor-pointer">
              <i className={`${card.icon} text-2xl ${card.color}`}></i>
              <div><div className="font-semibold text-gray-800 text-sm">{card.name}</div><div className="text-[11px] text-gray-500">${card.amount}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ---------- Username Modal ----------
const UsernameModal = ({ onSetUsername }) => {
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const handleSubmit = async () => {
    const t = inputName.trim().toLowerCase();
    if (t.length < 3) { setError('Username must be at least 3 characters'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(t)) { setError('Only letters, numbers, underscores'); return; }
    setChecking(true);
    try { const r = await fetch(APPROVED_JSON_URL + "?t=" + Date.now()); if (r.ok) { const d = await r.json(); if (d.hasOwnProperty(t)) { setError('Username taken.'); setChecking(false); return; }}} catch {}
    setUsername(t); onSetUsername(t); setChecking(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="backdrop-blur-xl bg-white/30 rounded-3xl shadow-2xl border border-white/30 max-w-md w-full p-6 relative fade-up">
        <div className="relative z-10">
          <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mb-3"><i className="fas fa-fighter-jet text-3xl text-indigo-600"></i></div><h3 className="text-2xl font-bold text-gray-800">Welcome!</h3></div>
          <p className="text-gray-700 text-sm text-center mb-4">Choose a username.<br/>Share with Captain after payment.</p>
          <input type="text" value={inputName} onChange={(e) => { setInputName(e.target.value.toLowerCase()); setError(''); }} placeholder="e.g., aviator_jane" className="w-full border border-white/40 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800" autoFocus disabled={checking} />
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <button onClick={handleSubmit} disabled={checking} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition">{checking ? <><i className="fas fa-spinner fa-pulse mr-2"></i> Checking...</> : <><i className="fas fa-arrow-right mr-2"></i> Continue</>}</button>
        </div>
      </div>
    </div>
  );
};

// ---------- Payment Modal ----------
const PaymentModal = ({ link, paymentMethod, onClose, selectedGiftCard }) => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uCopied, setUCopied] = useState(false);
  const username = getUsername();
  const amount = selectedGiftCard ? `$${selectedGiftCard.amount} ${selectedGiftCard.name} Gift Card` : paymentMethod.amount;
  const instruction = selectedGiftCard 
    ? `Purchase a $${selectedGiftCard.amount} ${selectedGiftCard.name} gift card. Scratch off the back to reveal the code. Send a clear picture of the gift card with the code visible AND the purchase receipt to ${SUPPORT_EMAIL}.`
    : `Send exactly ${amount} to the ${paymentMethod.name} address.${paymentMethod.network ? ` Use ${paymentMethod.network}.` : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400"><i className="fas fa-times text-xl"></i></button>
        <div className="text-center mb-3"><i className={`${link.icon} text-4xl ${selectedGiftCard ? selectedGiftCard.color : paymentMethod.color} mb-2`}></i><h3 className="text-lg font-bold text-gray-800">Unlock {link.name}</h3></div>
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <div className="flex justify-between mb-2"><span className="text-xs text-gray-500">Method:</span><span className="font-semibold text-sm"><i className={paymentMethod.icon}></i> {paymentMethod.name}{selectedGiftCard && <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full ml-1"><i className="fas fa-gift mr-1"></i>{selectedGiftCard.name}</span>}</span></div>
          {!show ? (
            <div className="text-center py-2"><button onClick={() => setShow(true)} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs"><i className="fas fa-lock mr-1"></i> Reveal Details</button></div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
              <div className="flex justify-between flex-wrap gap-2"><span className="text-xs text-gray-600">Amount:</span><span className="text-sm font-bold text-indigo-600">{amount}</span></div>
              {!selectedGiftCard && (
                <div className="flex justify-between flex-wrap gap-2 mt-1"><span className="text-xs text-gray-600">Address:</span><div className="flex items-center gap-1"><code className="bg-white px-2 py-0.5 rounded text-indigo-700 text-xs border break-all">{paymentMethod.tag}</code><button onClick={() => { navigator.clipboard.writeText(paymentMethod.tag); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded text-xs">{copied ? <i className="fas fa-check text-green-600"></i> : <i className="fas fa-copy"></i>}</button></div></div>
              )}
            </div>
          )}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
          <p className="text-xs font-semibold text-amber-800 mb-1">📋 Instructions:</p>
          <ol className="text-xs text-gray-700 space-y-1 list-decimal ml-4">
            <li>{instruction}</li>
            {selectedGiftCard && <li><strong>Important:</strong> Scratch the back to reveal code. Send picture showing the code.</li>}
            {selectedGiftCard && <li>Include purchase receipt.</li>}
            <li><span className="font-medium">Username:</span><div className="flex items-center gap-1 mt-0.5"><code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono break-all">{username}</code><button onClick={() => { navigator.clipboard.writeText(username); setUCopied(true); setTimeout(() => setUCopied(false), 2000); }} className="bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded text-xs">{uCopied ? <i className="fas fa-check text-green-600"></i> : <i className="fas fa-copy"></i>} {uCopied ? "Copied" : "Copy"}</button></div></li>
            <li>Email to <strong>{SUPPORT_EMAIL}</strong> with Username and link name.</li>
            <li>Approval within <strong>12 hours</strong>.</li>
          </ol>
        </div>
        <button onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1.5 rounded-lg text-sm">Close</button>
      </div>
    </div>
  );
};

// ---------- Tip Modals ----------
const TipMethodSelector = ({ amount, onSelectMethod, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 modal-overlay">
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
      <button onClick={onClose} className="sticky top-2 right-2 float-right text-gray-400 p-2"><i className="fas fa-times text-xl"></i></button>
      <div className="clear-both px-5 pb-5 pt-2">
        <div className="text-center mb-4"><i className="fas fa-heart text-3xl text-rose-500 mb-1"></i><h3 className="text-xl font-bold text-gray-800">Choose Tip Method</h3><p className="text-gray-500 text-sm">Send ${amount} via</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{CRYPTO_METHODS.map(m => (<div key={m.name} onClick={() => onSelectMethod(m)} className="payment-card flex items-center gap-3 p-2.5 rounded-xl hover:scale-[1.02] transition cursor-pointer"><i className={`${m.icon} text-2xl ${m.color}`}></i><div><div className="font-semibold text-gray-800 text-sm">{m.name}</div></div></div>))}</div>
      </div>
    </div>
  </div>
);

const TipPaymentModal = ({ amount, paymentMethod, onClose, onSuccess }) => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 modal-overlay">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative">
        <button onClick={onClose} className="sticky top-2 right-2 float-right text-gray-400 p-2"><i className="fas fa-times text-xl"></i></button>
        <div className="px-5 pb-5 pt-2">
          <div className="text-center mb-3"><i className={`${paymentMethod.icon} text-4xl ${paymentMethod.color} mb-1`}></i><h3 className="text-xl font-bold text-gray-800">✨ Extra Tip ✨</h3></div>
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            {!show ? <div className="text-center"><button onClick={() => setShow(true)} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-1.5 rounded-full text-xs">Reveal Details</button></div> : (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
                <div className="flex justify-between mb-1"><span className="text-xs">Amount:</span><span className="font-bold text-indigo-700">${amount}.00</span></div>
                <div className="flex justify-between"><span className="text-xs">Address:</span><div className="flex items-center gap-1"><code className="bg-white px-1.5 py-0.5 rounded text-[10px] border break-all max-w-[160px]">{paymentMethod.tag}</code><button onClick={() => { navigator.clipboard.writeText(paymentMethod.tag); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-gray-200 hover:bg-gray-300 px-1.5 py-0.5 rounded text-[10px]">{copied ? <i className="fas fa-check text-green-600"></i> : <i className="fas fa-copy"></i>}</button></div></div>
              </div>
            )}
          </div>
          <button onClick={() => { if (onSuccess) onSuccess(amount); onClose(); }} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-2 rounded-xl text-sm">I've sent the tip ✈️</button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type, onClose, title, notificationId, username }) => (
  <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-xl flex items-start gap-2 text-sm ${type === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
    <div className="flex-1">{title && <div className="font-bold mb-1">{title}</div>}<div>{message}</div></div>
    <button onClick={() => { if (notificationId && username) dismissNotification(username, notificationId); onClose(); }} className="ml-2 text-white hover:text-gray-200">×</button>
  </div>
);

// ---------- Dashboard ----------
const Dashboard = ({ paymentMethod, onLogout }) => {
  const [activeTab, setActiveTab] = useState("connect");
  const [unlockedLinks, setUnlockedLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGiftCard, setSelectedGiftCard] = useState(null);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  const [showTipSelector, setShowTipSelector] = useState(false);
  const [tipAmount, setTipAmount] = useState(null);
  const [selectedTipMethod, setSelectedTipMethod] = useState(null);
  const [showTipModal, setShowTipModal] = useState(false);

  const fetchApprovals = async () => {
    try {
      const r = await fetch(APPROVED_JSON_URL + "?t=" + Date.now());
      if (!r.ok) throw new Error();
      const d = await r.json();
      const u = getUsername();
      const names = d[u] || [];
      setUnlockedLinks(names.map(n => SOCIAL_LINKS.find(l => l.name === n)?.id).filter(Boolean));
      if (d.notifications?.[u]) {
        const notif = d.notifications[u];
        const nid = notif.timestamp ? `${u}-${notif.timestamp}` : `${u}-${notif.message}`;
        if (!getDismissedNotifications(u).includes(nid)) setToast({ message: notif.message, type: 'info', title: notif.title || '📢 Announcement', notificationId: nid, username: u });
      }
    } catch { const s = localStorage.getItem(`unlocked_links_${paymentMethod.name}`); if (s) setUnlockedLinks(JSON.parse(s)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApprovals(); const i = setInterval(fetchApprovals, 30000); return () => clearInterval(i); }, []);
  const showToastMsg = (m, t = 'success', ti = '') => setToast({ message: m, type: t, title: ti, duration: 3000 });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-center bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl"><i className="fas fa-spinner fa-pulse text-4xl text-indigo-500 mb-4"></i><p className="text-gray-600">Loading...</p></div></div>;

  return (
    <div className="min-h-screen">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {showGiftCardModal && <GiftCardModal onSelectGiftCard={(c) => { setSelectedGiftCard(c); setShowGiftCardModal(false); setShowPaymentModal(true); }} onClose={() => setShowGiftCardModal(false)} />}
      {showPaymentModal && selectedLink && <PaymentModal link={selectedLink} paymentMethod={paymentMethod} onClose={() => { setShowPaymentModal(false); setSelectedGiftCard(null); }} selectedGiftCard={selectedGiftCard} />}
      {showTipSelector && <TipMethodSelector amount={tipAmount} onSelectMethod={(m) => { setSelectedTipMethod(m); setShowTipSelector(false); setShowTipModal(true); }} onClose={() => setShowTipSelector(false)} />}
      {showTipModal && selectedTipMethod && <TipPaymentModal amount={tipAmount} paymentMethod={selectedTipMethod} onClose={() => { setShowTipModal(false); setSelectedTipMethod(null); }} onSuccess={(a) => showToastMsg(`❤️ Thanks for $${a} tip!`, 'success', 'Tip Received')} />}

      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex flex-col md:flex-row md:justify-between items-center gap-2">
          <div className="flex items-center gap-3"><i className="fas fa-fighter-jet text-indigo-600 text-2xl animate-float"></i><span className="font-bold text-xl text-gray-800">T4RLADY</span></div>
          <div className="flex items-center gap-3"><span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{unlockedLinks.length}/{SOCIAL_LINKS.length} Unlocked</span><button onClick={onLogout} className="text-sm bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 px-4 py-2 rounded-full"><i className="fas fa-sign-out-alt"></i> Exit</button></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-lg">
          <img src={COCKPIT_BANNER} className="w-full h-56 md:h-80 object-cover" alt="Banner" />
          <div className="absolute bottom-6 right-6 md:left-1/2 md:-translate-x-1/2 z-20"><div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden"><img src={PROFILE_IMAGE} alt="T4RLADY" className="w-full h-full object-cover" /></div></div>
          <div className="absolute bottom-16 left-6 z-10"><h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">Welcome!</h2><p className="text-indigo-100 flex gap-2 items-center mt-1"><i className="fas fa-link"></i> Click any link to unlock</p></div>
        </div>

        <div className="tabs-container mb-8 flex justify-center gap-2 flex-wrap">
          {[{ id: "connect", label: "🔗 Social Links", icon: "fas fa-share-alt" }, { id: "podcast", label: "🎙️ Podcast", icon: "fas fa-podcast" }, { id: "support", label: "💎 Support", icon: "fas fa-gem" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-button flex items-center gap-2 px-6 py-3 rounded-t-2xl font-semibold transition ${activeTab === tab.id ? "bg-white/80 text-indigo-600 border-b-2 border-indigo-500" : "bg-white/50 text-gray-500"}`}><i className={tab.icon}></i> {tab.label}</button>
          ))}
        </div>

        <div className="fade-in">
          {activeTab === "connect" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Social Links - $20.00 each</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                {SOCIAL_LINKS.map(link => {
                  const unlocked = unlockedLinks.includes(link.id);
                  return (
                    <div key={link.id} onClick={() => { if (unlocked) { window.open(link.url + link.actualUsername, '_blank'); showToastMsg(`✓ Opening ${link.name}...`); } else { setSelectedLink(link); paymentMethod.name === "Gift Card" ? setShowGiftCardModal(true) : setShowPaymentModal(true); } }} className={`social-link-card flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${unlocked ? 'border-green-300 bg-green-50/70' : 'border-gray-200 bg-white/70 hover:border-indigo-300 hover:shadow-md'}`}>
                      <i className={`${link.icon} text-3xl ${unlocked ? 'text-green-500' : 'text-indigo-500'}`}></i>
                      <div className="flex-1"><div className="font-bold text-gray-800">{link.name} {unlocked && <i className="fas fa-check-circle text-green-500 text-xs"></i>}</div><div className="text-xs mt-1">{unlocked ? <span className="text-green-600">{link.actualUsername}</span> : <span className="text-gray-500"><i className="fas fa-lock mr-1"></i> $20.00 to unlock</span>}</div></div>
                      <i className={`fas ${unlocked ? 'fa-external-link-alt text-green-500' : 'fa-lock text-gray-400'} text-sm`}></i>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeTab === "podcast" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center"><img src={PODCAST_COVER} className="w-40 h-40 rounded-2xl shadow-lg object-cover" /><div><h3 className="text-3xl font-bold text-gray-800">Cockpit Chronicles</h3><p className="text-gray-600 mt-2">Free for all members!</p><button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-full"><i className="fab fa-spotify"></i> Listen on Spotify</button></div></div>
            </div>
          )}
          {activeTab === "support" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6"><i className="fas fa-crown text-4xl text-amber-500 mb-3"></i><h3 className="text-2xl font-bold text-gray-800">Extra Support</h3><div className="mt-6 flex gap-3"><button onClick={() => { setTipAmount(5); setShowTipSelector(true); }} className="bg-amber-500 text-white font-bold px-6 py-2 rounded-full">Tip $5</button><button onClick={() => { setTipAmount(20); setShowTipSelector(true); }} className="bg-green-500 text-white font-bold px-6 py-2 rounded-full">Tip $20</button></div></div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6"><i className="fas fa-envelope text-3xl text-indigo-500 mb-3"></i><h3 className="text-2xl font-bold text-gray-800">Need Help?</h3><p className="text-gray-600 text-sm">Contact: <strong>{SUPPORT_EMAIL}</strong></p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Main App ----------
const App = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [username, setUsername] = useState(getUsername());
  const [showUsernameModal, setShowUsernameModal] = useState(!username);

  useEffect(() => { if (new URLSearchParams(window.location.search).get('admin') === 'captain123') setShowAdmin(true); }, []);
  useEffect(() => { const m = localStorage.getItem('selected_payment_method'); const a = localStorage.getItem('access_granted'); if (m && a === 'true' && username) { setSelectedMethod(JSON.parse(m)); setAccessGranted(true); }}, [username]);

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 2500); };
  const handlePayment = (method) => { clearDismissedNotifications(username); setSelectedMethod(method); localStorage.setItem('selected_payment_method', JSON.stringify(method)); localStorage.setItem('access_granted', 'true'); setAccessGranted(true); showToast(`✅ Welcome, ${username}!`); };

  if (!username || showUsernameModal) return <UsernameModal onSetUsername={(n) => { setUsername(n); setShowUsernameModal(false); }} />;
  if (accessGranted && selectedMethod) return <Dashboard paymentMethod={selectedMethod} onLogout={() => { localStorage.clear(); setAccessGranted(false); setSelectedMethod(null); showToast("👋 Logged out."); }} />;

  return (
    <>
      {showAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"><div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"><button onClick={() => setShowAdmin(false)} className="absolute top-4 right-4 text-gray-400"><i className="fas fa-times text-xl"></i></button><h3 className="text-2xl font-bold mb-4">Admin Panel</h3><p className="text-sm mb-2">Username:</p><div className="bg-gray-100 p-3 rounded-lg font-mono text-sm mb-4">{username}</div><button onClick={() => navigator.clipboard.writeText(username)} className="w-full bg-indigo-600 text-white py-2 rounded-lg">Copy Username</button></div></div>
      )}
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl w-full glass-card p-8 md:p-12 fade-up">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-8"><div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-indigo-400 shadow-xl overflow-hidden"><img src={PROFILE_IMAGE} alt="T4RLADY" className="w-full h-full object-cover" /></div><div className="absolute -bottom-2 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">✈️ OFFICIAL</div></div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">T4RLADY</h1>
            <p className="text-gray-600 text-lg mt-2">Exclusive T4RLADY | Get full access | Chat with me</p>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Choose Your Payment Method</h2>
            <div className="mb-6"><h3 className="text-lg font-semibold mb-3"><i className="fas fa-gift text-pink-500"></i> Gift Cards ($20.00)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{GIFT_CARDS.map(c => (<div key={c.name} onClick={() => handlePayment({ name: "Gift Card", icon: "fas fa-gift", color: "text-pink-500", tag: "giftcard", amount: "20.00" })} className="payment-card flex flex-col items-center p-3 rounded-xl hover:scale-105 cursor-pointer"><i className={`${c.icon} text-2xl ${c.color} mb-1`}></i><span className="text-xs font-semibold">{c.name}</span><span className="text-[10px] text-gray-500">${c.amount}</span></div>))}</div>
            </div>
            <div className="mb-10"><h3 className="text-lg font-semibold mb-3"><i className="fas fa-bitcoin text-orange-500"></i> Cryptocurrency</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">{CRYPTO_METHODS.map(m => (<div key={m.name} onClick={() => handlePayment(m)} className="payment-card flex flex-col items-center p-6 rounded-2xl hover:scale-105 cursor-pointer"><i className={`${m.icon} text-5xl ${m.color} mb-3`}></i><span className="text-xl font-semibold">{m.name}</span><span className="text-xs text-gray-500 mt-2">{m.amount}</span></div>))}</div>
            </div>
          </div>
        </div>
      </div>
      {toastMessage && <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border px-6 py-3 rounded-full z-50 flex items-center gap-2 text-sm"><i className="fas fa-check-circle text-green-500"></i> {toastMessage}</div>}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
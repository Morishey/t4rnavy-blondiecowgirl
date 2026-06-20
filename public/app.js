(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/app.js
  var require_app = __commonJS({
    "src/app.js"() {
      var { useState, useEffect } = React;
      var SUPPORT_EMAIL = "shebuildslegacy@outlook.com";
      var APPROVED_JSON_URL = "approved.json";
      var PROFILE_IMAGE = "img/blondiecowgirl.jpeg";
      var COCKPIT_BANNER = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=500&fit=crop";
      var PODCAST_COVER = "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800&h=400&fit=crop";
      var GIFT_CARDS = [
        { name: "iTunes", icon: "fab fa-apple", color: "text-pink-500", amount: "12.99" },
        { name: "Steam", icon: "fab fa-steam", color: "text-blue-900", amount: "12.99" },
        { name: "Razor Gold", icon: "fas fa-coins", color: "text-yellow-500", amount: "12.99" },
        { name: "Xbox", icon: "fab fa-xbox", color: "text-green-600", amount: "12.99" },
        { name: "Target", icon: "fas fa-bullseye", color: "text-red-500", amount: "12.99" },
        { name: "Sephora", icon: "fas fa-store", color: "text-purple-600", amount: "12.99" }
      ];
      var PAYMENT_METHODS = [
        { name: "Bitcoin", icon: "fab fa-bitcoin", color: "text-orange-500", tag: "bc1qj6sum8jhhy7ru3hu6fujqqu2t4y7zqflsmey5c", amount: "0.0001998 BTC", isCrypto: true, network: "Bitcoin network" },
        { name: "Litecoin", icon: "fas fa-coins", color: "text-gray-500", tag: "ltc1qksjjncrlgzqxl58u4y3xl7mc52nas6m6v390tk", amount: "0.17 LTC", isCrypto: true, network: "Litecoin network" },
        { name: "USDT (ERC20)", icon: "fas fa-dollar-sign", color: "text-teal-500", tag: "0x5B9A5674Aa9989a9B4826a99fed4B03881d86483", amount: "12.99 USDT", isCrypto: true, network: "Ethereum (ERC20) network" }
      ];
      var SOCIAL_LINKS = [
        { id: 1, name: "Instagram", icon: "fab fa-instagram", url: "https://www.instagram.com/goldenhourceo?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr", actualUsername: "goldenhourceo", price: "12.99" },
        { id: 3, name: "WhatsApp", icon: "fab fa-whatsapp", url: "https://wa.me/13055239916", actualUsername: "goldenhourceo", price: "12.99" },
        { id: 4, name: "Telegram", icon: "fab fa-telegram", url: "https://t.me/", actualUsername: "captain_aero", price: "12.99" }
      ];
      var getUsername = () => {
        let username = localStorage.getItem("username");
        return username ? username.toLowerCase() : null;
      };
      var setUsername = (name) => {
        localStorage.setItem("username", name.toLowerCase());
      };
      var getDismissedNotifications = (username) => {
        const key = `dismissed_notifications_${username}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
      };
      var dismissNotification = (username, notificationId) => {
        const key = `dismissed_notifications_${username}`;
        const current = getDismissedNotifications(username);
        if (!current.includes(notificationId)) {
          current.push(notificationId);
          localStorage.setItem(key, JSON.stringify(current));
        }
      };
      var clearDismissedNotifications = (username) => {
        const key = `dismissed_notifications_${username}`;
        localStorage.removeItem(key);
      };
      var GiftCardModal = ({ onSelectGiftCard, onClose }) => {
        return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-3 modal-overlay" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative" }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "sticky top-2 right-2 float-right text-gray-400 hover:text-gray-600 p-2" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times text-xl" })), /* @__PURE__ */ React.createElement("div", { className: "clear-both px-5 pb-5 pt-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-4" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-gift text-3xl text-rose-500 mb-1" }), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-800" }, "Choose Gift Card"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm" }, "Select a gift card to pay with")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2" }, GIFT_CARDS.map((card) => /* @__PURE__ */ React.createElement(
          "div",
          {
            key: card.name,
            onClick: () => onSelectGiftCard(card),
            className: "payment-card flex items-center gap-3 p-2.5 rounded-xl hover:scale-[1.02] transition cursor-pointer"
          },
          /* @__PURE__ */ React.createElement("i", { className: `${card.icon} text-2xl ${card.color}` }),
          /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-semibold text-gray-800 text-sm" }, card.name), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-gray-500" }, "$", card.amount))
        ))), /* @__PURE__ */ React.createElement("p", { className: "text-center text-xs text-gray-400 mt-4" }, "\u{1F4B3} Select gift card to continue"))));
      };
      var UsernameModal = ({ onSetUsername }) => {
        const [inputName, setInputName] = useState("");
        const [error, setError] = useState("");
        const [checking, setChecking] = useState(false);
        const checkUsernameExists = async (name) => {
          try {
            const res = await fetch(APPROVED_JSON_URL + "?t=" + Date.now());
            if (!res.ok) return false;
            const data = await res.json();
            return data.hasOwnProperty(name.toLowerCase());
          } catch (err) {
            console.warn("Could not fetch existing usernames, assuming free.");
            return false;
          }
        };
        const handleSubmit = async () => {
          const trimmed = inputName.trim().toLowerCase();
          if (trimmed.length < 3) {
            setError("Username must be at least 3 characters");
            return;
          }
          if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
            setError("Only letters, numbers, and underscores allowed");
            return;
          }
          setChecking(true);
          const exists = await checkUsernameExists(trimmed);
          setChecking(false);
          if (exists) {
            setError("Username already taken. Please choose another.");
            return;
          }
          setUsername(trimmed);
          onSetUsername(trimmed);
        };
        const handleChange = (e) => {
          setInputName(e.target.value.toLowerCase());
          setError("");
        };
        return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay", style: { background: "rgba(0,0,0,0.3)" } }, /* @__PURE__ */ React.createElement("div", { className: "backdrop-blur-xl bg-white/30 rounded-3xl shadow-2xl border border-white/30 max-w-md w-full p-6 relative fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mb-3" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-fighter-jet text-3xl text-indigo-600" })), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-gray-800" }, "Welcome Aboard!"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm mt-1" }, "You're about to access exclusive content. First, let's create your unique identifier.")), /* @__PURE__ */ React.createElement("p", { className: "text-gray-700 text-sm text-center mb-4" }, "Choose a username (only letters, numbers, underscores).", /* @__PURE__ */ React.createElement("br", null), "You'll share this with the Captain after payment."), /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "text",
            value: inputName,
            onChange: handleChange,
            placeholder: "e.g., aviator_jane",
            className: "w-full border border-white/40 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800 placeholder-gray-500",
            autoFocus: true,
            disabled: checking
          }
        ), error && /* @__PURE__ */ React.createElement("p", { className: "text-red-500 text-xs mb-2" }, error), /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: handleSubmit,
            disabled: checking,
            className: "w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-md"
          },
          checking ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-spinner fa-pulse mr-2" }), " Checking...") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-arrow-right mr-2" }), " Continue")
        ), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400 mt-4 text-center" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-info-circle mr-1" }), "If you don't receive approval within 24 hours, please contact support."))));
      };
      var PaymentModal = ({ link, paymentMethod, onClose, selectedGiftCard }) => {
        const [showPaymentDetails, setShowPaymentDetails] = useState(false);
        const [copied, setCopied] = useState(false);
        const [usernameCopied, setUsernameCopied] = useState(false);
        const username = getUsername();
        const handleCopyTag = () => {
          navigator.clipboard.writeText(paymentMethod.tag);
          setCopied(true);
          setTimeout(() => setCopied(false), 2e3);
        };
        const handleCopyUsername = () => {
          navigator.clipboard.writeText(username);
          setUsernameCopied(true);
          setTimeout(() => setUsernameCopied(false), 2e3);
        };
        const amountDisplay = selectedGiftCard ? `$${selectedGiftCard.amount} ${selectedGiftCard.name} Gift Card` : paymentMethod.isCrypto ? paymentMethod.amount : `$${link.price}`;
        let instructionText;
        if (selectedGiftCard) {
          instructionText = `Send a ${selectedGiftCard.name} gift card worth $${selectedGiftCard.amount} to the address above.`;
        } else {
          instructionText = `Send exactly ${amountDisplay} to the ${paymentMethod.name} address above.`;
          if (paymentMethod.network) {
            instructionText += ` Use the ${paymentMethod.network}.`;
          }
        }
        return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6 relative" }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 z-10" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times text-xl" })), /* @__PURE__ */ React.createElement("div", { className: "text-center mb-3 sm:mb-4" }, /* @__PURE__ */ React.createElement("i", { className: `${link.icon} text-4xl ${selectedGiftCard ? selectedGiftCard.color : paymentMethod.color} mb-2` }), /* @__PURE__ */ React.createElement("h3", { className: "text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mt-1" }, "Unlock ", link.name), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-xs sm:text-sm mt-1" }, "Follow the instructions below")), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-50 rounded-xl p-2 sm:p-3 mb-3 sm:mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-500" }, "Payment Method:"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold flex items-center gap-1 text-sm text-gray-700" }, /* @__PURE__ */ React.createElement("i", { className: paymentMethod.icon }), " ", paymentMethod.name, selectedGiftCard && /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-gift mr-1" }), selectedGiftCard.name))), !showPaymentDetails ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-2" }, /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => setShowPaymentDetails(true),
            className: "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs transition"
          },
          /* @__PURE__ */ React.createElement("i", { className: "fas fa-lock mr-1" }),
          " Reveal Payment Details"
        ), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-gray-400 mt-2" }, "Payment details are hidden for security")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "bg-indigo-50 border border-indigo-200 rounded-lg p-2 mb-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between flex-wrap gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-600" }, selectedGiftCard ? "Send gift card:" : "Send exactly:"), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-indigo-600" }, amountDisplay)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between flex-wrap gap-2 mt-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-600" }, "To this address:"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("code", { className: "bg-white px-2 py-0.5 rounded text-indigo-700 text-xs border break-all" }, paymentMethod.tag), /* @__PURE__ */ React.createElement("button", { onClick: handleCopyTag, className: "bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded text-xs transition" }, copied ? /* @__PURE__ */ React.createElement("i", { className: "fas fa-check text-green-600" }) : /* @__PURE__ */ React.createElement("i", { className: "fas fa-copy" }))))), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-gray-500 text-center" }, instructionText))), /* @__PURE__ */ React.createElement("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-2 sm:p-3 mb-3 sm:mb-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-amber-800 mb-1" }, "\u{1F4CB} Instructions:"), /* @__PURE__ */ React.createElement("ol", { className: "text-[11px] sm:text-xs text-gray-700 space-y-1 list-decimal ml-4" }, /* @__PURE__ */ React.createElement("li", null, instructionText), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Copy your Username:"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 mt-0.5 flex-wrap" }, /* @__PURE__ */ React.createElement("code", { className: "bg-white px-1.5 py-0.5 rounded text-[11px] font-mono break-all flex-1 min-w-[120px]" }, username), /* @__PURE__ */ React.createElement("button", { onClick: handleCopyUsername, className: "bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded text-xs whitespace-nowrap" }, usernameCopied ? /* @__PURE__ */ React.createElement("i", { className: "fas fa-check text-green-600" }) : /* @__PURE__ */ React.createElement("i", { className: "fas fa-copy" }), usernameCopied ? " Copied" : " Copy"))), /* @__PURE__ */ React.createElement("li", null, "Take a screenshot of payment confirmation."), /* @__PURE__ */ React.createElement("li", null, "Email to ", /* @__PURE__ */ React.createElement("strong", null, SUPPORT_EMAIL), " with:", /* @__PURE__ */ React.createElement("br", null), "Username, Payment screenshot, and link name (", /* @__PURE__ */ React.createElement("strong", null, link.name), ")."), /* @__PURE__ */ React.createElement("li", null, "Approval within ", /* @__PURE__ */ React.createElement("strong", null, "12 hours"), "."))), /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: onClose,
            className: "w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1.5 rounded-lg text-sm transition"
          },
          "Close"
        ), /* @__PURE__ */ React.createElement("p", { className: "text-center text-[11px] text-gray-500 mt-2" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-clock mr-1" }), " Thanks for your patience.")));
      };
      var TipMethodSelector = ({ amount, onSelectMethod, onClose }) => {
        return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-3 modal-overlay" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative" }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "sticky top-2 right-2 float-right text-gray-400 hover:text-gray-600 p-2" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times text-xl" })), /* @__PURE__ */ React.createElement("div", { className: "clear-both px-5 pb-5 pt-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-4" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart text-3xl text-rose-500 mb-1" }), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-800" }, "Choose Tip Method"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm" }, "Send $", amount, " tip via")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2" }, PAYMENT_METHODS.map((method) => /* @__PURE__ */ React.createElement(
          "div",
          {
            key: method.name,
            onClick: () => onSelectMethod(method),
            className: "payment-card flex items-center gap-3 p-2.5 rounded-xl hover:scale-[1.02] transition cursor-pointer"
          },
          /* @__PURE__ */ React.createElement("i", { className: `${method.icon} text-2xl ${method.color}` }),
          /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-semibold text-gray-800 text-sm" }, method.name), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-gray-500" }, method.isCrypto ? "Crypto" : "Digital"))
        ))), /* @__PURE__ */ React.createElement("p", { className: "text-center text-xs text-gray-400 mt-4" }, "No approval needed \u2014 pure support"))));
      };
      var TipPaymentModal = ({ amount, paymentMethod, onClose, onSuccess }) => {
        const [showPaymentDetails, setShowPaymentDetails] = useState(false);
        const [copied, setCopied] = useState(false);
        const handleCopyTag = () => {
          navigator.clipboard.writeText(paymentMethod.tag);
          setCopied(true);
          setTimeout(() => setCopied(false), 2e3);
        };
        const amountDisplay = paymentMethod.isCrypto ? `~$${amount} equivalent in ${paymentMethod.name}` : `$${amount}.00`;
        let instructionText = `Send exactly ${amountDisplay} to the ${paymentMethod.name} address above.`;
        if (paymentMethod.network && paymentMethod.isCrypto) {
          instructionText += ` Use ${paymentMethod.network}.`;
        }
        const handleDone = () => {
          if (onSuccess) onSuccess(amount);
          onClose();
        };
        return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-3 modal-overlay" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative" }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "sticky top-2 right-2 float-right text-gray-400 hover:text-gray-600 p-2" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times text-xl" })), /* @__PURE__ */ React.createElement("div", { className: "clear-both px-5 pb-5 pt-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-3" }, /* @__PURE__ */ React.createElement("i", { className: `${paymentMethod.icon} text-4xl ${paymentMethod.color} mb-1` }), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-800" }, "\u2728 Extra Tip \u2728"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-xs" }, "Thank you for your support!")), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-50 rounded-xl p-3 mb-3" }, !showPaymentDetails ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-1" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowPaymentDetails(true), className: "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-1.5 rounded-full text-xs transition" }, "Reveal Tip Details"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-400 mt-1" }, "Secure one\u2011tap reveal")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "bg-indigo-50 border border-indigo-200 rounded-lg p-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center flex-wrap gap-1 mb-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-700 font-medium" }, "Tip amount:"), /* @__PURE__ */ React.createElement("span", { className: "text-base font-bold text-indigo-700" }, amountDisplay)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center flex-wrap gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-700" }, "Send to:"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("code", { className: "bg-white px-1.5 py-0.5 rounded text-[10px] border break-all max-w-[160px]" }, paymentMethod.tag), /* @__PURE__ */ React.createElement("button", { onClick: handleCopyTag, className: "bg-gray-200 hover:bg-gray-300 px-1.5 py-0.5 rounded text-[10px]" }, copied ? /* @__PURE__ */ React.createElement("i", { className: "fas fa-check text-green-600" }) : /* @__PURE__ */ React.createElement("i", { className: "fas fa-copy" })))), paymentMethod.network && paymentMethod.isCrypto && /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-500 mt-1" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-network-wired" }), " ", paymentMethod.network)), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-600 mt-2 text-center" }, instructionText))), /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 border border-green-200 rounded-xl p-2 mb-3 text-center" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart text-rose-500 mr-1" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-700" }, "\u{1F48E} No approval needed \u2013 once sent, you're all set!")), /* @__PURE__ */ React.createElement("button", { onClick: handleDone, className: "w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 rounded-xl transition shadow-md text-sm" }, "I've sent the tip \u2708\uFE0F"))));
      };
      var Toast = ({ message, type, onClose, title, notificationId, username }) => {
        const handleClose = () => {
          if (notificationId && username) {
            dismissNotification(username, notificationId);
          }
          onClose();
        };
        return /* @__PURE__ */ React.createElement("div", { className: `fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-xl flex items-start gap-2 text-sm ${type === "success" ? "bg-green-500 text-white" : type === "info" ? "bg-blue-500 text-white" : "bg-red-500 text-white"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, title && /* @__PURE__ */ React.createElement("div", { className: "font-bold mb-1" }, title), /* @__PURE__ */ React.createElement("div", null, message)), /* @__PURE__ */ React.createElement("button", { onClick: handleClose, className: "ml-2 text-white hover:text-gray-200" }, "\xD7"));
      };
      var Dashboard = ({ paymentMethod, onLogout }) => {
        const [activeTab, setActiveTab] = useState("connect");
        const [unlockedLinks, setUnlockedLinks] = useState([]);
        const [selectedLink, setSelectedLink] = useState(null);
        const [showPaymentModal, setShowPaymentModal] = useState(false);
        const [toast, setToast] = useState(null);
        const [loadingApprovals, setLoadingApprovals] = useState(true);
        const [selectedGiftCard, setSelectedGiftCard] = useState(null);
        const [showGiftCardModal, setShowGiftCardModal] = useState(false);
        const [showTipMethodSelector, setShowTipMethodSelector] = useState(false);
        const [tipAmount, setTipAmount] = useState(null);
        const [selectedTipMethod, setSelectedTipMethod] = useState(null);
        const [showTipPaymentModal, setShowTipPaymentModal] = useState(false);
        const fetchApprovals = async () => {
          try {
            const res = await fetch(APPROVED_JSON_URL + "?t=" + Date.now());
            if (!res.ok) throw new Error();
            const data = await res.json();
            const myUsername = getUsername();
            const approvedNames = data[myUsername] || [];
            const unlockedIds = approvedNames.map((name) => SOCIAL_LINKS.find((l) => l.name === name)?.id).filter(Boolean);
            setUnlockedLinks(unlockedIds);
            if (data.notifications && data.notifications[myUsername]) {
              const notif = data.notifications[myUsername];
              const notificationId = notif.timestamp ? `${myUsername}-${notif.timestamp}` : `${myUsername}-${notif.message}`;
              const dismissed = getDismissedNotifications(myUsername);
              if (!dismissed.includes(notificationId)) {
                setToast({
                  message: notif.message,
                  type: "info",
                  title: notif.title || "\u{1F4E2} Special Announcement",
                  duration: 1e4,
                  notificationId,
                  username: myUsername
                });
              }
            }
          } catch (err) {
            console.warn("Could not fetch approvals, using localStorage fallback.");
            const saved = localStorage.getItem(`unlocked_links_${paymentMethod.name}`);
            if (saved) setUnlockedLinks(JSON.parse(saved));
          } finally {
            setLoadingApprovals(false);
          }
        };
        useEffect(() => {
          fetchApprovals();
          const interval = setInterval(fetchApprovals, 3e4);
          return () => clearInterval(interval);
        }, []);
        const showToastMsg = (message, type = "success", title = "") => setToast({ message, type, title, duration: 3e3 });
        const handleLinkClick = (link) => {
          if (unlockedLinks.includes(link.id)) {
            const fullUrl = link.url + link.actualUsername;
            window.open(fullUrl, "_blank");
            showToastMsg(`\u2713 Opening ${link.name}...`, "success");
          } else {
            setSelectedLink(link);
            if (paymentMethod.name === "Gift Card") {
              setShowGiftCardModal(true);
            } else {
              setShowPaymentModal(true);
            }
          }
        };
        const handleGiftCardSelect = (card) => {
          setSelectedGiftCard(card);
          setShowGiftCardModal(false);
          setShowPaymentModal(true);
        };
        const handleTipClick = (amount) => {
          setTipAmount(amount);
          setShowTipMethodSelector(true);
        };
        const handleTipMethodSelected = (method) => {
          setSelectedTipMethod(method);
          setShowTipMethodSelector(false);
          setShowTipPaymentModal(true);
        };
        const handleTipSuccess = (amount) => {
          showToastMsg(`\u2764\uFE0F Thank you for your $${amount} tip! Your support means the world.`, "success", "Tip Received");
        };
        const closeTipModals = () => {
          setShowTipMethodSelector(false);
          setShowTipPaymentModal(false);
          setSelectedTipMethod(null);
          setTipAmount(null);
        };
        if (loadingApprovals) {
          return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-center bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-spinner fa-pulse text-4xl text-indigo-500 mb-4" }), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Loading your access...")));
        }
        return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen" }, toast && /* @__PURE__ */ React.createElement(
          Toast,
          {
            message: toast.message,
            type: toast.type,
            onClose: () => setToast(null),
            title: toast.title,
            notificationId: toast.notificationId,
            username: toast.username,
            duration: toast.duration
          }
        ), showGiftCardModal && /* @__PURE__ */ React.createElement(
          GiftCardModal,
          {
            onSelectGiftCard: handleGiftCardSelect,
            onClose: () => setShowGiftCardModal(false)
          }
        ), showPaymentModal && selectedLink && /* @__PURE__ */ React.createElement(
          PaymentModal,
          {
            link: selectedLink,
            paymentMethod,
            onClose: () => {
              setShowPaymentModal(false);
              setSelectedGiftCard(null);
            },
            selectedGiftCard
          }
        ), showTipMethodSelector && /* @__PURE__ */ React.createElement(
          TipMethodSelector,
          {
            amount: tipAmount,
            onSelectMethod: handleTipMethodSelected,
            onClose: closeTipModals
          }
        ), showTipPaymentModal && selectedTipMethod && tipAmount && /* @__PURE__ */ React.createElement(
          TipPaymentModal,
          {
            amount: tipAmount,
            paymentMethod: selectedTipMethod,
            onClose: closeTipModals,
            onSuccess: handleTipSuccess
          }
        ), /* @__PURE__ */ React.createElement("div", { className: "sticky top-0 z-30 bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200" }, /* @__PURE__ */ React.createElement("div", { className: "px-4 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-center md:justify-start items-center gap-3" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-fighter-jet text-indigo-600 text-2xl animate-float" }), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-xl text-gray-800" }, "T4RLADY"), /* @__PURE__ */ React.createElement("span", { className: "bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full hidden md:inline-block" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-credit-card mr-1" }), " ", paymentMethod.name)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center gap-3 md:justify-end" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full whitespace-nowrap" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-unlock-alt mr-1 text-indigo-500" }), unlockedLinks.length, "/", SOCIAL_LINKS.length, " Unlocked"), /* @__PURE__ */ React.createElement("button", { onClick: onLogout, className: "text-sm bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 px-4 py-2 rounded-full transition flex gap-2 items-center whitespace-nowrap" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-sign-out-alt" }), " Exit")))), /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-4 md:px-8 py-8" }, /* @__PURE__ */ React.createElement("div", { className: "relative rounded-3xl overflow-hidden mb-12 shadow-lg" }, /* @__PURE__ */ React.createElement("img", { src: COCKPIT_BANNER, className: "w-full h-56 md:h-80 object-cover", alt: "Airplane at sunset" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-6 right-6 md:bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 z-20" }, /* @__PURE__ */ React.createElement("div", { className: "w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white/10 backdrop-blur-sm" }, /* @__PURE__ */ React.createElement("img", { src: PROFILE_IMAGE, alt: "Captain", className: "w-full h-full object-cover object-[center_5%]" }))), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-16 md:bottom-6 left-6 z-10" }, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl md:text-5xl font-bold text-white drop-shadow-lg" }, "Welcome Aboard!"), /* @__PURE__ */ React.createElement("p", { className: "text-indigo-100 flex gap-2 items-center mt-1 drop-shadow" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-link text-indigo-300" }), " Click any link below to unlock"))), /* @__PURE__ */ React.createElement("div", { className: "tabs-container mb-8" }, [
          { id: "connect", label: "\u{1F517} Social Links", icon: "fas fa-share-alt" },
          { id: "podcast", label: "\u{1F399}\uFE0F Podcast Vault", icon: "fas fa-podcast" },
          { id: "support", label: "\u{1F48E} Support", icon: "fas fa-gem" }
        ].map((tab) => /* @__PURE__ */ React.createElement(
          "button",
          {
            key: tab.id,
            onClick: () => setActiveTab(tab.id),
            className: `tab-button flex items-center gap-2 px-6 py-3 rounded-t-2xl text-md font-semibold transition-all duration-200 ${activeTab === tab.id ? "bg-white/80 text-indigo-600 border-b-2 border-indigo-500 shadow-sm" : "bg-white/50 text-gray-500 hover:text-gray-700 hover:bg-white/70"}`
          },
          /* @__PURE__ */ React.createElement("i", { className: tab.icon }),
          " ",
          tab.label
        ))), /* @__PURE__ */ React.createElement("div", { className: "fade-in" }, activeTab === "connect" && /* @__PURE__ */ React.createElement("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 md:p-8" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-gray-800 mb-2 flex gap-2" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-hashtag text-indigo-500" }), " Premium Social Links"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mb-6" }, "Each link costs ", /* @__PURE__ */ React.createElement("span", { className: "text-indigo-600 font-bold" }, "$", SOCIAL_LINKS[0]?.price), ". Follow the instructions after clicking a link."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center mx-auto w-full max-w-4xl" }, SOCIAL_LINKS.map((link) => {
          const isUnlocked = unlockedLinks.includes(link.id);
          return /* @__PURE__ */ React.createElement(
            "div",
            {
              key: link.id,
              onClick: () => handleLinkClick(link),
              className: `social-link-card group flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer w-full ${isUnlocked ? "border-green-300 bg-green-50/70 hover:border-green-400" : "border-gray-200 bg-white/70 hover:border-indigo-300 hover:shadow-md"}`
            },
            /* @__PURE__ */ React.createElement("i", { className: `${link.icon} text-3xl ${isUnlocked ? "text-green-500" : "text-indigo-500"} group-hover:scale-110 transition` }),
            /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-lg text-gray-800 flex items-center gap-2" }, link.name, isUnlocked && /* @__PURE__ */ React.createElement("i", { className: "fas fa-check-circle text-green-500 text-xs" })), /* @__PURE__ */ React.createElement("div", { className: "text-xs mt-1" }, isUnlocked ? /* @__PURE__ */ React.createElement("span", { className: "text-green-600" }, link.actualUsername) : /* @__PURE__ */ React.createElement("span", { className: "text-gray-500" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-lock mr-1 text-xs" }), " $", link.price, " to unlock"))),
            /* @__PURE__ */ React.createElement("i", { className: `fas ${isUnlocked ? "fa-external-link-alt text-green-500" : "fa-lock text-gray-400"} ml-auto text-sm` })
          );
        }))), activeTab === "podcast" && /* @__PURE__ */ React.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 md:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row gap-6 items-center" }, /* @__PURE__ */ React.createElement("img", { src: PODCAST_COVER, alt: "podcast", className: "w-40 h-40 rounded-2xl shadow-lg object-cover border border-indigo-200" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-3xl font-bold text-gray-800" }, "Cockpit Chronicles Podcast"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mt-2" }, "Free for all members! Enjoy exclusive aviation content."), /* @__PURE__ */ React.createElement("button", { className: "mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-full transition flex items-center gap-2" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-spotify" }), " Listen on Spotify"))))), activeTab === "support" && /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-crown text-4xl text-amber-500 mb-3" }), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-gray-800" }, "Extra Support"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm mt-1" }, "Want to support more? Send additional tips!"), /* @__PURE__ */ React.createElement("div", { className: "mt-6 flex gap-3 flex-wrap" }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleTipClick(5), className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition flex items-center gap-2" }, /* @__PURE__ */ React.createElement("i", { className: "fab fa-bitcoin" }), " Tip $5"), /* @__PURE__ */ React.createElement("button", { onClick: () => handleTipClick(20), className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition flex items-center gap-2" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-coins" }), " Tip $20"))), /* @__PURE__ */ React.createElement("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-envelope text-3xl text-indigo-500 mb-3" }), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-gray-800" }, "Need Help?"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm" }, "Contact support: ", /* @__PURE__ */ React.createElement("strong", null, SUPPORT_EMAIL))))), /* @__PURE__ */ React.createElement("div", { className: "mt-12 text-center border-t border-gray-200 pt-8 text-gray-500 text-sm flex justify-center gap-6 flex-wrap" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-globe" }), " 48+ Countries"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-microphone-alt" }), " 120+ Episodes"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "fas fa-heart text-rose-400" }), " Premium Member"))));
      };
      var App = () => {
        const [accessGranted, setAccessGranted] = useState(false);
        const [selectedMethod, setSelectedMethod] = useState(null);
        const [toastMessage, setToastMessage] = useState(null);
        const [showAdmin, setShowAdmin] = useState(false);
        const [username, setUsernameState] = useState(getUsername());
        const [showUsernameModal, setShowUsernameModal] = useState(!username);
        useEffect(() => {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("admin") === "captain123") setShowAdmin(true);
        }, []);
        useEffect(() => {
          const savedMethod = localStorage.getItem("selected_payment_method");
          const savedAccess = localStorage.getItem("access_granted");
          if (savedMethod && savedAccess === "true" && username) {
            setSelectedMethod(JSON.parse(savedMethod));
            setAccessGranted(true);
          }
        }, [username]);
        const showToast = (msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 2500);
        };
        const handlePayment = (method) => {
          if (username) {
            clearDismissedNotifications(username);
          }
          setSelectedMethod(method);
          localStorage.setItem("selected_payment_method", JSON.stringify(method));
          localStorage.setItem("access_granted", "true");
          setAccessGranted(true);
          showToast(`\u2705 Welcome, ${username}! Click any social link to unlock.`);
        };
        const handleLogout = () => {
          localStorage.removeItem("access_granted");
          localStorage.removeItem("selected_payment_method");
          if (selectedMethod) localStorage.removeItem(`unlocked_links_${selectedMethod.name}`);
          setAccessGranted(false);
          setSelectedMethod(null);
          showToast("\u{1F44B} Logged out successfully.");
        };
        const handleSetUsername = (name) => {
          setUsernameState(name);
          setShowUsernameModal(false);
        };
        if (!username || showUsernameModal) {
          return /* @__PURE__ */ React.createElement(UsernameModal, { onSetUsername: handleSetUsername });
        }
        if (accessGranted && selectedMethod) {
          return /* @__PURE__ */ React.createElement(Dashboard, { paymentMethod: selectedMethod, onLogout: handleLogout });
        }
        return /* @__PURE__ */ React.createElement(React.Fragment, null, showAdmin && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative fade-up" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowAdmin(false), className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-times text-xl" })), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-gray-800 mb-4" }, "Admin Panel"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm mb-2" }, "Your Username:"), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-100 p-3 rounded-lg font-mono text-sm break-all mb-4" }, username), /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => navigator.clipboard.writeText(username),
            className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          },
          "Copy Username"
        ), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400 mt-3" }, "To approve a user, add their username to ", /* @__PURE__ */ React.createElement("code", null, "approved.json"), " with the list of unlocked links."))), /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center px-6 pt-20 pb-16 md:py-24" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl w-full glass-card p-8 md:p-12 fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center text-center" }, /* @__PURE__ */ React.createElement("div", { className: "relative mb-8 mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-indigo-400 shadow-xl overflow-hidden bg-gray-200" }, /* @__PURE__ */ React.createElement(
          "img",
          {
            src: PROFILE_IMAGE,
            alt: "T4RLADY",
            className: "w-full h-full object-cover object-[center_5%]"
          }
        )), /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-2 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse" }, "\u2708\uFE0F OFFICIAL")), /* @__PURE__ */ React.createElement("h1", { className: "text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600" }, "T4RLADY"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-lg mt-2" }, "Exclusive T4RLADY | Get full access | Chat with me")), /* @__PURE__ */ React.createElement("div", { className: "mt-12 border-t border-gray-200 pt-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-center text-gray-800 mb-6" }, "Choose Your Payment Method"), /* @__PURE__ */ React.createElement("p", { className: "text-center text-gray-600 mb-8" }, "Select how you'd like to pay. You'll unlock individual social links by sending proof of payment."), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-gift text-pink-500" }), " Gift Cards"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3" }, GIFT_CARDS.map((card) => /* @__PURE__ */ React.createElement(
          "div",
          {
            key: card.name,
            onClick: () => handlePayment({ name: "Gift Card", icon: "fas fa-gift", color: "text-pink-500", tag: "giftcard", amount: "12.99" }),
            className: "payment-card flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          },
          /* @__PURE__ */ React.createElement("i", { className: `${card.icon} text-2xl ${card.color} mb-1` }),
          /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-gray-800" }, card.name),
          /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-gray-500" }, "$", card.amount)
        )))), /* @__PURE__ */ React.createElement("div", { className: "mb-10" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-bitcoin text-orange-500" }), " Cryptocurrency"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-5" }, PAYMENT_METHODS.map((method) => /* @__PURE__ */ React.createElement(
          "div",
          {
            key: method.name,
            onClick: () => handlePayment(method),
            className: "payment-card flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
          },
          /* @__PURE__ */ React.createElement("i", { className: `${method.icon} text-5xl ${method.color} mb-3` }),
          /* @__PURE__ */ React.createElement("span", { className: "text-xl font-semibold text-gray-800" }, method.name),
          /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-500 mt-2" }, method.amount)
        ))))))), toastMessage && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-gray-200 text-gray-800 px-6 py-3 rounded-full z-50 flex items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("i", { className: "fas fa-check-circle text-green-500" }), " ", toastMessage));
      };
      ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
    }
  });
  require_app();
})();

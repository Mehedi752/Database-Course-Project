import { Send } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

// Website knowledge base for the chatbot
const KNOWLEDGE = [
  {
    keywords: ["home", "landing", "main page"],
    answer: "🏠 The Home page gives you an overview of BoiLagbe and quick access to all features. Click 'Home' in the navbar to return anytime."
  },
  {
    keywords: ["books", "browse", "library", "novel", "read"],
    answer: "📚 On the 'Browse Books' page, you can explore our collection, search, and filter books. Go to /books or click 'Browse Books' in the menu."
  },
  {
    keywords: ["add book", "add books", "contribute"],
    answer: "➕ You can add your own books to BoiLagbe from the 'Add Book' page. Use the dropdown in your profile and select 'Add Book'."
  },
  {
    keywords: ["my added books", "my books", "uploaded"],
    answer: "📚 The 'My Added Books' page lists all books you've contributed. Access it from your profile dropdown."
  },
  {
    keywords: ["cart", "shopping", "buy", "purchase"],
    answer: "🛒 The Cart page shows all books you want to buy. Click the cart icon in the navbar or go to /cart."
  },
  {
    keywords: ["order", "orders", "my orders", "purchase history"],
    answer: "🛍️ The 'My Orders' page lists your past purchases. Find it in your profile dropdown or at /my-orders."
  },
  {
    keywords: ["profile", "my profile", "account", "user info"],
    answer: "🙍‍♂️ The 'My Profile' page shows your info, status, and join date. Access it from the profile dropdown or at /my-profile."
  },
  {
    keywords: ["admin", "dashboard", "admin coupon", "manage"],
    answer: "🛡️ Admins can access the dashboard and manage coupons at /admin/coupons. Use the profile dropdown if you are an admin."
  },
  {
    keywords: ["coupon", "coupons", "discount", "offer"],
    answer: "🏷️ Check out our latest coupons and discounts on the Coupons page. Find them on the homepage or in special offers."
  },
  {
    keywords: ["chat", "support", "help", "contact", "message"],
    answer: "💬 You can chat with support or send feedback via the chat icon (bottom right) or the 'Contact' page."
  },
  {
    keywords: ["about", "about us", "info"],
    answer: "ℹ️ The About page explains BoiLagbe's mission and team. Visit /about for more details."
  },
  {
    keywords: ["feedback", "feedbacks", "suggestion"],
    answer: "📝 Share your thoughts on the Feedbacks page. Go to /feedbacks from the navbar."
  },
  {
    keywords: ["logout", "sign out", "exit"],
    answer: "🚪 You can log out from your profile dropdown menu."
  },
  {
    keywords: ["login", "sign in", "register", "signup"],
    answer: "🔑 Login or register from the 'Login' button in the navbar. New users can sign up easily!"
  },
];



const FREQUENT_QUESTIONS = [
  {
    q: "How do I browse books?",
    a: "You can browse all available books by clicking on 'Browse Books' in the navbar or visiting the /books page."
  },
  {
    q: "How do I add a new book?",
    a: "To add a new book, go to your profile dropdown and select 'Add Book'. Fill out the form and submit."
  },
  {
    q: "Where can I find my orders?",
    a: "Your orders are listed on the 'My Orders' page, accessible from your profile dropdown or at /my-orders."
  },
  {
    q: "How do I use a coupon?",
    a: "Apply your coupon code at checkout in the cart page to get a discount on your order."
  },
  {
    q: "How do I contact support?",
    a: "You can contact support using this chatbot or by visiting the 'Contact' page from the navbar."
  }
];

function getBotReply(input) {
  const text = input.toLowerCase();
  for (const item of KNOWLEDGE) {
    if (item.keywords.some(k => text.includes(k))) {
      return item.answer;
    }
  }
  // Fallback
  return "🤖 Sorry, I couldn't find an answer for that. Try asking about books, your profile, orders, coupons, or use the menu for navigation.";
}

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm your BoiLagbe assistant. Ask me anything about the website or select a quick question below." }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "bot", text: getBotReply(input) }]);
    }, 500);
    setInput("");
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
    setTimeout(() => {
      handleSend({ preventDefault: () => {} });
    }, 100);
  };

  const handleFrequent = (fq) => {
    setMessages(prev => [
      ...prev,
      { from: "user", text: fq.q },
      { from: "bot", text: fq.a }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div
          className="w-96 max-w-full bg-white rounded-3xl shadow-2xl border border-indigo-200 flex flex-col mb-3 animate-fade-in"
          style={{ height: 520, minHeight: 420 }}
        >
          {/* Header (always visible) */}
          <div className="bg-gradient-to-r from-indigo-800 to-blue-600 px-6 py-4 flex items-center justify-between border-b border-indigo-100 flex-shrink-0 rounded-t-3xl">
            <span className="text-white font-bold text-lg flex items-center gap-2 tracking-wide">
              <span className="text-2xl">🤖</span> BoiLagbe Assistant
            </span>
            <button
              className="text-white text-2xl font-bold hover:text-red-200 transition"
              onClick={() => setOpen(false)}
              title="Close"
            >×</button>
          </div>
          {/* Chat area (scrollable only here) */}
          <div className="flex-1 px-5 py-4 space-y-2 overflow-y-auto bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-2 max-w-[80%]">
                  {msg.from === "bot" && (
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xl border border-indigo-200">
                      🤖
                    </span>
                  )}
                  <div className={`px-4 py-2 rounded-2xl text-base shadow-sm ${msg.from === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white text-indigo-700 border border-indigo-100 rounded-bl-none"
                  }`}>
                    {msg.text}
                  </div>
                  {msg.from === "user" && (
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xl border border-blue-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" fill="#6366f1" />
                        <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="Arial" dy=".3em">Me</text>
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            ))}
            {/* FAQ inside chat */}
            <div className="flex flex-col items-start gap-2 mt-2">
              <div className="text-xs text-indigo-500 font-semibold mb-1">Frequent Questions:</div>
              {FREQUENT_QUESTIONS.map((fq, i) => (
                <button
                  key={i}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100 transition mb-1"
                  onClick={() => handleFrequent(fq)}
                  type="button"
                >
                  {fq.q}
                </button>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
          {/* Input area */}
          <div className="px-5 pb-4 pt-2 bg-white border-t border-indigo-100 flex-shrink-0 rounded-b-3xl">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base bg-indigo-50"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus={open}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:from-indigo-800 hover:to-blue-700 transition flex items-center gap-1"
              >
               <Send className="w-5 h-5" />
               
              </button>
            </form>
          </div>
        </div>
      )}
      <button
        className="bg-gradient-to-r from-indigo-800 to-blue-600 text-white rounded-full shadow-xl w-16 h-16 flex items-center justify-center text-3xl hover:scale-110 transition"
        title="Chat with BoiLagbe Assistant"
        onClick={() => setOpen(o => !o)}
      >
        🤖
      </button>
    </div>
  );
};

export default ChatbotWidget;

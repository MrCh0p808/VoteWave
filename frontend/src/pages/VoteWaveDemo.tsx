import React, { useEffect, useRef, useState } from "react";
import {
  Sun,
  Moon,
  Bell,
  Share2,
  PlusCircle,
  Trash2,
  Mic,
  Smile,
  Home,
  BarChart2,
  Users,
  SlidersHorizontal,
  MessageCircle,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";

/**
 * VoteWaveDemo.tsx
 * - A standalone demo page implementing requested UX and features.
 *
 * Notes:
 * - Ensure Tailwind is loaded and index.css includes:
 *     @tailwind base;
 *     @tailwind components;
 *     @tailwind utilities;
 * - Ensure lucide-react is installed in frontend dependencies.
 */

// small helper to generate fake polls for infinite scroll
const makeFakePoll = (i: number) => {
  const samples = [
    "Should remote work be the new normal?",
    "Do you support free public transport in cities?",
    "Is pineapple allowed on pizza?",
    "Will AI replace routine jobs in 10 years?",
    "Should university be free?",
  ];
  const q = samples[i % samples.length] + ` (sample ${i})`;
  return {
    id: `poll-${Date.now()}-${i}`,
    author: `User${(i % 50) + 1}`,
    question: q,
    createdAt: new Date().toLocaleString(),
    cover: null as string | null,
    options: ["VoteUp", "VoteDown", "Abstain"],
    counts: [Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), Math.floor(Math.random() * 200)],
    comments: [
      { user: "Ava", text: "Interesting!" },
      { user: "Ben", text: "I disagree" },
    ],
    visibility: "public" as "public" | "votebuddies" | "private",
  };
};

// curated country codes (extendable)
const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+30", flag: "🇬🇷", name: "Greece" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  // ...add more as needed
];

// small helper: friendly time label
const timeLabel = (d: Date) => d.toLocaleString();

// Local "database" of usernames (simulate)
const EXISTING_USERNAMES = new Set(["JohnDoe", "JaneDoe", "Pet_Lover", "Urban_Planner"]);

type PollType = ReturnType<typeof makeFakePoll>;

export default function VoteWaveDemo() {
  // theme
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // notifications
  const [notifications, setNotifications] = useState([
    { id: "n1", text: "Ava commented on your poll", read: false, time: Date.now() - 1000 * 60 * 60 },
    { id: "n2", text: "Your VoteBooth was created", read: false, time: Date.now() - 1000 * 60 * 60 * 2 },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);

  // page tabs
  const [activeTab, setActiveTab] = useState<"home" | "dashboard" | "votebooth" | "profile" | "settings">("home");

  // feed (infinite scroll)
  const [polls, setPolls] = useState<PollType[]>(() => Array.from({ length: 8 }).map((_, i) => makeFakePoll(i)));
  const [loadingMore, setLoadingMore] = useState(false);

  // create poll form
  const [createOpen, setCreateOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollDescription, setPollDescription] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["VoteUp", "VoteDown", "Abstain"]);
  const [pollStart, setPollStart] = useState<string>(new Date().toISOString().slice(0, 16));
  const [pollEnd, setPollEnd] = useState<string>(new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16)); // +24h
  const [pollCover, setPollCover] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const feedAnchorRef = useRef<HTMLDivElement | null>(null);

  // user (profile)
  const [username, setUsername] = useState("DemoUser");
  const [usernameChangedAt, setUsernameChangedAt] = useState<number | null>(null);
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [emailVisibility, setEmailVisibility] = useState<"public" | "votebuddies" | "private">("public");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneVisibility, setPhoneVisibility] = useState<"public" | "votebuddies" | "private">("public");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // user posts
  const [myPosts, setMyPosts] = useState<PollType[]>([]);

  // VoteBooths: group-like objects
  const [voteBooths, setVoteBooths] = useState<any[]>([]);

  // chat for current booth (simulate)
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const [boothMessages, setBoothMessages] = useState<Record<string, any[]>>({});

  // dashboard filters
  const [analyticsCategory, setAnalyticsCategory] = useState<"personal" | "global">("personal");
  const [analyticsTimeFilter, setAnalyticsTimeFilter] = useState<"7d" | "30d" | "90d">("7d");

  // State for VoteBooth form
  const [createBoothOpen, setCreateBoothOpen] = useState(false);
  const [boothName, setBoothName] = useState("");
  const [boothDesc, setBoothDesc] = useState("");
  const [boothMembers, setBoothMembers] = useState("");
  const [boothStart, setBoothStart] = useState(new Date().toISOString().slice(0, 16));
  const [boothEnd, setBoothEnd] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16));
  const [boothCover, setBoothCover] = useState<File | null>(null);

  // Submit handler
  const submitVoteBooth = () => {
    if (!boothName) {
      alert("Please enter a VoteBooth name");
      return;
    }
    createVoteBooth({
      name: boothName,
      description: boothDesc,
      members: boothMembers.split(",").map((m) => m.trim()),
      start: boothStart,
      end: boothEnd,
      cover: boothCover,
      poll: null,
    });
    // reset + close form
    setCreateBoothOpen(false);
    setBoothName("");
    setBoothDesc("");
    setBoothMembers("");
    setBoothStart(new Date().toISOString().slice(0, 16));
    setBoothEnd(new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16));
    setBoothCover(null);
  };


  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!feedAnchorRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingMore) {
            loadMore();
          }
        });
      },
      { root: null, rootMargin: "400px", threshold: 0.1 }
    );
    io.observe(feedAnchorRef.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedAnchorRef.current, loadingMore]);

  const loadMore = async () => {
    setLoadingMore(true);
    // simulate network
    await new Promise((r) => setTimeout(r, 800));
    setPolls((p) => [...p, ...Array.from({ length: 6 }).map((_, i) => makeFakePoll(p.length + i))]);
    setLoadingMore(false);
  };

  // helpers
  const toggleTheme = () => setDarkMode((d) => !d);

  // notifications handlers
  const markAllRead = () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  const toggleNotif = () => setNotifOpen((o) => !o);

  // create poll handlers
  const addPollOption = (opt = "") => setPollOptions((arr) => [...arr, opt || `Option ${arr.length + 1}`]);
  const removePollOption = (index: number) =>
    setPollOptions((arr) => arr.filter((_, i) => i !== index));

  const onCoverSelected = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPollCover(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submitPoll = (inBoothId?: string) => {
    if (!pollQuestion.trim()) {
      alert("Please add a poll question.");
      return;
    }
    // create poll object
    const newPoll: PollType = {
      ...makeFakePoll(Math.floor(Math.random() * 100000)),
      question: pollQuestion,
      cover: pollCover,
      options: pollOptions.slice(),
      counts: pollOptions.map(() => 0),
      comments: [],
      visibility: "public",
      author: username,
      createdAt: timeLabel(new Date()),
    } as PollType;

    // if creating inside a booth, pin it there
    if (inBoothId) {
      setVoteBooths((vbs) =>
        vbs.map((b) => (b.id === inBoothId ? { ...b, pinnedPoll: newPoll } : b))
      );
      setBoothMessages((bm) => ({ ...bm, [inBoothId]: (bm[inBoothId] || []).concat({ user: username, text: `Pinned a poll: ${pollQuestion}`, time: Date.now() }) }));
    } else {
      // push into feed and myPosts
      setPolls((ps) => [newPoll, ...ps]);
      setMyPosts((mp) => [newPoll, ...mp]);
    }

    // reset form
    setPollQuestion("");
    setPollDescription("");
    setPollOptions(["VoteUp", "VoteDown", "Abstain"]);
    setPollCover(null);
    setCreateOpen(false);
  };

  // voting actions
  const castVote = (pollId: string, optIdx: number) => {
    setPolls((ps) =>
      ps.map((p) =>
        p.id === pollId
          ? {
              ...p,
              counts: p.counts.map((c, i) => (i === optIdx ? c + 1 : c)),
            }
          : p
      )
    );
  };

  // Profile: change username (once per 6 months simulation)
  const changeUsername = (newName: string) => {
    if (!newName.trim()) return alert("Username cannot be empty");
    if (EXISTING_USERNAMES.has(newName)) return alert("This username already exists!");
    // enforce 6 months cooldown if changed before
    if (usernameChangedAt && Date.now() - usernameChangedAt < 1000 * 60 * 60 * 24 * 30 * 6) {
      return alert("Username can be changed once every 6 months.");
    }
    EXISTING_USERNAMES.add(newName);
    setUsername(newName);
    setUsernameChangedAt(Date.now());
    alert("Username changed successfully");
  };

  // VoteBooth creation
  const createVoteBooth = (vals: { name: string; visibility: string; start: string; end: string; poll?: any }) => {
    if (!vals.name.trim()) return alert("Booth name required");
    if (!vals.start || !vals.end) return alert("Please set voting window");
    const id = `vb-${Date.now()}`;
    const newBooth = {
      id,
      name: vals.name,
      visibility: vals.visibility,
      start: vals.start,
      end: vals.end,
      owner: username,
      pinnedPoll: vals.poll || null,
      members: [username],
    };
    setVoteBooths((b) => [newBooth, ...b]);
    setSelectedBooth(id);
    // create empty messages container
    setBoothMessages((bm) => ({ ...bm, [id]: [{ user: "system", text: "VoteBooth created", time: Date.now() }] }));
  };

  // delete booth (only owner)
  const deleteBooth = (id: string) => {
    const b = voteBooths.find((x) => x.id === id);
    if (!b) return;
    if (b.owner !== username) return alert("Only owner can delete booth");
    if (!confirm("Delete this VoteBooth? This action cannot be undone.")) return;
    setVoteBooths((v) => v.filter((x) => x.id !== id));
    const bm = { ...boothMessages };
    delete bm[id];
    setBoothMessages(bm);
    if (selectedBooth === id) setSelectedBooth(null);
  };

  // send message to booth
  const sendBoothMessage = (id: string, text: string, extra?: any) => {
    if (!text?.trim() && !extra) return;
    setBoothMessages((b) => ({ ...b, [id]: (b[id] || []).concat({ user: username, text, time: Date.now(), extra }) }));
  };

  // simple emoji picker (few emojis)
  const EMOJIS = ["😀", "😂", "😍", "👍", "🔥", "🎉", "😢"];

  // UI helpers for colors based on theme
  const bg = darkMode ? "bg-gray-900" : "bg-white";
  const cardBg = darkMode ? "bg-gray-800" : "bg-gray-50";
  const text = darkMode ? "text-gray-100" : "text-gray-900";
  const subText = darkMode ? "text-gray-300" : "text-gray-600";
  const accent = darkMode ? "text-indigo-400" : "text-indigo-600";
  const subtle = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`${bg} ${text} flex flex-col min-h-screen transition-colors duration-300 font-sans`}>
      {/* header */}
      <header className={`sticky top-0 z-40 ${cardBg} ${subtle} border-b p-3 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          {/* icon */}
          <div className="rounded-md p-2 bg-gradient-to-tr from-indigo-500 to-sky-400 text-white shadow-md">
            <Home className="w-6 h-6" />
          </div>
          {/* title (techy font if loaded in index.html) */}
          <div className="flex flex-col leading-tight">
            <span className={`text-2xl font-extrabold tracking-tight`} style={{ fontFamily: "'Rubik Vinyl', system-ui, -apple-system" }}>
              VoteWave
            </span>
            <span className={`text-xs ${subText}`}>Social awareness · Empowering voice</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* notification */}
          <div className="relative">
            <button onClick={toggleNotif} className={`p-2 rounded-full hover:opacity-90 ${cardBg}`}>
              <Bell className="w-5 h-5" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">●</span>
              )}
            </button>

            {/* dropdown */}
            {notifOpen && (
              <div className={`absolute right-0 mt-2 w-80 ${cardBg} border ${subtle} rounded-xl shadow-xl p-3 animate-[fadeIn_120ms_ease-in] z-50`}>
                <div className="flex justify-between items-center mb-2">
                  <strong>Notifications</strong>
                  <div className="flex items-center space-x-2">
                    <button onClick={markAllRead} className="text-sm px-2 py-1 rounded hover:bg-gray-700">Mark all as read</button>
                    <button onClick={() => alert("Show all -> (not implemented)")} className="text-sm px-2 py-1 rounded hover:bg-gray-700">Show all</button>
                    <button onClick={() => setNotifOpen(false)} className="p-1 rounded hover:bg-gray-700"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notifications.length === 0 && <div className={subText}>No notifications</div>}
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-2 rounded-lg ${n.read ? "opacity-70" : "bg-indigo-600/5"} hover:bg-indigo-500/5 cursor-pointer`}>
                      <div className="flex justify-between items-start">
                        <div className="text-sm">{n.text}</div>
                        <div className="text-xs text-gray-400">{new Date(n.time).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* theme toggle */}
          <button onClick={() => setDarkMode((d) => !d)} className="p-2 rounded-full hover:bg-gray-700">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* small profile / share user id */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">{username[0]?.toUpperCase() || "D"}</div>
            <div className="flex flex-col">
              <div className="text-sm font-medium">{username}</div>
              <div className="text-xs text-gray-400">ID: uid-demo-001 <button onClick={() => { navigator.clipboard?.writeText("uid-demo-001"); alert("User ID copied"); }} className="ml-2 text-xs text-indigo-400 hover:underline">Share</button></div>
            </div>
          </div>
        </div>
      </header>

      {/* tabs */}
      <nav className={`${cardBg} ${subtle} border-b flex items-center p-4 gap-4 sticky top-[60px] z-30`}>
        <button onClick={() => setActiveTab("home")} className={`flex items-center gap-2 px-3 py-2 rounded-full ${activeTab === "home" ? "bg-indigo-600 text-white" : "hover:bg-gray-700/40"}`}>
          <Home className="w-4 h-4" /> <span className="hidden md:inline">Home</span>
        </button>
        <button onClick={() => setActiveTab("dashboard")} className={`flex items-center gap-2 px-3 py-2 rounded-full ${activeTab === "dashboard" ? "bg-indigo-600 text-white" : "hover:bg-gray-700/40"}`}>
          <BarChart2 className="w-4 h-4" /> <span className="hidden md:inline">Dashboard</span>
        </button>
        <button onClick={() => setActiveTab("votebooth")} className={`flex items-center gap-2 px-3 py-2 rounded-full ${activeTab === "votebooth" ? "bg-indigo-600 text-white" : "hover:bg-gray-700/40"}`}>
          <Users className="w-4 h-4" /> <span className="hidden md:inline">VoteBooth</span>
        </button>
        <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-2 px-3 py-2 rounded-full ${activeTab === "profile" ? "bg-indigo-600 text-white" : "hover:bg-gray-700/40"}`}>
          <MessageCircle className="w-4 h-4" /> <span className="hidden md:inline">Profile</span>
        </button>
        <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-2 px-3 py-2 rounded-full ${activeTab === "settings" ? "bg-indigo-600 text-white" : "hover:bg-gray-700/40"}`}>
          <SlidersHorizontal className="w-4 h-4" /> <span className="hidden md:inline">Settings</span>
        </button>
      </nav>

      {/* main content */}
      <main className="flex-1 overflow-y-auto max-w-4xl mx-auto p-4 space-y-6">
        {/* HOME */}
        {activeTab === "home" && (
          <section className="space-y-6">
            {/* Create Poll + Stories inline */}
            <div className={`flex items-center gap-4 ${cardBg} ${subtle} p-4 rounded-2xl`}>
              {/* Create Poll button + animated expand */}
              <div className="flex-shrink-0">
                <button onClick={() => setCreateOpen((s) => !s)} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-sky-400 text-white px-4 py-2 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-transform">
                  <PlusCircle className="w-5 h-5" /> Create Poll
                </button>
              </div>
            
              {/* stories (poll buddies) */}
              <div className="flex gap-4 items-center overflow-hidden relative">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center min-w-[68px]">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700/50 p-2 rounded-full z-10"
                          onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}>{"<"}</button>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 p-1 shadow-md">
                      <div className={`${cardBg} w-full h-full rounded-full flex items-center justify-center text-sm font-bold`}>{String.fromCharCode(65 + (i % 26))}</div>
                    </div>
                    <div className="text-xs mt-1 text-gray-400">User{1 + i}</div>
                      <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700/50 p-2 rounded-full z-10"
                          onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}>{">"}</button>
                      </div>
                      ))}
                  </div>
                </div>
              
            {/* Create poll form */}
            <div className={`overflow-hidden transition-all duration-300 ${createOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className={`${cardBg} ${subtle} p-4 rounded-2xl shadow-md mt-2`}>
                <div className="flex flex-col gap-3">
                  <input value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} placeholder="Write your poll question..." className={`w-full p-3 rounded border ${subtle} ${text} ${cardBg}`} />
                  <textarea value={pollDescription} onChange={(e) => setPollDescription(e.target.value)} placeholder="Add a description (optional)" className={`w-full p-3 rounded border ${subtle} ${cardBg} ${text}`} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">Options</label>
                        <button onClick={() => addPollOption()} className="text-sm text-indigo-400">+ Add</button>
                      </div>
                      <div className="space-y-2">
                        {pollOptions.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input value={opt} onChange={(e) => setPollOptions((arr) => arr.map((v, i) => (i === idx ? e.target.value : v)))} className={`flex-1 p-2 rounded ${cardBg} border ${subtle}`} />
                            {idx > 2 && (
                              <button onClick={() => removePollOption(idx)} className="p-2 rounded-full hover:bg-red-600/10"><Trash2 className="w-4 h-4" /></button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-medium">Voting Window</label>
                      <div className="flex flex-col gap-2 mt-2">
                        <input type="datetime-local" value={pollStart} onChange={(e) => setPollStart(e.target.value)} className={`p-2 rounded ${cardBg} border ${subtle}`} />
                        <input type="datetime-local" value={pollEnd} onChange={(e) => setPollEnd(e.target.value)} className={`p-2 rounded ${cardBg} border ${subtle}`} />
                      </div>

                      <label className="font-medium mt-3 block">Cover Image</label>
                      <div className="flex items-center gap-2 mt-2">
                        <input ref={coverInputRef} onChange={(e) => onCoverSelected(e.target.files?.[0])} type="file" accept="image/*" />
                        {pollCover && <img src={pollCover} alt="cover-preview" className="w-20 h-12 object-cover rounded" />}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">{pollQuestion ? "Preview will appear in feed" : "Your poll will appear at top of feed"}</div>
                    <div className="flex items-center gap-2">
                      <select className={`p-2 rounded ${cardBg} border ${subtle}`} onChange={(e) => {}}>
                        <option value="public">Public</option>
                        <option value="votebuddies">VoteBuddies</option>
                        <option value="private">Private</option>
                      </select>
                      <button onClick={() => submitPoll()} className="bg-indigo-500 px-4 py-2 rounded text-white">Post</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed (infinite scroll) */}
            <div className="space-y-4 mt-2">
              {polls.map((p) => (
                <article key={p.id} className={`${cardBg} ${subtle} p-4 rounded-2xl shadow-md`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">{p.author?.[0]?.toUpperCase()}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="">{p.author}</strong>
                          <span className="text-xs text-gray-400">{p.createdAt}</span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold">{p.question}</h3>
                        {p.cover && <img src={p.cover} alt="cover" className="mt-2 rounded max-h-48 object-cover w-full" />}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => { navigator.clipboard?.writeText(p.id); alert("Poll ID copied"); }} className="text-xs px-2 py-1 rounded bg-gray-700/40">Share ID</button>
                      <button onClick={() => alert("Share to timeline (not implemented)")} className="p-2 rounded hover:bg-gray-700/30"><Share2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      {p.options.map((o: string, idx: number) => {
                        const total = p.counts.reduce((a: number, b: number) => a + b, 0) || 1;
                        const pct = Math.round((p.counts[idx] / total) * 100);
                        return (
                          <div key={idx}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <div className="font-medium">{o}</div>
                              <div className="text-xs text-gray-400">{p.counts[idx]} · {pct}%</div>
                            </div>
                            <div className="relative bg-gray-700 rounded-full h-8 overflow-hidden">
                              <div style={{ width: `${pct}%` }} className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full transition-all" />
                              <div className="relative flex justify-between items-center px-3 h-8">
                                <button onClick={() => castVote(p.id, idx)} className="text-sm px-3 py-1 rounded-full hover:bg-indigo-500/20">Vote</button>
                                <div className="text-xs text-gray-400 hidden md:block">{pct}%</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">Comments</div>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {p.comments.map((c: any, i: number) => (
                          <div key={i} className="p-2 rounded bg-gray-700/40">
                            <div className="text-sm"><strong>{c.user}:</strong> {c.text}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-2">
                        <input placeholder="Add a comment..." className={`flex-1 p-2 rounded ${cardBg} border ${subtle}`} />
                        <button className="px-3 py-2 rounded bg-indigo-500 text-white">Send</button>
                      </div>

                      <div className="text-xs text-gray-400 mt-2">Visibility: {p.visibility}</div>
                    </div>
                  </div>
                </article>
              ))}

              <div ref={feedAnchorRef} className="h-12 flex items-center justify-center">
                {loadingMore ? <div className="text-sm text-gray-400">Loading more…</div> : <div className="text-sm text-gray-400">Scroll to load more</div>}
              </div>
            </div>
          </section>
        )}
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <section className="space-y-4">
            {/* Dashboard Header + Filters */}
            <div className={`${cardBg} ${subtle} p-4 rounded-2xl flex justify-between items-center`}>
              <div>
                <h2 className="text-xl font-bold">Analytics</h2>
                <div className="text-sm text-gray-400">Overview ({analyticsTimeFilter})</div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={analyticsCategory}
                  onChange={(e) => setAnalyticsCategory(e.target.value as any)}
                  className={`p-2 rounded ${cardBg} border ${subtle}`}
                >
                  <option value="personal">Personal Contribution</option>
                  <option value="global">Global Trend</option>
                </select>
                <select
                  value={analyticsTimeFilter}
                  onChange={(e) => setAnalyticsTimeFilter(e.target.value as any)}
                  className={`p-2 rounded ${cardBg} border ${subtle}`}
                >
                  <option value="1d">1d</option>
                  <option value="7d">7d</option>
                  <option value="30d">30d</option>
                  <option value="90d">90d</option>
                  <option value="180d">180d</option>
                  <option value="1y">1y</option>
                </select>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Voting Trends */}
              <div className={`${cardBg} ${subtle} p-4 rounded-2xl`}>
                <h3 className="font-semibold">Vote Trends (Last {analyticsTimeFilter})</h3>
                <div className="mt-2 h-36 w-full grid grid-cols-6 gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-${Math.floor(Math.random() * 20 + 20)} bg-gradient-to-b from-indigo-500 to-sky-400 rounded`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1">Shows daily vote distribution</div>
              </div>

              {/* Top Polls */}
              <div className={`${cardBg} ${subtle} p-4 rounded-2xl`}>
                <h3 className="font-semibold">Top Polls</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {polls.slice(0, 5).map((p) => (
                    <li key={p.id} className="flex justify-between">
                      <span
                        className="cursor-pointer text-indigo-500 hover:underline"
                        onClick={() => alert(`Redirect to poll: ${p.id}`)}
                      >
                        {p.question}
                      </span>
                      <span className="text-gray-400">
                        {p.counts.reduce((a, b) => a + b, 0)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engagement Metrics */}
              <div className={`${cardBg} ${subtle} p-4 rounded-2xl`}>
                <h3 className="font-semibold">Engagement</h3>
                <div className="text-sm text-gray-400 mt-2">Total Votes</div>
                <div className="text-2xl font-bold mt-2">
                  {analyticsCategory === "personal" ? "1,254" : "124,500"}
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 h-20 bg-gradient-to-tr from-green-400 to-emerald-600 rounded" />
                  <div className="flex-1 h-20 bg-gradient-to-tr from-pink-400 to-rose-600 rounded" />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Breakdown of upvotes vs downvotes
                </div>
              </div>
            </div>
          </section>
        )}
        {/* VOTEBOOTH */}
        {activeTab === "votebooth" && (
          <section className="space-y-4">
            <div className={`${cardBg} ${subtle} p-4 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between`}>
              <div>
                <h2 className="text-xl font-bold">VoteBooth</h2>
                <div className="text-sm text-gray-400">Private group polling spaces with chat & pinned polls</div>
              </div>
              <div className="mt-3 md:mt-0 flex gap-2">
                <button
                  onClick={() => setCreateBoothOpen(true)}
                  className="bg-indigo-500 px-4 py-2 rounded text-white flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Create VoteBooth
                </button>
              </div>
            </div>

            {/* Create Booth Form */}
            {createBoothOpen && (
              <div className={`${cardBg} ${subtle} p-4 rounded-xl space-y-3`}>
                <input
                  placeholder="VoteBooth Name"
                  value={boothName}
                  onChange={(e) => setBoothName(e.target.value)}
                  className={`w-full p-2 rounded ${cardBg} border ${subtle}`}
                />
                <textarea
                  placeholder="VoteBooth Description"
                  value={boothDesc}
                  onChange={(e) => setBoothDesc(e.target.value)}
                  className={`w-full p-2 rounded ${cardBg} border ${subtle}`}
                />
                <input
                  placeholder="Add Members (search by username)"
                  value={boothMembers}
                  onChange={(e) => setBoothMembers(e.target.value)}
                  className={`w-full p-2 rounded ${cardBg} border ${subtle}`}
                />
                <div className="flex gap-2">
                  <input type="datetime-local" value={boothStart} onChange={(e) => setBoothStart(e.target.value)} className={`flex-1 p-2 rounded ${cardBg} border ${subtle}`} />
                  <input type="datetime-local" value={boothEnd} onChange={(e) => setBoothEnd(e.target.value)} className={`flex-1 p-2 rounded ${cardBg} border ${subtle}`} />
                </div>
                <input
                  type="file"
                  onChange={(e) => setBoothCover(e.target.files?.[0] || null)}
                  className="text-sm"
                />
                <button
                  onClick={submitVoteBooth}
                  className="bg-green-500 px-4 py-2 rounded text-white"
                >
                  Submit VoteBooth
                </button>
              </div>
            )}

            {/* list booths */}
            <div className="space-y-3">
              {voteBooths.length === 0 && (
                <div className="text-gray-400">No VoteBooths yet — create one to get started.</div>
              )}
              {voteBooths.map((b) => (
                <div key={b.id} className={`${cardBg} ${subtle} p-4 rounded-xl`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong>{b.name}</strong>
                        <span className="text-xs text-gray-400">by {b.owner}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Voting window: {b.start} → {b.end}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.owner === username && (
                        <button onClick={() => deleteBooth(b.id)} className="text-red-500 flex items-center gap-1">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      )}
                      <button onClick={() => setSelectedBooth(b.id)} className="text-sm px-2 py-1 rounded bg-indigo-500 text-white">Open</button>
                    </div>
                  </div>

                  {/* pinned poll */}
                  {b.pinnedPoll && (
                    <div className="mt-3 p-3 rounded-lg bg-gray-700">
                      <div className="font-semibold">{b.pinnedPoll.question}</div>
                      <div className="text-xs text-gray-400 mt-1">Pinned poll</div>
                    </div>
                  )}

                  {/* chat */}
                  <div className="mt-3">
                    <div className="max-h-48 overflow-y-auto rounded p-2 bg-gray-800/40">
                      {((boothMessages[b.id] || []) as any[]).map((m, i) => (
                        <div key={i} className="py-1">
                          <div className="text-xs text-gray-400">{m.user} · {new Date(m.time).toLocaleTimeString()}</div>
                          <div className="text-sm">{m.text}</div>
                        </div>
                      ))}
                      {(!boothMessages[b.id] || boothMessages[b.id].length === 0) && <div className="text-gray-400">No messages yet</div>}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <input placeholder="Message..." className={`flex-1 p-2 rounded ${cardBg} border ${subtle}`} id={`msg-${b.id}`} />
                      <button onClick={() => {
                        const el = document.getElementById(`msg-${b.id}`) as HTMLInputElement | null;
                        if (!el) return;
                        sendBoothMessage(b.id, el.value);
                        el.value = "";
                      }} className="px-3 py-2 rounded bg-indigo-500 text-white">Send</button>
                      <button onClick={() => alert("Emoji picker (demo)")} className="p-2 rounded bg-gray-700"><Smile className="w-4 h-4" /></button>
                      <button onClick={() => alert("Voice note placeholder (demo)")} className="p-2 rounded bg-gray-700"><Mic className="w-4 h-4" /></button>
                      <button onClick={() => alert("Upload image (demo)")} className="p-2 rounded bg-gray-700"><ImageIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* PROFILE */}
        {activeTab === "profile" && (
          <section className="space-y-4">
            <div className={`${cardBg} ${subtle} p-4 rounded-2xl flex flex-col md:flex-row gap-4`}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-28 h-28 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-2xl`}>
                  {profilePic ? <img src={profilePic} alt="dp" className="w-full h-full object-cover" /> : username[0]?.toUpperCase()}
                </div>
                <input type="file" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => setProfilePic(r.result as string);
                  r.readAsDataURL(f);
                }} />
                <button onClick={() => alert("Upload picture (demo)")} className="text-indigo-400">Upload</button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex gap-2 items-center">
                  <input placeholder="Username" defaultValue={username} onBlur={(e) => changeUsername(e.target.value)} className={`p-2 rounded ${cardBg} border ${subtle} flex-1`} />
                  <div className="text-sm text-gray-400">Following: <strong>42</strong> · Polls: <strong>{myPosts.length}</strong></div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className={`w-full p-2 rounded ${cardBg} border ${subtle}`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="text-sm text-gray-400">Email (required)</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={`p-2 rounded ${cardBg} border ${subtle} w-full`} />
                    <select value={emailVisibility} onChange={(e) => setEmailVisibility(e.target.value as any)} className={`mt-1 p-2 rounded ${cardBg} border ${subtle} w-full`}>
                      <option value="public">Public</option>
                      <option value="votebuddies">VoteBuddies</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Phone</label>
                    <div className="flex gap-2">
                      <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className={`p-2 rounded ${cardBg} border ${subtle}`}>
                        {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                      </select>
                      <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="9876543210" className={`p-2 rounded ${cardBg} border ${subtle} flex-1`} />
                    </div>
                    <select value={phoneVisibility} onChange={(e) => setPhoneVisibility(e.target.value as any)} className={`mt-1 p-2 rounded ${cardBg} border ${subtle} w-full`}>
                      <option value="public">Public</option>
                      <option value="votebuddies">VoteBuddies</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Gender</label>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => setGender("male")} className={`px-3 py-1 rounded ${gender === "male" ? "bg-indigo-500 text-white" : `${cardBg} border ${subtle}`}`}>Male</button>
                      <button onClick={() => setGender("female")} className={`px-3 py-1 rounded ${gender === "female" ? "bg-pink-500 text-white" : `${cardBg} border ${subtle}`}`}>Female</button>
                      <button onClick={() => setGender("other")} className={`px-3 py-1 rounded ${gender === "other" ? "bg-gray-500 text-white" : `${cardBg} border ${subtle}`}`}>Other</button>
                    </div>
                  </div>
                </div>

                <div>
                  <button onClick={() => alert("Save profile (demo)")} className="bg-indigo-500 px-4 py-2 rounded text-white">Save Profile</button>
                </div>
              </div>
            </div>

            {/* my posts */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold">My Posts</h3>
              {myPosts.length === 0 && <div className="text-gray-400">You haven't posted yet.</div>}
              {myPosts.map((p) => (
                <div key={p.id} className={`${cardBg} ${subtle} p-4 rounded-xl`}>
                  <div className="flex justify-between">
                    <div><strong>{p.question}</strong><div className="text-xs text-gray-400">{p.createdAt}</div></div>
                    <div><button onClick={() => alert("View analytics (demo)")} className="text-indigo-400">Analytics</button></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <section className="space-y-4">
            <div className={`${cardBg} ${subtle} p-4 rounded-2xl`}>
              <h3 className="text-xl font-bold">Account & Privacy</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex justify-between items-center"><span>Two-factor authentication</span><button className="px-3 py-1 rounded bg-indigo-500 text-white">Enable</button></li>
                <li className="flex justify-between items-center"><span>Public profile</span><input type="checkbox" /></li>
                <li className="flex justify-between items-center"><span>Data export</span><button className="px-3 py-1 rounded border">Request</button></li>
                <li className="flex justify-between items-center text-red-500"><span>Delete account</span><button className="px-3 py-1 rounded border" onClick={() => { if (confirm("Delete account?")) alert("Deleted (demo)"); }}>Delete</button></li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const IMAGES = {
  post1: "https://cdn.poehali.dev/projects/92ba1aa9-3d99-4fd7-814f-f4155b58e9ee/files/861c7655-001d-4a81-ad7a-39133895e6f8.jpg",
  post2: "https://cdn.poehali.dev/projects/92ba1aa9-3d99-4fd7-814f-f4155b58e9ee/files/9c5e64b5-a020-4a4b-b6f7-a07580602613.jpg",
  post3: "https://cdn.poehali.dev/projects/92ba1aa9-3d99-4fd7-814f-f4155b58e9ee/files/7369a969-4f86-446a-9d61-77b6749a9dbc.jpg",
  avatar1: "https://cdn.poehali.dev/projects/92ba1aa9-3d99-4fd7-814f-f4155b58e9ee/files/913da405-cd49-4702-b280-3f83db018f06.jpg",
  avatar2: "https://cdn.poehali.dev/projects/92ba1aa9-3d99-4fd7-814f-f4155b58e9ee/files/02233034-2f13-416f-9067-ec50548785e4.jpg",
};

const POSTS = [
  {
    id: 1,
    user: { name: "Алина Морозова", username: "alina_m", avatar: IMAGES.avatar1, verified: true },
    image: IMAGES.post1,
    caption: "Закат над городом — это всегда магия ✨ Не устаю восхищаться",
    likes: 1247,
    comments: 84,
    time: "2 ч назад",
    liked: false,
    saved: false,
  },
  {
    id: 2,
    user: { name: "Дмитрий Волков", username: "dima_wolf", avatar: IMAGES.avatar2, verified: false },
    image: IMAGES.post2,
    caption: "Цвет — это язык, которым я говорю с миром 🎨",
    likes: 892,
    comments: 47,
    time: "5 ч назад",
    liked: true,
    saved: true,
  },
  {
    id: 3,
    user: { name: "Алина Морозова", username: "alina_m", avatar: IMAGES.avatar1, verified: true },
    image: IMAGES.post3,
    caption: "Детокс-понедельник: ягоды, фрукты и хорошее настроение 🍓",
    likes: 634,
    comments: 29,
    time: "1 д назад",
    liked: false,
    saved: false,
  },
];

const STORIES = [
  { id: 1, name: "Вы", avatar: IMAGES.avatar1, viewed: false, isMe: true },
  { id: 2, name: "alina_m", avatar: IMAGES.avatar1, viewed: false },
  { id: 3, name: "dima_wolf", avatar: IMAGES.avatar2, viewed: false },
  { id: 4, name: "kate_photo", avatar: IMAGES.post3, viewed: true },
  { id: 5, name: "mike_art", avatar: IMAGES.post2, viewed: true },
  { id: 6, name: "sun_girl", avatar: IMAGES.post1, viewed: true },
];

const USERS = [
  { id: 1, name: "Алина Морозова", username: "alina_m", avatar: IMAGES.avatar1, followers: "12.4K", following: false, verified: true },
  { id: 2, name: "Дмитрий Волков", username: "dima_wolf", avatar: IMAGES.avatar2, followers: "8.7K", following: true, verified: false },
  { id: 3, name: "Катерина Лис", username: "kate_photo", avatar: IMAGES.post3, followers: "23.1K", following: false, verified: true },
];

const NOTIFICATIONS = [
  { id: 1, type: "like", user: "alina_m", avatar: IMAGES.avatar1, text: "понравился ваш пост", time: "2 мин", read: false },
  { id: 2, type: "comment", user: "dima_wolf", avatar: IMAGES.avatar2, text: "прокомментировал: «Невероятно красиво!»", time: "15 мин", read: false },
  { id: 3, type: "follow", user: "kate_photo", avatar: IMAGES.post3, text: "подписался на вас", time: "1 ч", read: true },
  { id: 4, type: "like", user: "mike_art", avatar: IMAGES.post2, text: "понравился ваш пост", time: "3 ч", read: true },
];

const MESSAGES = [
  { id: 1, user: "Алина Морозова", username: "alina_m", avatar: IMAGES.avatar1, last: "Привет! Как дела?", time: "только что", unread: 3, online: true },
  { id: 2, user: "Дмитрий Волков", username: "dima_wolf", avatar: IMAGES.avatar2, last: "Спасибо за лайк 😊", time: "5 мин", unread: 0, online: false },
  { id: 3, user: "Катерина Лис", username: "kate_photo", avatar: IMAGES.post3, last: "Классное фото!", time: "1 ч", unread: 1, online: true },
];

type Tab = "feed" | "search" | "messages" | "notifications" | "saved" | "profile";

type Post = {
  id: number;
  user: { name: string; username: string; avatar: string; verified: boolean };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
  saved: boolean;
};

type Story = {
  id: number;
  name: string;
  avatar: string;
  viewed: boolean;
  isMe?: boolean;
  image?: string;
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [users, setUsers] = useState(USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Record<number, { text: string; mine: boolean; time: string }[]>>({
    1: [{ text: "Привет! Как дела?", mine: false, time: "только что" }],
    2: [{ text: "Спасибо за лайк 😊", mine: false, time: "5 мин" }],
    3: [{ text: "Классное фото!", mine: false, time: "1 ч" }],
  });

  // Publish modal
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [publishMode, setPublishMode] = useState<"post" | "story" | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [stories, setStories] = useState<Story[]>(STORIES);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openPicker = (mode: "post" | "story") => {
    setPublishMode(mode);
    setShowPublishMenu(false);
    setSelectedImage(null);
    setCaption("");
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    e.target.value = "";
  };

  const publishPost = () => {
    if (!selectedImage) return;
    const newPost: Post = {
      id: Date.now(),
      user: { name: "Вы", username: "my_profile", avatar: IMAGES.avatar1, verified: false },
      image: selectedImage,
      caption: caption || "Новая публикация 📸",
      likes: 0,
      comments: 0,
      time: "только что",
      liked: false,
      saved: false,
    };
    setPosts(p => [newPost, ...p]);
    setSelectedImage(null);
    setCaption("");
    setPublishMode(null);
    setActiveTab("feed");
  };

  const publishStory = () => {
    if (!selectedImage) return;
    const newStory: Story = {
      id: Date.now(),
      name: "Ваша",
      avatar: selectedImage,
      viewed: false,
      isMe: true,
      image: selectedImage,
    };
    setStories(s => [newStory, ...s.filter(st => !st.isMe)]);
    setSelectedImage(null);
    setPublishMode(null);
  };

  const toggleLike = (id: number) => {
    setPosts(p => p.map(post => post.id === id
      ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
      : post
    ));
  };

  const toggleSave = (id: number) => {
    setPosts(p => p.map(post => post.id === id ? { ...post, saved: !post.saved } : post));
  };

  const toggleFollow = (id: number) => {
    setUsers(u => u.map(user => user.id === id ? { ...user, following: !user.following } : user));
  };

  const sendMessage = (chatId: number) => {
    if (!chatMessage.trim()) return;
    setChatMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), { text: chatMessage, mine: true, time: "только что" }],
    }));
    setChatMessage("");
  };

  const navItems: { id: Tab; icon: string; label: string; badge?: number }[] = [
    { id: "feed", icon: "Home", label: "Лента" },
    { id: "search", icon: "Search", label: "Поиск" },
    { id: "messages", icon: "MessageCircle", label: "Сообщения", badge: 4 },
    { id: "notifications", icon: "Bell", label: "Уведомления", badge: 2 },
    { id: "saved", icon: "Bookmark", label: "Избранное" },
    { id: "profile", icon: "User", label: "Профиль" },
  ];

  const savedPosts = posts.filter(p => p.saved);

  return (
    <div className="min-h-screen bg-[#0a0a12] font-golos flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 p-6 border-r border-white/5">
        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-2xl font-black gradient-text">⚡ Вспышка</h1>
          <p className="text-xs text-white/30 mt-1">социальная сеть</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 relative group
                ${activeTab === item.id
                  ? "gradient-bg text-white font-semibold shadow-lg glow-purple"
                  : "text-white/50 hover:text-white hover:bg-white/5"}`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-sm">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Publish button desktop */}
        <button
          onClick={() => setShowPublishMenu(v => !v)}
          className="w-full gradient-bg text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 glow-purple hover:scale-105 transition-transform mb-4"
        >
          <Icon name="Plus" size={18} />
          Создать публикацию
        </button>

        {/* My profile mini */}
        <div className="mt-2 p-3 glass rounded-xl flex items-center gap-3">
          <div className="story-ring w-10 h-10 flex-shrink-0">
            <img src={IMAGES.avatar1} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Вы</p>
            <p className="text-xs text-white/40 truncate">@my_profile</p>
          </div>
          <Icon name="Settings" size={16} className="text-white/30" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="md:hidden sticky top-0 z-50 glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-black gradient-text">⚡ Вспышка</h1>
          <div className="flex items-center gap-3">
            <button className="text-white/60" onClick={() => setActiveTab("notifications")}>
              <Icon name="Bell" size={22} />
            </button>
            <button className="text-white/60" onClick={() => setActiveTab("messages")}>
              <Icon name="MessageCircle" size={22} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-6">

          {/* === FEED === */}
          {activeTab === "feed" && (
            <div className="max-w-lg mx-auto py-4 px-4 space-y-6 animate-fade-in">
              {/* Stories */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {/* Add story button */}
                <div
                  className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                  onClick={() => openPicker("story")}
                >
                  <div className="w-[62px] h-[62px] rounded-full gradient-border relative flex items-center justify-center bg-white/5 border border-white/10">
                    <Icon name="Plus" size={24} className="text-white/70" />
                  </div>
                  <span className="text-xs text-white/60">Добавить</span>
                </div>

                {stories.map(story => (
                  <div
                    key={story.id}
                    className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                    onClick={() => setViewingStory(story)}
                  >
                    <div className={`rounded-full p-[2px] ${story.viewed ? "bg-white/10" : "gradient-bg"}`}>
                      <div className="bg-[#0a0a12] rounded-full p-[2px]">
                        <img src={story.image || story.avatar} className="w-14 h-14 rounded-full object-cover" />
                      </div>
                    </div>
                    <span className="text-xs text-white/60 max-w-[60px] truncate">
                      {story.isMe ? "Ваша" : story.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Posts */}
              {posts.map((post, i) => (
                <article
                  key={post.id}
                  className="glass rounded-2xl overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Post header */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="story-ring w-10 h-10 flex-shrink-0">
                        <div className="bg-[#0a0a12] rounded-full p-[2px] w-full h-full">
                          <img src={post.user.avatar} className="w-full h-full rounded-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-white">{post.user.name}</span>
                          {post.user.verified && (
                            <Icon name="BadgeCheck" size={14} className="text-purple-400" />
                          )}
                        </div>
                        <span className="text-xs text-white/40">{post.time}</span>
                      </div>
                    </div>
                    <button className="text-white/30 hover:text-white/60">
                      <Icon name="MoreHorizontal" size={20} />
                    </button>
                  </div>

                  {/* Image */}
                  <div className="relative">
                    <img src={post.image} className="w-full aspect-square object-cover" />
                  </div>

                  {/* Actions */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition-all duration-200 ${post.liked ? "text-pink-500 scale-110" : "text-white/50 hover:text-white"}`}
                        >
                          <Icon name={post.liked ? "Heart" : "Heart"} size={22} />
                          <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
                          <Icon name="MessageCircle" size={22} />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        <button className="text-white/50 hover:text-white transition-colors">
                          <Icon name="Send" size={22} />
                        </button>
                      </div>
                      <button
                        onClick={() => toggleSave(post.id)}
                        className={`transition-all duration-200 ${post.saved ? "text-purple-400 scale-110" : "text-white/50 hover:text-white"}`}
                      >
                        <Icon name="Bookmark" size={22} />
                      </button>
                    </div>

                    <p className="text-sm text-white/80 leading-relaxed">
                      <span className="font-semibold text-white">{post.user.username} </span>
                      {post.caption}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* === SEARCH === */}
          {activeTab === "search" && (
            <div className="max-w-2xl mx-auto py-6 px-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Поиск</h2>

              {/* Search input */}
              <div className="relative mb-8">
                <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск пользователей и публикаций..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Users */}
              <div>
                <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Пользователи</h3>
                <div className="space-y-3">
                  {users.filter(u =>
                    !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.includes(searchQuery.toLowerCase())
                  ).map(user => (
                    <div key={user.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                      <div className="story-ring w-12 h-12 flex-shrink-0">
                        <div className="bg-[#0a0a12] rounded-full p-[2px] w-full h-full">
                          <img src={user.avatar} className="w-full h-full rounded-full object-cover" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-white">{user.name}</span>
                          {user.verified && <Icon name="BadgeCheck" size={14} className="text-purple-400" />}
                        </div>
                        <p className="text-sm text-white/40">@{user.username} · {user.followers} подписчиков</p>
                      </div>
                      <button
                        onClick={() => toggleFollow(user.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                          ${user.following
                            ? "bg-white/10 text-white/60 hover:bg-red-500/20 hover:text-red-400"
                            : "gradient-bg text-white glow-purple hover:scale-105"}`}
                      >
                        {user.following ? "Отписаться" : "Подписаться"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo grid */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Публикации</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {[IMAGES.post1, IMAGES.post2, IMAGES.post3, IMAGES.post1, IMAGES.post2, IMAGES.post3].map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden hover-scale cursor-pointer">
                      <img src={img} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === MESSAGES === */}
          {activeTab === "messages" && (
            <div className="max-w-2xl mx-auto py-6 px-4 animate-fade-in h-full">
              {activeChat ? (
                <div className="flex flex-col h-[calc(100vh-180px)]">
                  {/* Chat header */}
                  <div className="glass rounded-2xl p-4 flex items-center gap-3 mb-4">
                    <button onClick={() => setActiveChat(null)} className="text-white/50 hover:text-white mr-1">
                      <Icon name="ArrowLeft" size={20} />
                    </button>
                    {(() => {
                      const msg = MESSAGES.find(m => m.id === activeChat);
                      return msg ? (
                        <>
                          <div className="relative">
                            <img src={msg.avatar} className="w-10 h-10 rounded-full object-cover" />
                            {msg.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0a0a12]" />}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{msg.user}</p>
                            <p className="text-xs text-green-400">{msg.online ? "в сети" : "не в сети"}</p>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {(chatMessages[activeChat] || []).map((m, i) => (
                      <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm
                          ${m.mine ? "gradient-bg text-white rounded-br-md" : "glass text-white/90 rounded-bl-md"}`}>
                          {m.text}
                          <p className={`text-xs mt-1 ${m.mine ? "text-white/60" : "text-white/30"}`}>{m.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="glass rounded-2xl p-2 flex items-center gap-2">
                    <input
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMessage(activeChat)}
                      placeholder="Написать сообщение..."
                      className="flex-1 bg-transparent px-3 py-2 text-white placeholder:text-white/30 focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => sendMessage(activeChat)}
                      className="gradient-bg w-10 h-10 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
                    >
                      <Icon name="Send" size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">Сообщения</h2>
                  <div className="space-y-2">
                    {MESSAGES.map(msg => (
                      <button
                        key={msg.id}
                        onClick={() => setActiveChat(msg.id)}
                        className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="relative">
                          <img src={msg.avatar} className="w-12 h-12 rounded-full object-cover" />
                          {msg.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a12]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{msg.user}</span>
                            <span className="text-xs text-white/30">{msg.time}</span>
                          </div>
                          <p className="text-sm text-white/50 truncate">{msg.last}</p>
                        </div>
                        {msg.unread > 0 && (
                          <span className="w-5 h-5 gradient-bg rounded-full text-xs text-white flex items-center justify-center font-bold flex-shrink-0">
                            {msg.unread}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* === NOTIFICATIONS === */}
          {activeTab === "notifications" && (
            <div className="max-w-lg mx-auto py-6 px-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Уведомления</h2>
              <div className="space-y-2">
                {NOTIFICATIONS.map(notif => (
                  <div
                    key={notif.id}
                    className={`glass rounded-2xl p-4 flex items-center gap-4 ${!notif.read ? "border-l-2 border-purple-500" : ""}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={notif.avatar} className="w-12 h-12 rounded-full object-cover" />
                      <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs
                        ${notif.type === "like" ? "bg-pink-500" : notif.type === "comment" ? "bg-purple-500" : "gradient-bg"}`}>
                        {notif.type === "like" ? "❤️" : notif.type === "comment" ? "💬" : "➕"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-semibold">@{notif.user}</span>{" "}
                        <span className="text-white/60">{notif.text}</span>
                      </p>
                      <p className="text-xs text-white/30 mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && <span className="w-2 h-2 gradient-bg rounded-full flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === SAVED === */}
          {activeTab === "saved" && (
            <div className="max-w-2xl mx-auto py-6 px-4 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Избранное</h2>
              <p className="text-white/40 text-sm mb-6">{savedPosts.length} сохранённых публикаций</p>
              {savedPosts.length === 0 ? (
                <div className="text-center py-20 glass rounded-2xl">
                  <Icon name="Bookmark" size={48} className="text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">Сохраняйте понравившиеся публикации</p>
                  <p className="text-white/20 text-sm mt-1">Нажмите на закладку под фото</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {savedPosts.map(post => (
                    <div key={post.id} className="glass rounded-2xl overflow-hidden hover-scale cursor-pointer">
                      <img src={post.image} className="w-full aspect-square object-cover" />
                      <div className="p-3">
                        <p className="text-xs text-white/60 truncate">{post.caption}</p>
                        <div className="flex items-center gap-1 mt-1 text-pink-400">
                          <Icon name="Heart" size={12} />
                          <span className="text-xs">{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === PROFILE === */}
          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto py-6 px-4 animate-fade-in">
              {/* Cover */}
              <div className="relative h-32 rounded-2xl overflow-hidden mb-16 gradient-bg">
                <div className="absolute inset-0 opacity-40"
                  style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)" }} />
                {/* Avatar */}
                <div className="absolute -bottom-12 left-6">
                  <div className="story-ring w-24 h-24 rounded-full">
                    <div className="bg-[#0a0a12] rounded-full p-[3px] w-full h-full">
                      <img src={IMAGES.avatar1} className="w-full h-full rounded-full object-cover" />
                    </div>
                  </div>
                </div>
                <button className="absolute bottom-3 right-3 glass px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-1">
                  <Icon name="Edit3" size={12} />
                  Изменить
                </button>
              </div>

              {/* Info */}
              <div className="px-2 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">Алина Морозова</h2>
                      <Icon name="BadgeCheck" size={18} className="text-purple-400" />
                    </div>
                    <p className="text-white/40 text-sm">@alina_m</p>
                    <p className="text-white/70 text-sm mt-2 max-w-xs">
                      Фотограф 📸 Путешественница ✈️ Ловлю красоту каждого момента
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  {[
                    { label: "Публикации", value: "147" },
                    { label: "Подписчики", value: "12.4K" },
                    { label: "Подписки", value: "834" },
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <p className="text-lg font-bold gradient-text">{stat.value}</p>
                      <p className="text-xs text-white/40">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 gradient-bg text-white py-2.5 rounded-xl text-sm font-semibold glow-purple hover:scale-105 transition-transform">
                    Редактировать профиль
                  </button>
                  <button className="glass border border-white/10 text-white py-2.5 px-4 rounded-xl text-sm hover:bg-white/10 transition-colors">
                    <Icon name="Share2" size={18} />
                  </button>
                </div>
              </div>

              {/* Posts grid */}
              <div>
                <div className="flex border-b border-white/5 mb-4">
                  <button className="flex-1 py-3 text-sm font-semibold text-white border-b-2 border-purple-500 flex items-center justify-center gap-2">
                    <Icon name="Grid3X3" size={16} /> Публикации
                  </button>
                  <button className="flex-1 py-3 text-sm text-white/40 flex items-center justify-center gap-2">
                    <Icon name="Bookmark" size={16} /> Сохранённые
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[IMAGES.post1, IMAGES.post2, IMAGES.post3, IMAGES.post1, IMAGES.post2, IMAGES.post3].map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden hover-scale cursor-pointer relative group">
                      <img src={img} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <span className="text-white text-xs flex items-center gap-1"><Icon name="Heart" size={14} /> {Math.floor(Math.random() * 900 + 100)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom nav mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 flex">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 relative transition-colors
                ${activeTab === item.id ? "text-purple-400" : "text-white/30"}`}
            >
              <Icon name={item.icon} size={22} />
              {item.badge && (
                <span className="absolute top-2 right-1/4 bg-pink-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* FAB + button */}
      <div className="fixed bottom-24 md:bottom-8 right-6 z-40 flex flex-col items-end gap-3">
        {/* Mini menu */}
        {showPublishMenu && (
          <div className="flex flex-col gap-2 items-end animate-scale-in">
            <button
              onClick={() => openPicker("story")}
              className="flex items-center gap-3 glass border border-white/10 text-white px-4 py-3 rounded-2xl text-sm font-medium hover:bg-white/10 transition-colors shadow-xl"
            >
              Добавить историю
              <span className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                <Icon name="Clock" size={16} />
              </span>
            </button>
            <button
              onClick={() => openPicker("post")}
              className="flex items-center gap-3 glass border border-white/10 text-white px-4 py-3 rounded-2xl text-sm font-medium hover:bg-white/10 transition-colors shadow-xl"
            >
              Опубликовать фото
              <span className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                <Icon name="Image" size={16} />
              </span>
            </button>
          </div>
        )}
        <button
          onClick={() => setShowPublishMenu(v => !v)}
          className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center shadow-2xl glow-purple pulse-glow transition-all duration-300"
          style={{ transform: showPublishMenu ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <Icon name="Plus" size={26} className="text-white" />
        </button>
      </div>

      {/* Publish post modal */}
      {publishMode === "post" && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass border border-white/10 rounded-t-3xl md:rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Новая публикация</h3>
              <button onClick={() => { setSelectedImage(null); setPublishMode(null); }} className="text-white/40 hover:text-white">
                <Icon name="X" size={22} />
              </button>
            </div>
            <img src={selectedImage} className="w-full aspect-square object-cover rounded-2xl mb-4" />
            <div className="flex items-start gap-3 mb-5">
              <img src={IMAGES.avatar1} className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1" />
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Напишите подпись к фото..."
                rows={3}
                className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-sm resize-none"
              />
            </div>
            <button
              onClick={publishPost}
              className="w-full gradient-bg text-white py-3.5 rounded-2xl font-semibold text-sm glow-purple hover:scale-[1.02] transition-transform"
            >
              Опубликовать
            </button>
          </div>
        </div>
      )}

      {/* Publish story modal */}
      {publishMode === "story" && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm glass border border-white/10 rounded-t-3xl md:rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Новая история</h3>
              <button onClick={() => { setSelectedImage(null); setPublishMode(null); }} className="text-white/40 hover:text-white">
                <Icon name="X" size={22} />
              </button>
            </div>
            <div className="relative mx-auto w-48 aspect-[9/16] rounded-3xl overflow-hidden mb-5 shadow-2xl">
              <img src={selectedImage} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6))" }} />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-xs font-semibold">Ваша история</p>
              </div>
            </div>
            <button
              onClick={publishStory}
              className="w-full gradient-bg text-white py-3.5 rounded-2xl font-semibold text-sm glow-purple hover:scale-[1.02] transition-transform"
            >
              Добавить в истории
            </button>
          </div>
        </div>
      )}

      {/* Story viewer */}
      {viewingStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => {
            setStories(s => s.map(st => st.id === viewingStory.id ? { ...st, viewed: true } : st));
            setViewingStory(null);
          }}
        >
          <div className="relative w-full max-w-sm h-screen md:h-[90vh] md:max-h-[700px] flex flex-col">
            {/* Progress bar */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-white/20 rounded-full z-10 overflow-hidden">
              <div className="h-full gradient-bg rounded-full animate-[progress_4s_linear_forwards]" style={{ width: "100%" }} />
            </div>
            {/* Header */}
            <div className="absolute top-10 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <img src={viewingStory.avatar} className="w-8 h-8 rounded-full object-cover border-2 border-white/40" />
                <span className="text-white text-sm font-semibold">{viewingStory.name}</span>
              </div>
              <button className="text-white/70 hover:text-white">
                <Icon name="X" size={22} />
              </button>
            </div>
            <img src={viewingStory.image || viewingStory.avatar} className="w-full h-full object-cover md:rounded-3xl" />
          </div>
        </div>
      )}
    </div>
  );
}
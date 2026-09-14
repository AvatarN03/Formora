"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Sparkles, Send, RefreshCw, CheckCircle2, User, Bot, Layout, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ThemeType = "obsidian" | "neon" | "emerald" | "amber";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

const themeStyles: Record<ThemeType, {
  name: string;
  badge: string;
  bg: string;
  aiBubble: string;
  userBubble: string;
  accentBtn: string;
  glow: string;
}> = {
  obsidian: {
    name: "Obsidian Dark",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    bg: "bg-[#0c0e1a]/90 border-orange-500/20",
    aiBubble: "bg-[#161a2e] border-[#262a45] text-slate-100",
    userBubble: "bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-400/30",
    accentBtn: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]",
  },
  neon: {
    name: "Neon Cyber",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    bg: "bg-[#0d0a1d]/90 border-purple-500/20",
    aiBubble: "bg-[#1a1333] border-[#2e2354] text-slate-100",
    userBubble: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400/30",
    accentBtn: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.18)]",
  },
  emerald: {
    name: "Emerald Glow",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    bg: "bg-[#061210]/90 border-emerald-500/20",
    aiBubble: "bg-[#0d221e] border-[#183b34] text-slate-100",
    userBubble: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/30",
    accentBtn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.18)]",
  },
  amber: {
    name: "Sunset Amber",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    bg: "bg-[#140e0a]/90 border-amber-500/20",
    aiBubble: "bg-[#241a12] border-[#3d2c1e] text-slate-100",
    userBubble: "bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-400/30",
    accentBtn: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.18)]",
  },
};

export function InteractiveChatScene() {
  const [activeTheme, setActiveTheme] = useState<ThemeType>("obsidian");
  const [step, setStep] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hi! 👋 Welcome to Formly Chat Scene. What type of conversational form would you like to build today?",
      timestamp: "Just now",
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [formData, setFormData] = useState<{ formType?: string; volume?: string; companyName?: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSelectOption = (optionText: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: optionText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    if (step === 0) {
      setFormData((prev) => ({ ...prev, formType: optionText }));
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: `Selected "${optionText}"! Excellent choice. Next, how many monthly responses do you anticipate?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
        setStep(1);
      }, 900);
    } else if (step === 1) {
      setFormData((prev) => ({ ...prev, volume: optionText }));
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: "Got it! Lastly, what is your workspace or project name?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
        setStep(2);
      }, 900);
    }
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || step !== 2) return;

    const userText = inputValue.trim();
    setInputValue("");

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setFormData((prev) => ({ ...prev, companyName: userText }));
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `🎉 Perfect! Your Chat Scene form for "${userText}" is configured! You can manage it now in the Console hub.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
      setStep(3);
    }, 1000);
  };

  const handleReset = () => {
    setStep(0);
    setFormData({});
    setMessages([
      {
        id: "1",
        sender: "ai",
        text: "Hi! 👋 Welcome to Formly Chat Scene. What type of conversational form would you like to build today?",
        timestamp: "Just now",
      },
    ]);
  };

  const theme = themeStyles[activeTheme];

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* Theme Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`gap-1.5 px-3 py-1 ${theme.badge}`}>
            <Sparkles className="size-3.5" /> Chat Scene Theme
          </Badge>
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
            Select an aesthetic mode:
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#121422] p-1 rounded-xl border border-white/10">
          {(Object.keys(themeStyles) as ThemeType[]).map((tKey) => (
            <button
              key={tKey}
              onClick={() => setActiveTheme(tKey)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTheme === tKey
                  ? `${themeStyles[tKey].accentBtn} shadow-md`
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {themeStyles[tKey].name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div
        className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ${theme.bg} ${theme.glow}`}
      >
        {/* Chat Scene Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-9 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Bot className="size-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-tight">Formly Assistant</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Interactive Preview
                </span>
              </div>
              <p className="text-xs text-slate-400">Step {Math.min(step + 1, 3)} of 3 • Response Rate: 98%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white hover:bg-white/10 gap-1.5"
            >
              <RefreshCw className="size-3.5" /> Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs border-orange-500/30 hover:bg-orange-500/10 text-orange-400 gap-1.5"
            >
              <Link href="/console">
                <Layout className="size-3.5" /> Console <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Chat Stream Area */}
        <div className="p-5 sm:p-6 min-h-[340px] max-h-[420px] overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 items-end ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } animate-in fade-in-50 duration-300`}
            >
              {msg.sender === "ai" && (
                <div className="size-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-orange-400 shrink-0 mb-1">
                  <Bot className="size-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? `${theme.userBubble} rounded-br-sm`
                    : `${theme.aiBubble} rounded-bl-sm`
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === "user" ? "text-white/70 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === "user" && (
                <div className="size-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 mb-1">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-end justify-start animate-in fade-in-50">
              <div className="size-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-orange-400 shrink-0">
                <Bot className="size-4" />
              </div>
              <div className={`rounded-2xl px-4 py-3 ${theme.aiBubble} rounded-bl-sm flex items-center gap-1.5`}>
                <span className="size-2 rounded-full bg-orange-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="size-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="size-2 rounded-full bg-cyan-400 animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Interactive Response Options / Input Bar */}
        <div className="p-4 border-t border-white/10 bg-black/30">
          {step === 0 && !isTyping && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium block">Select a form scene scenario:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  "Product Feedback 🚀",
                  "Lead Generation 🎯",
                  "Event Registration 🎟️",
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/40 hover:text-white transition-all text-left flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <MessageSquare className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-orange-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && !isTyping && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium block">Select expected response volume:</span>
              <div className="grid grid-cols-3 gap-2">
                {["< 500 / mo", "500 - 5,000 / mo", "5,000+ / mo"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className="px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/40 hover:text-white transition-all text-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && !isTyping && (
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your company/project name..."
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/60"
              />
              <Button type="submit" className={theme.accentBtn}>
                <Send className="size-4" /> Send
              </Button>
            </form>
          )}

          {step === 3 && !isTyping && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 text-xs text-orange-300 font-medium">
                <CheckCircle2 className="size-4 text-orange-400 shrink-0" />
                <span>Form Scene configured! Explore full creation & response analytics in the Console.</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <Button size="sm" asChild className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white gap-2 shadow-lg">
                  <Link href="/console">
                    Launch Console <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      {(formData.formType || formData.volume || formData.companyName) && (
        <div className="mt-3 flex flex-wrap items-center gap-3 px-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Live Config:</span>
          {formData.formType && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200">
              Type: <strong className="text-orange-400">{formData.formType}</strong>
            </span>
          )}
          {formData.volume && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200">
              Volume: <strong className="text-purple-400">{formData.volume}</strong>
            </span>
          )}
          {formData.companyName && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200">
              Workspace: <strong className="text-emerald-400">{formData.companyName}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

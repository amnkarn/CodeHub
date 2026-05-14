import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Typewriter words ─────
const WORDS = ["future", "products", "ideas", "projects", "apps"];
const TYPE_SPEED = 80;   // ms per character
const DELETE_SPEED = 45; // ms per character
const PAUSE_AFTER = 1800; // ms to wait when word is complete

// ─── Code editor content ────
type Token = { text: string; color: string; bold?: boolean };
type CodeLine = Token[];

const CODE_LINES: CodeLine[] = [
    [
        { text: "export ", color: "#c792ea" },
        { text: "const ", color: "#c792ea" },
        { text: "rateLimiter", color: "#eeffff", bold: true },
        { text: " = ", color: "#89ddff" },
        { text: "createMiddleware", color: "#82aaff" },
        { text: "({", color: "#eeffff" },
    ],
    [
        { text: "  windowMs", color: "#f07178" },
        { text: ": ", color: "#eeffff" },
        { text: "15", color: "#f78c6c" },
        { text: " * ", color: "#89ddff" },
        { text: "60", color: "#f78c6c" },
        { text: " * ", color: "#89ddff" },
        { text: "1000", color: "#f78c6c" },
        { text: ",", color: "#eeffff" },
    ],
    [
        { text: "  max", color: "#f07178" },
        { text: ": ", color: "#eeffff" },
        { text: "100", color: "#f78c6c" },
        { text: ",", color: "#eeffff" },
    ],
    [
        { text: "  handler", color: "#f07178" },
        { text: ": (", color: "#eeffff" },
        { text: "req", color: "#ffcb6b" },
        { text: ", ", color: "#eeffff" },
        { text: "res", color: "#ffcb6b" },
        { text: ") ", color: "#eeffff" },
        { text: "=>", color: "#89ddff" },
        { text: " res", color: "#eeffff" },
        { text: ".", color: "#89ddff" },
        { text: "status", color: "#82aaff" },
        { text: "(", color: "#eeffff" },
        { text: "429", color: "#f78c6c" },
        { text: ").", color: "#eeffff" },
        { text: "json", color: "#82aaff" },
        { text: "({ error: ", color: "#eeffff" },
        { text: '"Too many requests"', color: "#c3e88d" },
        { text: " }),", color: "#eeffff" },
    ],
    [{ text: "});", color: "#eeffff" }],
];

// ─── Code Editor Mockup ────
function CodeEditor() {
    return (
        <div
            className="w-full min-w-2xl max-w-xl mx-auto rounded-xl overflow-hidden"
            style={{
                background: "#0d1117",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,180,216,0.08)",
            }}
        >
            {/* Title bar */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#161b22" }} >

                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                </div>

                <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                    nexus-framework{" "}
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>{" "}
                    src{" "}
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>{" "}
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>middleware.ts</span>
                </span>
            </div>

            {/* Code body */}
            <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
                {CODE_LINES.map((line, i) => (
                    <div key={i} className="whitespace-pre">
                        {line.map((token, j) => (
                            <span
                                key={j}
                                style={{
                                    color: token.color,
                                    fontWeight: token.bold ? 600 : 400,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                                    fontSize: "14px",
                                }}
                            >
                                {token.text}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Hero ────────
export default function HeroSection() {
    const [displayText, setDisplayText] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const [mounted, setMounted] = useState(false);

    const navigate = useNavigate();

    // Fade-in on mount
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(t);
    }, []);

    // Cursor blink
    useEffect(() => {
        const interval = setInterval(() => setShowCursor((v) => !v), 530);
        return () => clearInterval(interval);
    }, []);

    // Typewriter
    const tick = useCallback(() => {
        const current = WORDS[wordIndex];

        if (!isDeleting) {
            if (displayText.length < current.length) {
                setDisplayText(current.slice(0, displayText.length + 1));
            } else {
                setTimeout(() => setIsDeleting(true), PAUSE_AFTER);
            }
        } else {
            if (displayText.length > 0) {
                setDisplayText(current.slice(0, displayText.length - 1));
            } else {
                setIsDeleting(false);
                setWordIndex((i) => (i + 1) % WORDS.length);
            }
        }
    }, [displayText, wordIndex, isDeleting]);

    useEffect(() => {
        const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED;
        const timer = setTimeout(tick, speed);
        return () => clearTimeout(timer);
    }, [tick, isDeleting]);


    return (
        <div
            className="relative min-h-screen flex flex-col overflow-hidden"
            style={{ background: "#080c12" }}
        >
            {/* Radial glow behind hero text */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,140,200,0.12) 0%, transparent 70%)",
                }}
            />

            {/* Subtle grid / noise overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0,180,216,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,180,216,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Hero content */}
            <main
                className="relative z-10 flex flex-col items-center justify-center flex-1 0 pt-24 pb-12 text-center"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.7s ease, transform 0.7s ease",
                }}
            >
                {/* Badge pill */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium tracking-wide"
                    style={{
                        border: "1px solid rgba(0,200,255,0.35)",
                        background: "rgba(0,180,216,0.06)",
                        color: "#00c6e0",
                        boxShadow: "0 0 18px rgba(0,180,216,0.12)",
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: "#00c6e0" }}
                    />
                    Open-source platform for serious developers
                </div>

                {/* Main heading */}
                <h1
                    className="font-black leading-none mb-6 text-white tracking-tight"
                    style={{
                        fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                        fontFamily: "'Cal Sans', 'Clash Display', 'Plus Jakarta Sans', sans-serif",
                        letterSpacing: "-0.03em",
                    }}
                >
                    <span>Where </span>
                    <span style={{ color: "#00c6e0", textShadow: "0 0 40px rgba(0,198,224,0.45)" }} >
                        {displayText}
                    </span>
                    <span
                        style={{
                            display: "inline-block",
                            width: "3px",
                            height: "0.85em",
                            background: "#00c6e0",
                            marginLeft: "2px",
                            verticalAlign: "text-bottom",
                            borderRadius: "1px",
                            opacity: showCursor ? 1 : 0,
                            boxShadow: "0 0 8px rgba(0,198,224,0.8)",
                            transition: "opacity 0.1s",
                        }}
                    />
                    <br />
                    <span>get built</span>
                </h1>

                {/* Subtitle */}
                <p
                    className="max-w-160 mx-auto mb-10 mt-7 leading-relaxed"
                    style={{
                        color: "rgba(255,255,255,0.52)",
                        fontSize: "clamp(1rem, 2vw, 1.125rem)",
                        fontFamily: "'DM Sans', 'Outfit', sans-serif",
                    }}
                >
                    CodeHub is the developer platform trusted by teams worldwide. Host code, review pull
                    requests, track issues, and ship faster — together.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                    <button
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white text-sm transition-all duration-200"
                        style={{
                            background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)",
                            boxShadow: "0 0 24px rgba(0,180,216,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                                "0 0 36px rgba(0,180,216,0.6), inset 0 1px 0 rgba(255,255,255,0.2)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow =
                                "0 0 24px rgba(0,180,216,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onClick={() => navigate("/home")}
                    >
                        Open Dashboard
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M2 7h10M8 3l4 4-4 4"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <button
                        className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200"
                        style={{
                            border: "1px solid rgba(255,255,255,0.15)",
                            background: "rgba(255,255,255,0.04)",
                            color: "rgba(255,255,255,0.75)",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.25)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.15)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                            e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                        }}
                    >
                        Browse Issues
                    </button>
                </div>

                {/* Code editor */}
                <div
                    className="w-full pb-20"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(24px)",
                        transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
                    }}
                >
                    <CodeEditor />
                </div>
            </main>
        </div>
    );
}
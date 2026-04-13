import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

const TEAL = "#00d1b2";
const TEAL2 = "#00e8c8";
const NAVY = "#0d1117";
const NAVY2 = "#0a0e14";
const WHITE = "#e8ecf0";
const DIM = "#6e7d8f";

const TOTAL_SCENES = 5;
const SCENE_DURATION = 2800;

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const unsubscribe = rounded.onChange(v => setDisplay(String(v)));
    const controls = animate(count, to, { duration: 1.2, ease: "easeOut" });
    return () => { controls.stop(); unsubscribe(); };
  }, [to]);

  return <span>{display}{suffix}</span>;
}

function GridLines() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`v${i}`} x1={`${(i / 11) * 100}%`} y1="0" x2={`${(i / 11) * 100}%`} y2="100%" stroke={TEAL} strokeWidth="1" />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={`${(i / 7) * 100}%`} x2="100%" y2={`${(i / 7) * 100}%`} stroke={TEAL} strokeWidth="1" />
      ))}
    </svg>
  );
}

function PulseRing({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      style={{
        position: "absolute", borderRadius: "50%",
        border: `1px solid ${TEAL}`,
        top: "50%", left: "50%", x: "-50%", y: "-50%",
      }}
      animate={{ width: [60, 200], height: [60, 200], opacity: [0.6, 0] }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

function PhoneIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill={TEAL} />
    </svg>
  );
}

function Scene1() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        style={{ position: "relative", width: 90, height: 90, borderRadius: "50%", background: `${TEAL}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}
      >
        <PulseRing delay={0} />
        <PulseRing delay={0.7} />
        <PhoneIcon />
      </motion.div>

      <div style={{ overflow: "hidden" }}>
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: "circOut" }}
          style={{ color: WHITE, fontSize: 46, fontWeight: 800, lineHeight: 1.1, textAlign: "center", fontFamily: "'Inter', sans-serif", letterSpacing: -1 }}
        >
          Your agency is
        </motion.div>
      </div>
      <div style={{ overflow: "hidden" }}>
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: "circOut" }}
          style={{ color: TEAL, fontSize: 52, fontWeight: 900, lineHeight: 1.1, textAlign: "center", fontFamily: "'Inter', sans-serif", letterSpacing: -1 }}
        >
          missing calls right now.
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        style={{ marginTop: 20, color: DIM, fontSize: 20, fontFamily: "'Inter', sans-serif" }}
      >
        After hours. Weekends. Public holidays.
      </motion.div>
    </div>
  );
}

function Scene2() {
  const stats = [
    { value: "73", suffix: "%", label: "of missed calls never call back" },
    { value: "2", suffix: "×", label: "more leads captured after hours" },
    { value: "$0", suffix: "", label: "extra staff required" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 80px" }}>
      <div style={{ overflow: "hidden", marginBottom: 40 }}>
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          style={{ color: WHITE, fontSize: 38, fontWeight: 800, textAlign: "center", fontFamily: "'Inter', sans-serif" }}
        >
          The cost of a missed call.
        </motion.div>
      </div>

      <div style={{ display: "flex", gap: 36, width: "100%" }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.45, ease: "backOut" }}
            style={{
              flex: 1, background: `${TEAL}0d`, border: `1px solid ${TEAL}33`,
              borderRadius: 16, padding: "24px 20px", textAlign: "center",
            }}
          >
            <div style={{ color: TEAL, fontSize: 52, fontWeight: 900, fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
              {s.value}<span style={{ color: TEAL2 }}>{s.suffix}</span>
            </div>
            <div style={{ color: DIM, fontSize: 14, marginTop: 8, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Scene3() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${TEAL}, ${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, flexShrink: 0 }}
      >
        <span style={{ color: NAVY, fontWeight: 900, fontSize: 32, fontFamily: "'Inter', sans-serif" }}>S</span>
      </motion.div>

      <div style={{ overflow: "hidden" }}>
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "circOut" }}
          style={{ color: WHITE, fontSize: 22, fontWeight: 500, textAlign: "center", fontFamily: "'Inter', sans-serif", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}
        >
          Meet Sarah
        </motion.div>
      </div>

      <div style={{ overflow: "hidden" }}>
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: "circOut" }}
          style={{ color: TEAL, fontSize: 50, fontWeight: 900, textAlign: "center", fontFamily: "'Inter', sans-serif", letterSpacing: -1, lineHeight: 1.1 }}
        >
          Your AI Receptionist
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{ marginTop: 20, display: "flex", gap: 24 }}
      >
        {["Answers every call", "Qualifies buyers", "Syncs VaultRE", "Emails transcripts"].map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            style={{ display: "flex", alignItems: "center", gap: 7, color: WHITE, fontSize: 13, fontFamily: "'Inter', sans-serif" }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
            {feat}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1 }}
        style={{ marginTop: 28, padding: "8px 18px", borderRadius: 30, background: `${TEAL}22`, border: `1px solid ${TEAL}55`, color: TEAL, fontSize: 14, fontFamily: "'Inter', sans-serif" }}
      >
        ● Online 24/7 — always on
      </motion.div>
    </div>
  );
}

function Scene4() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
      <div style={{ overflow: "hidden", marginBottom: 40 }}>
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.45, ease: "circOut" }}
          style={{ color: WHITE, fontSize: 34, fontWeight: 800, textAlign: "center", fontFamily: "'Inter', sans-serif" }}
        >
          Results agencies see from day one.
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, width: "100%" }}>
        {[
          { num: 10, suffix: "s", label: "Average answer time" },
          { num: 100, suffix: "%", label: "Calls answered, every time" },
          { num: 0, suffix: "", label: "Missed leads after hours" },
          { num: 299, suffix: "/mo", label: "From — no lock-in contracts" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.45, ease: "circOut" }}
            style={{
              background: `${TEAL}0d`, border: `1px solid ${TEAL}2a`,
              borderRadius: 14, padding: "20px 24px",
            }}
          >
            <div style={{ color: TEAL, fontSize: 44, fontWeight: 900, fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
              {i === 0 ? "< " : i === 3 ? "$" : ""}
              <AnimatedCounter to={s.num} suffix={s.suffix} />
            </div>
            <div style={{ color: DIM, fontSize: 13, marginTop: 6, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Scene5() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div style={{ fontSize: 13, letterSpacing: 4, color: TEAL, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", marginBottom: 16 }}>
          DIRECTIVE OS
        </div>
        <div style={{ color: WHITE, fontSize: 52, fontWeight: 900, textAlign: "center", fontFamily: "'Inter', sans-serif", letterSpacing: -1, lineHeight: 1.1 }}>
          Never miss a lead again.
        </div>
        <div style={{ color: DIM, fontSize: 20, marginTop: 16, fontFamily: "'Inter', sans-serif" }}>
          AI Receptionist for Australian Real Estate Agencies
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: 36, padding: "16px 44px", borderRadius: 50,
            background: `linear-gradient(135deg, ${TEAL}, ${TEAL2})`,
            color: NAVY, fontWeight: 800, fontSize: 20, fontFamily: "'Inter', sans-serif",
            boxShadow: `0 0 40px ${TEAL}55`,
          }}
        >
          directiveos.com.au
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ marginTop: 16, color: DIM, fontSize: 15, fontFamily: "'Inter', sans-serif" }}
        >
          From $299/month · No lock-in · Australian owned
        </motion.div>
      </motion.div>
    </div>
  );
}

const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5];

export default function VideoAd() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setScene(s => (s + 1) % TOTAL_SCENES);
    }, SCENE_DURATION);
  };

  useEffect(() => {
    if (playing) startTimer();
    else if (timer.current) clearInterval(timer.current);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing]);

  const SceneComponent = SCENES[scene];

  return (
    <div style={{ minHeight: "100vh", background: "#111", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ marginBottom: 16, color: "#555", fontSize: 12, fontFamily: "monospace", letterSpacing: 2 }}>
        DIRECTIVE OS · 15-SECOND GOOGLE ADS CLIP · 16:9
      </div>

      {/* 16:9 video canvas */}
      <div style={{ position: "relative", width: "min(100%, 1024px)", aspectRatio: "16/9", background: NAVY2, borderRadius: 12, overflow: "hidden", boxShadow: "0 0 80px rgba(0,209,178,0.15)" }}>
        <GridLines />

        {/* Animated ambient gradient */}
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-20%", right: "-10%", width: "50%", height: "70%", borderRadius: "50%", background: `radial-gradient(circle, ${TEAL}15 0%, transparent 70%)`, pointerEvents: "none" }}
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "45%", height: "60%", borderRadius: "50%", background: `radial-gradient(circle, ${TEAL}10 0%, transparent 70%)`, pointerEvents: "none" }}
        />

        {/* Scene */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={scene}
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.45, ease: "circInOut" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <SceneComponent />
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `${TEAL}22` }}>
          <motion.div
            key={scene}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: SCENE_DURATION / 1000, ease: "linear" }}
            style={{ height: "100%", background: `linear-gradient(90deg, ${TEAL}, ${TEAL2})` }}
          />
        </div>

        {/* Scene dots */}
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7 }}>
          {SCENES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setScene(i); if (playing) startTimer(); }}
              style={{ width: i === scene ? 22 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer", background: i === scene ? TEAL : `${TEAL}44`, transition: "all 0.3s", padding: 0 }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={() => setPlaying(p => !p)}
          style={{ padding: "10px 28px", borderRadius: 30, border: `1px solid ${TEAL}55`, background: `${TEAL}11`, color: TEAL, fontFamily: "'Inter', sans-serif", fontSize: 14, cursor: "pointer" }}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        {SCENES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setScene(i); if (playing) startTimer(); }}
            style={{ padding: "10px 16px", borderRadius: 30, border: `1px solid ${scene === i ? TEAL : "#333"}`, background: scene === i ? `${TEAL}22` : "transparent", color: scene === i ? TEAL : "#555", fontFamily: "monospace", fontSize: 12, cursor: "pointer" }}
          >
            Scene {i + 1}
          </button>
        ))}
        <span style={{ color: "#444", fontSize: 12, fontFamily: "monospace", marginLeft: 8 }}>
          To export: fullscreen → screen record at 1280×720
        </span>
      </div>
    </div>
  );
}

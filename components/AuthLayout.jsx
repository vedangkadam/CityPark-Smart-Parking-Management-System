const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { MapPin, Zap, ShieldCheck } from "lucide-react";

const HERO_IMAGE =
  "https://media.db.com/images/public/6ab66ad1ce89ca33ff6eda00/7a86178da_generated_image.png";
const LOGO =
  "https://media.db.com/images/public/6ab66ad1ce89ca33ff6eda00/17ce08a44_image.png";

const HIGHLIGHTS = [
  {
    icon: MapPin,
    title: "Verified spots nearby",
    text: "Live availability from trusted lots across Maharashtra.",
  },
  {
    icon: Zap,
    title: "Book in seconds",
    text: "Pick your slot, pay, and get an instant entry pass.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    text: "UPI and card checkout with free cancellation.",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const DOTS_MASK = "radial-gradient(ellipse at 50% 0%, black 5%, transparent 65%)";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[0.95fr_1fr] lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — desktop & tablet */}
      <aside className="relative hidden md:flex flex-col justify-between overflow-hidden p-8 lg:p-12 xl:p-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 animate-gradient-pan"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(30,27,75,0.96), rgba(49,46,129,0.86) 40%, rgba(79,70,229,0.78) 70%, rgba(139,92,246,0.72))",
            backgroundSize: "220% 220%",
          }}
        />

        {/* Drifting colour orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-16 -left-12 w-72 h-72 rounded-full bg-[#8B5CF6]/40 blur-3xl animate-drift" />
          <div className="absolute bottom-8 -right-20 w-80 h-80 rounded-full bg-[#4F46E5]/45 blur-3xl animate-float-slow" />
        </div>

        {/* Shine sweep */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-y-0 w-[35%] animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent blur-lg" />
        </div>

        <Link to="/" className="relative inline-flex items-center gap-2.5 w-fit">
          <Image src={LOGO} alt="CityPark" fittingType="fit" className="w-10 h-10 rounded-xl" />
          <span className="font-heading font-extrabold text-xl text-white tracking-tight">
            CityPark
          </span>
        </Link>

        <motion.div
          className="relative max-w-md"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.h2
            variants={fadeUp}
            className="font-heading font-extrabold text-3xl lg:text-4xl xl:text-[2.75rem] leading-[1.1] text-white tracking-tight"
          >
            Parking, without the circling.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/75 leading-relaxed">
            Reserve a spot before you leave home — from independent lots across Maharashtra, all in
            one place.
          </motion.p>

          <div className="mt-8 lg:mt-10 space-y-4 lg:space-y-5">
            {HIGHLIGHTS.map(({ icon: HighlightIcon, title: hTitle, text }) => (
              <motion.div key={hTitle} variants={fadeUp} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <HighlightIcon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{hTitle}</p>
                  <p className="text-sm text-white/65 mt-0.5 leading-relaxed">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="relative text-xs text-white/50">
          Trusted by drivers and lot owners across Maharashtra
        </p>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-background">
        {/* Ambient animated background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-28 -left-28 w-[26rem] h-[26rem] rounded-full bg-primary/25 blur-3xl animate-drift" />
          <div className="absolute top-1/4 -right-28 w-[22rem] h-[22rem] rounded-full bg-[#8B5CF6]/20 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-36 left-1/3 w-[28rem] h-[28rem] rounded-full bg-[#06B6D4]/15 blur-3xl animate-float-slower" />
        </div>
        <div
          className="cp-dot-grid pointer-events-none absolute inset-0 text-foreground/5"
          aria-hidden="true"
          style={{ WebkitMaskImage: DOTS_MASK, maskImage: DOTS_MASK }}
        />

        {/* Compact brand header — mobile */}
        <div className="relative overflow-hidden md:hidden safe-top">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4F46E5]" />
          <div
            className="absolute inset-0 animate-gradient-pan opacity-80"
            style={{
              backgroundImage: "linear-gradient(110deg, #4F46E5, #8B5CF6, #312E81, #4F46E5)",
              backgroundSize: "220% 220%",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-[#8B5CF6]/50 blur-3xl animate-float-slow" />
            <div className="absolute inset-y-0 w-[35%] animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md" />
          </div>
          <div className="relative px-6 pt-9 pb-11">
            <Link to="/" className="inline-flex items-center gap-2">
              <Image src={LOGO} alt="CityPark" fittingType="fit" className="w-9 h-9 rounded-xl" />
              <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                CityPark
              </span>
            </Link>
            <p className="text-white/80 text-sm mt-3">
              Reserve your parking spot before you leave home.
            </p>
          </div>
        </div>

        <div className="relative flex-1 flex items-center justify-center px-5 py-10 lg:px-12 lg:py-16">
          <div className="w-full max-w-md">
            <motion.div
              className="mb-8"
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                <span
                  className="absolute inset-0 rounded-2xl bg-primary/25 animate-pulse-soft"
                  aria-hidden="true"
                />
                <Icon className="relative w-6 h-6" aria-hidden="true" />
              </div>
              <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground">
                {title}
              </h1>
              {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
            </motion.div>

            <motion.div
              className="relative overflow-hidden bg-card rounded-3xl border border-border shadow-xl shadow-primary/10"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
            >
              <div
                className="h-1 animate-gradient-pan"
                style={{
                  backgroundImage: "linear-gradient(90deg, #4F46E5, #8B5CF6, #06B6D4, #4F46E5)",
                  backgroundSize: "220% 100%",
                }}
              />
              <div className="p-6 sm:p-8">{children}</div>
            </motion.div>

            {footer && (
              <motion.p
                className="text-center text-sm text-muted-foreground mt-6"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                {footer}
              </motion.p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
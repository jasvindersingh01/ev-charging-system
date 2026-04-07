import { motion } from "framer-motion";
import { Zap, MapPin, BatteryCharging, ArrowRight, ChevronDown } from "lucide-react";
import evImg from "../../assets/ev.avif";

function Hero() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
    }),
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 text-gray-900 flex items-center overflow-hidden">

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-50/20 to-transparent rounded-full" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #0891b2 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="max-w-xl">

            {/* Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50 border border-cyan-200/60 text-cyan-700 rounded-full text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Now live in 200+ cities
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="mt-6 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight"
            >
              Power Your{" "}
              <span className="relative">
                Journey
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>{" "}
              with{" "}
              <span className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Voltify
                <Zap className="inline-block ml-1 w-8 h-8 md:w-10 md:h-10 text-cyan-500 -mt-2" />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-6 text-gray-500 text-lg md:text-xl leading-relaxed max-w-md"
            >
              Discover nearby EV charging stations, book slots instantly, and charge
              smarter — all from one seamless platform.
            </motion.p>

            {/* CTA BUTTONS */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mt-10 flex flex-wrap gap-4"
            >
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Find Stations
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button className="px-8 py-4 border-2 border-gray-200 hover:border-cyan-400 hover:text-cyan-600 rounded-2xl font-semibold transition-all duration-300 hover:shadow-md hover:shadow-cyan-100/50 bg-white/50 backdrop-blur-sm">
                Learn More
              </button>
            </motion.div>

            {/* FEATURES */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-12 flex flex-wrap gap-8"
            >
              {[
                { icon: Zap, label: "Fast Charging", sub: "Up to 350kW" },
                { icon: MapPin, label: "Nearby Stations", sub: "Real-time map" },
                { icon: BatteryCharging, label: "Smart Booking", sub: "Zero wait" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-3 group cursor-default">
                  <div className="p-2.5 bg-cyan-50 border border-cyan-100 rounded-xl group-hover:bg-cyan-100 group-hover:scale-110 transition-all duration-300">
                    <Icon size={18} className="text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 via-blue-200/20 to-transparent rounded-[2rem] blur-2xl scale-110" />

            {/* Main image container */}
            <div className="relative">
              <img
                src={evImg}
                alt="EV Charging"
                className="relative z-10 w-full max-w-lg lg:max-w-xl xl:max-w-2xl rounded-[2rem] shadow-2xl shadow-gray-300/40 object-cover ring-1 ring-gray-200/50"
              />

              {/* Floating card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -left-6 top-1/4 z-20 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl p-4 shadow-xl shadow-gray-200/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-xl">
                    <BatteryCharging size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Charging</p>
                    <p className="text-xs text-green-500 font-medium">87% Complete</p>
                  </div>
                </div>
                <div className="mt-3 w-36 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "87%" }}
                    transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute -right-4 bottom-16 z-20 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl p-4 shadow-xl shadow-gray-200/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-xl">
                    <MapPin size={20} className="text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">3 Stations</p>
                    <p className="text-xs text-gray-400">Within 2km radius</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative ring */}
              <div className="absolute -z-10 -inset-4 rounded-[2.5rem] border-2 border-dashed border-cyan-200/40 animate-[spin_30s_linear_infinite]" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </motion.div>
    </section>
  );
}

export default Hero;
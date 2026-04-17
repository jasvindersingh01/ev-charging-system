import { motion } from "framer-motion";
import { MapPin, CalendarCheck, Zap, ArrowRight } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: MapPin,
      title: "Find a Station",
      description: "Search nearby EV charging stations on our real-time map. Filter by availability, distance, and charger type.",
      color: "cyan",
    },
    {
      step: "02",
      icon: CalendarCheck,
      title: "Book a Slot",
      description: "Pick your preferred time slot and book instantly. No waiting, no hassle — your charger is reserved.",
      color: "blue",
    },
    {
      step: "03",
      icon: Zap,
      title: "Charge & Go",
      description: "Arrive at the station, plug in, and charge. Pay at the station and get back on the road.",
      color: "violet",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50 border border-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
            <Zap size={14} />
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Book your EV charging slot in 3 easy steps. Fast, simple, and hassle-free.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">

          {/* Connecting Line - Desktop */}
          <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-cyan-200 via-blue-200 to-violet-200" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="relative"
              >
                <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group h-full">

                  {/* Step Number + Icon */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`relative h-14 w-14 rounded-2xl bg-${item.color}-50 border border-${item.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon size={24} className={`text-${item.color}-600`} />

                      {/* Step badge */}
                      <span className={`absolute -top-2 -right-2 h-6 w-6 rounded-full bg-${item.color}-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md`}>
                        {item.step}
                      </span>
                    </div>

                    {/* Arrow between steps - Desktop only */}
                    {i < 2 && (
                      <div className="hidden md:flex absolute -right-3 top-24 z-10">
                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                          <ArrowRight size={14} className="text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Mobile connector */}
                {i < 2 && (
                  <div className="md:hidden flex justify-center my-2">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-gray-200 to-gray-100 rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
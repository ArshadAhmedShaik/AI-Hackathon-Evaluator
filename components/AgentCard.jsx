"use client";

import { motion } from "framer-motion";

export default function AgentCard({ icon, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 rounded-2xl border border-slate-700 p-6"
    >
      <div className="text-4xl mb-3">{icon}</div>

      <h2 className="font-bold text-xl">{title}</h2>

      <p className="text-slate-400 mt-2">
        {subtitle}
      </p>

      <div className="mt-4 text-green-400">
        ✔ Completed
      </div>
    </motion.div>
  );
}
"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";

/* Chaque page arrive en glissant légèrement vers le haut. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
      {children}
    </motion.div>
  );
}

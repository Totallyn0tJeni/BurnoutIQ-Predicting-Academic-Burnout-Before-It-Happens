import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Activity, Brain, Shield, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

      {/* Nav */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">BurnoutIQ</span>
        </div>
        <Link href="/">
          <Button variant="ghost" className="font-medium hover:bg-primary/5 hover:text-primary">
            Enter App
          </Button>
        </Link>
      </nav>
      
      {/* Hero */}
      <main className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
              Predictive Academic Analytics
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Stop burnout <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                before it hits.
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              An AI-powered system that analyzes your workload, sleep, and habits to predict burnout risk and provide actionable interventions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Link href="/">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 w-full"
        >
          <div className="relative">
            {/* Abstract UI representation */}
            <div className="bg-card rounded-3xl p-6 shadow-2xl border border-border/50 relative z-10 glass-card">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-muted rounded-full animate-pulse" />
                  <div className="h-3 w-20 bg-muted/50 rounded-full animate-pulse" />
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl border border-primary/10 flex items-end p-4 gap-2">
                  {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <Brain className="w-6 h-6 text-primary mb-2" />
                    <div className="h-4 w-16 bg-muted rounded-full mb-1" />
                    <div className="h-6 w-12 bg-muted/50 rounded-full" />
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <Activity className="w-6 h-6 text-blue-500 mb-2" />
                    <div className="h-4 w-16 bg-muted rounded-full mb-1" />
                    <div className="h-6 w-12 bg-muted/50 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decor elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

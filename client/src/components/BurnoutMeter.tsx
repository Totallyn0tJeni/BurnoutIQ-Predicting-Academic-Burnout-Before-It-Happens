import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface BurnoutMeterProps {
  score: number;
}

export function BurnoutMeter({ score }: BurnoutMeterProps) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  let color = "hsl(var(--risk-low))"; // Low
  let label = "Low Risk";
  
  if (score > 30) {
    color = "hsl(var(--risk-moderate))"; // Moderate
    label = "Moderate Risk";
  }
  if (score > 60) {
    color = "hsl(var(--risk-high))"; // High
    label = "High Risk";
  }

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              <Cell key="score" fill={color} />
              <Cell key="bg" fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-4xl font-bold tracking-tighter" 
          style={{ color }}
        >
          {score}
        </motion.div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">Score</p>
      </div>

      <div className="mt-[-20px] text-center">
        <span 
          className="px-4 py-1.5 rounded-full text-sm font-bold border"
          style={{ 
            color, 
            borderColor: color,
            backgroundColor: `${color}15` 
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

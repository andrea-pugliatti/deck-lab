import { Compass, HelpCircle, Star } from "lucide-react";
import { useNavigate } from "react-router";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[75vh] flex-col items-center justify-center px-6 py-12 select-none">
      <div className="bg-cyan-accent/5 animate-pulse-glow pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[100px]"></div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="perspective-1000">
          <div
            className="hover-hologram bg-dark-bg border-border-dim/60 animate-float-center hover:border-gold-accent/40 relative flex h-96 w-64 flex-col justify-between rounded-xl border p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(226,197,111,0.15)] sm:h-105 sm:w-70 sm:p-4"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display truncate text-xs font-black tracking-wide text-white uppercase sm:text-sm">
                404: Lost in Lab
              </span>
              <Badge variant="trap" className="shrink-0 px-1.5 py-0.5 text-[8px] sm:text-[9px]">
                ERROR
              </Badge>
            </div>

            <div className="mt-1 flex min-h-3 gap-0.5">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="fill-gold-accent text-gold-accent h-3 w-3" />
              ))}
            </div>

            <div className="border-border-dim/60 bg-dark-surface-elevated/20 group relative my-2.5 flex flex-1 items-center justify-center overflow-hidden rounded border">
              <div className="bg-radial-to-b from-dark-surface-elevated/40 to-dark-bg/80 absolute inset-0 via-transparent opacity-60"></div>
              <HelpCircle className="text-cyan-accent/80 h-16 w-16 drop-shadow-[0_0_15px_rgba(95,227,217,0.4)] sm:h-20 sm:w-20" />
            </div>

            <div className="bg-dark-surface/80 border-border-dim/40 mb-2 rounded border p-2">
              <span className="text-gold-accent mb-0.5 block text-[8px] leading-none font-bold tracking-wide uppercase sm:text-[9px]">
                [Portal / Glitch]
              </span>
              <p className="line-clamp-4 text-[7.5px] leading-normal font-light text-slate-300 sm:text-[8.5px]">
                This page has been banished to the Shadow Realm. Neither player can activate the
                effect of this URL. If you entered this path manually, check your spelling.
              </p>
            </div>

            <div className="bg-dark-surface-elevated/40 border-border-dim/40 flex items-center justify-between rounded border px-2 py-1 text-[8.5px] font-bold text-slate-300 sm:text-[9.5px]">
              <span className="flex items-center gap-0.5">
                ATK: <span className="font-mono text-white">404</span>
              </span>
              <span className="flex items-center gap-0.5">
                DEF: <span className="font-mono text-white">404</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full max-w-sm">
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            size="lg"
            className="w-full shadow-lg"
          >
            <Compass className="h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}

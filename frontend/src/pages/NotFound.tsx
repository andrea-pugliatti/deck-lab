import { Compass, HelpCircle, Star } from "lucide-react";
import { Link } from "react-router";

import Badge from "../components/ui/Badge";
import { getButtonClasses } from "../components/ui/Button";

/**
 * NotFound Page Component.
 *
 * Renders a custom 404 error page themed as a Yu-Gi-Oh! card layout. Displays a banished card animation
 * and includes a CTA link to navigate back to the home route.
 *
 * @returns {React.JSX.Element} The rendered NotFound error page.
 */
export default function NotFound(): React.JSX.Element {
  return (
    <div className="relative flex min-h-[75vh] flex-col items-center justify-center px-6 py-12 select-none">
      <div className="bg-cyan-accent/5 animate-pulse-glow blur-ambient-sm pointer-events-none absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"></div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="perspective-card">
          <div className="hover-hologram bg-dark-bg border-border-dim/60 animate-float-center hover:border-gold-accent/40 shadow-modal hover:shadow-glow-gold-lg hover:scale-hover relative flex h-96 w-64 flex-col justify-between rounded-xl border p-3.5 transition-all duration-300 transform-3d sm:h-105 sm:w-70 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="font-display truncate text-xs font-black tracking-wide text-white uppercase sm:text-sm">
                404: Lost in Lab
              </span>
              <Badge variant="trap" className="text-2xs shrink-0 px-1.5 py-0.5">
                ERROR
              </Badge>
            </div>

            <div className="mt-1 flex min-h-3 gap-0.5">
              {[...Array(4)].map((_, i) => (
                <Star
                  key={i}
                  className="fill-gold-accent text-gold-accent size-3"
                  aria-hidden="true"
                />
              ))}
            </div>

            <div className="border-border-dim/60 bg-dark-surface-elevated/20 group relative my-2.5 flex flex-1 items-center justify-center overflow-hidden rounded border">
              <div className="from-dark-surface-elevated/40 to-dark-bg/80 absolute inset-0 bg-radial via-transparent opacity-60"></div>
              <HelpCircle
                className="text-cyan-accent/80 drop-shadow-glow-cyan size-16 sm:size-20"
                aria-hidden="true"
              />
            </div>

            <div className="bg-dark-surface/80 border-border-dim/40 mb-2 rounded border p-2">
              <span className="text-gold-accent text-2xs mb-0.5 block leading-none font-bold tracking-wide uppercase">
                [Portal / Glitch]
              </span>
              <p className="text-2xs line-clamp-4 leading-normal font-light text-slate-300">
                This page has been banished to the Shadow Realm. Neither player can activate the
                effect of this URL. If you entered this path manually, check your spelling.
              </p>
            </div>

            <div className="bg-dark-surface-elevated/40 border-border-dim/40 text-2xs flex items-center justify-between rounded border px-2 py-1 font-bold text-slate-300">
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
          <Link
            to="/"
            viewTransition
            className={`${getButtonClasses({ variant: "primary", size: "lg" })} w-full no-underline shadow-lg`}
          >
            <Compass className="size-4" aria-hidden="true" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

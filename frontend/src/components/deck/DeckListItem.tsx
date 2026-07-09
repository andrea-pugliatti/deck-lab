import { Link } from "react-router";

import { getCardTheme } from "../../utils/card";
import Badge from "../ui/Badge";
import type { DeckGridItemProps } from "./DeckGridItem";

/**
 * DeckListItem component displays an individual card representation inside a deck list row.
 * It showcases the cropped artwork illustration, quantity count, name, and themed type badge.
 * Matches the prop contract of {@link DeckGridItem} for seamless grid/list layout switching.
 *
 * @param props - The component properties.
 * @returns The rendered deck list row item.
 */
export default function DeckListItem({
  cardId,
  name,
  type,
  imageUrl,
  quantity,
}: DeckGridItemProps) {
  const { badgeVariant } = getCardTheme(type);

  return (
    <Link
      to={`/cards/${cardId}`}
      viewTransition
      className="group bg-dark-surface-elevated/40 hover:bg-dark-surface-elevated border-border-dim hover:border-border-glow relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border p-2.5 no-underline transition-all duration-200 hover:shadow-md"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="border-border-dim/40 relative flex aspect-4/5 w-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-slate-900">
          {imageUrl ? (
            <img
              src={`/api/${imageUrl}`}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-[8px] font-bold text-slate-600 uppercase">
              {name.substring(0, 3)}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h4 className="group-hover:text-cyan-accent mb-1 line-clamp-1 font-sans text-xs font-bold text-white transition-colors duration-150">
            {name}
          </h4>
          {type && (
            <Badge
              variant={badgeVariant}
              className="px-1 py-0 text-[8px] tracking-wider uppercase select-none"
            >
              {type.replace(" Monster", "").replace(" Card", "")}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center pr-1">
        <span className="rounded border border-white/10 bg-slate-950 px-2 py-0.5 font-mono text-xs font-bold text-white shadow-inner select-none">
          x{quantity}
        </span>
      </div>
    </Link>
  );
}

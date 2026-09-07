import { ArrowLeft } from "lucide-react";
import React, { type ComponentType, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router";

/**
 * Props for the {@link BackLink} component.
 * Extends React Router's {@link LinkProps}, requiring either `label` or `children` for content.
 */
export interface BackLinkProps extends Omit<LinkProps, "children"> {
  to: LinkProps["to"];
  label?: ReactNode;
  children?: ReactNode;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

const BASE_BACK_LINK_CLASSES =
  "group inline-flex items-center gap-2 px-2.5 py-1 text-sm font-normal text-slate-400 no-underline transition-colors hover:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-accent focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg";

/**
 * Semantic back navigation primitive that renders an accessible link
 * featuring a smooth arrow hover animation and built-in view transition support.
 */
export const BackLink = React.forwardRef<HTMLAnchorElement, BackLinkProps>(
  (
    {
      to,
      label,
      children,
      className = "mb-8",
      viewTransition = true,
      icon: Icon = ArrowLeft,
      ...props
    },
    ref,
  ) => {
    const content = label ?? children;
    const combinedClassName = `${BASE_BACK_LINK_CLASSES} ${className}`.trim();

    return (
      <Link
        ref={ref}
        to={to}
        viewTransition={viewTransition}
        className={combinedClassName}
        {...props}
      >
        <Icon
          className="size-4 shrink-0 transition-transform group-hover:-translate-x-1"
          aria-hidden="true"
        />
        <span>{content}</span>
      </Link>
    );
  },
);

BackLink.displayName = "BackLink";

export default BackLink;

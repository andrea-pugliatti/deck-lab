import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import ErrorAlert from "./ErrorAlert";

/**
 * Props for the {@link InvalidIdState} component.
 */
export interface InvalidIdStateProps {
  resourceName: string;
  backTo: string;
  backLabel: string;
  title?: string;
  message?: string;
}

/**
 * Reusable feedback view displayed when a dynamic route parameter ID fails numeric validation.
 */
export default function InvalidIdState({
  resourceName,
  backTo,
  backLabel,
  title = `Invalid ${resourceName} ID`,
  message = `The requested ${resourceName.toLowerCase()} ID must be a valid numeric identifier.`,
}: InvalidIdStateProps): React.JSX.Element {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        to={backTo}
        viewTransition
        className="group mb-8 inline-flex items-center gap-2 px-2.5 py-1 text-sm font-normal text-slate-400 no-underline transition-colors hover:text-white"
      >
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-1"
          aria-hidden="true"
        />
        <span>{backLabel}</span>
      </Link>
      <ErrorAlert title={title} message={message} />
    </div>
  );
}

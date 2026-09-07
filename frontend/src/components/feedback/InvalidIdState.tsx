import BackLink from "../navigation/BackLink";
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
      <BackLink to={backTo} label={backLabel} />
      <ErrorAlert title={title} message={message} />
    </div>
  );
}

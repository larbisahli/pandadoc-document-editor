import clsx from "clsx";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("animate-pulse rounded-sm bg-gray-300/30", className)}
      {...props}
    />
  );
}

export { Skeleton };

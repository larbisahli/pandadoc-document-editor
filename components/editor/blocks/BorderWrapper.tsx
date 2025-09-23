import clsx from "clsx";

interface Props {
  active: boolean;
  children: React.ReactNode;
}

function BorderWrapper({ active, children }: Props) {
  return (
    <>
      {children}
      <div
        className={clsx(
          "dropzone-active pointer-events-none absolute inset-[-7] rounded-[2px]",
          active
            ? "border-[#248567]! opacity-35!"
            : "group-hover:border-[#e5e5e5]! group-hover:opacity-[1]!",
        )}
      />
    </>
  );
}

export default BorderWrapper;

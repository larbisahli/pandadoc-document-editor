import clsx from "clsx";

const DocumentFooter = () => {
  const isDoubleClicked = false;
  return (
    <div className="mt-[6px] h-12 w-full">
      <div className="mx-[50px] bg-transparent">
        <div
          className={clsx(
            "min-h-[65px] border border-gray-200 px-[50px] py-[12px]",
            !isDoubleClicked && "pointer-events-none",
          )}
        >
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default DocumentFooter;

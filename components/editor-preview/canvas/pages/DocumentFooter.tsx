import clsx from "clsx";

const DocumentFooter = () => {
  const isDoubleClicked = false;
  return (
    <div className="print-footer print-only mt-[6px] h-8 w-full">
      <div className="mx-[50px] bg-transparent">
        <div
          className={clsx(
            "px-[50px] py-[14px]",
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

import clsx from "clsx";

const DocumentHeader = () => {
  const isDoubleClicked = false;
  return (
    <div className="mb-[6px] h-12 min-h-[55px] w-full">
      <div className="mx-[50px] bg-transparent">
        <div
          className={clsx(
            "border border-gray-200 px-[50px] py-[20px]",
            !isDoubleClicked && "pointer-events-none",
          )}
        >
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;

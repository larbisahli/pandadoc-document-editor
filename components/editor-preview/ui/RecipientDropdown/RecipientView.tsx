import { RecipientType } from "@/interfaces/recipient";
import { selectActiveRecipientId } from "@/lib/features/recipient/recipientSlice";
import { useAppSelector } from "@/lib/hooks";
import { generateAvatarColors } from "@/utils/colors";
import { getInitials } from "@/utils/user-helpers";
import clsx from "clsx";
import { useMemo } from "react";

type RecipientProps = {
  recipient: RecipientType;
  onSelect?: (recipient: RecipientType) => void;
  isList?: boolean;
};

const RecipientView = ({ recipient, onSelect, isList }: RecipientProps) => {
  const selectedRecipientId = useAppSelector(selectActiveRecipientId);
  const fullname = `${recipient.firstName} ${recipient.lastName}`;
  const color = useMemo(
    () => generateAvatarColors(recipient.color, 0.5),
    [recipient.color],
  );
  const renderRecipient = () => {
    if (isList) {
      return (
        <div className="flex flex-col">
          <div className="flex">
            <span className="text-xs font-semibold">{fullname}</span>
            <span className="mx-1 text-xs font-semibold text-[#e44e48] capitalize">
              {recipient?.role}
            </span>
          </div>
          <span className="text-xs text-gray-400">{recipient.email}</span>
        </div>
      );
    }
    return (
      <>
        <span className="text-sm">{fullname}</span>
        {!isList && (
          <span
            className="mx-2 h-[8px] w-[8px] rounded-full"
            style={{ background: color.ringHex }}
          ></span>
        )}
      </>
    );
  };

  return (
    <div
      className={clsx(
        "flex items-center",
        selectedRecipientId === recipient?.id && isList && "bg-gray-100",
        isList && "cursor-pointer px-4 py-2 hover:bg-gray-100",
      )}
      onClick={() => onSelect?.(recipient)}
    >
      <div
        className="me-2 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[10px]"
        style={{
          color: color.textHex,
          background: color.bgRgba,
          borderColor: color.ringHex,
        }}
      >
        {getInitials(fullname)}
      </div>
      {renderRecipient()}
    </div>
  );
};

export default RecipientView;

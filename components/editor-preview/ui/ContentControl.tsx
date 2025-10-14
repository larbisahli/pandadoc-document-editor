import Tooltip from "@/components/ui/Tooltip";
import { selectDocPageIds } from "@/lib/features/document/documentSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import clsx from "clsx";
import {
  CopyPlus,
  Ellipsis,
  Paperclip,
  Plus,
  StickyNote,
  Trash2,
} from "lucide-react";
import { usePage } from "../canvas/context/PageContext";
import { useMemo } from "react";
import { Dropdown } from "./DropdownMenu";
import {
  deletePage,
  insertBlankPage,
} from "@/lib/features/thunks/documentThunks";

interface Props {
  renderIfLast?: boolean;
}

const ContentControl = ({ renderIfLast }: Props) => {
  const pageIds = useAppSelector(selectDocPageIds);
  const dispatch = useAppDispatch();
  const { pageId } = usePage();

  const { total, isFirst, isLast } = useMemo(() => {
    const total = pageIds.length;
    const index = pageIds.indexOf(pageId);
    return {
      index,
      total,
      isFirst: index === 0,
      isLast: index === total - 1,
    };
  }, [pageIds, pageId]);

  const handleAddBlankPage = () => {
    dispatch(
      insertBlankPage({
        targetPageId: pageId,
        isLast: !!renderIfLast,
      }),
    );
  };

  const handleDuplicatePage = () => {};

  const handleDeletePage = () => {
    dispatch(deletePage({ pageId }));
  };

  if (renderIfLast && !isLast) return null;

  return (
    <div className="mx-auto min-h-[45px] px-[8px] py-[14px]">
      <div
        className={clsx(
          "relative flex h-[24px] items-center",
          !renderIfLast ? "justify-between" : "justify-center",
        )}
      >
        <p className={clsx("text-sm font-medium text-gray-800")}>
          {isFirst &&
            !renderIfLast &&
            `${total} ${total > 1 ? "pages" : "page"}`}
        </p>
        <Dropdown align="center">
          <Tooltip content="Add content" placement="bottom">
            <Dropdown.Trigger asChild>
              <button className="text-muted hover:text-blue-primary rounded-[2px] p-[1px] hover:bg-gray-200">
                <Plus size={20} />
              </button>
            </Dropdown.Trigger>
          </Tooltip>
          <Dropdown.Content
            widthClassName="w-56"
            bottomOffset={renderIfLast ? 45 : undefined}
          >
            <Dropdown.Item
              className="group text-gray-600"
              onSelect={handleAddBlankPage}
            >
              <StickyNote
                size={18}
                className="mx-1 group-hover:text-blue-600"
              />
              Blank page
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item
              disabled
              className="group text-gray-600"
              onSelect={() => console.log("Upload file")}
            >
              <Paperclip size={18} className="mx-1" />
              Add attachment
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
        {!renderIfLast && (
          <Dropdown align="end">
            <Dropdown.Trigger asChild>
              <button className="text-muted rounded-[2px] p-[1px] hover:bg-gray-200">
                <Ellipsis size={20} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content widthClassName="w-48">
              <Dropdown.Item
                disabled
                className="text-gray-600"
                onSelect={handleDuplicatePage}
              >
                <CopyPlus size={18} className="mx-1 text-gray-600" />
                Duplicate page
              </Dropdown.Item>
              <Dropdown.Item
                className="group text-gray-600"
                onSelect={handleDeletePage}
              >
                <Trash2
                  size={18}
                  className="mx-1 text-gray-600 group-hover:text-red-600"
                />
                Delete page
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default ContentControl;

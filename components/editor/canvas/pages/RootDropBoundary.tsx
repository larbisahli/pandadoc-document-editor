import { PALETTE_DATA_FORMAT } from "@/components/dnd";
import { DropEvent, DropPayload } from "@/interfaces/dnd";
import { DropSide, TemplateTypes } from "@/interfaces/enum";
import { selectVisiblePageId } from "@/lib/features/layout/layoutSlice";
import { dropCommitted } from "@/lib/features/thunks/layoutThunks";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

type RootDropBoundaryProps = {
  children: React.ReactNode;
};

export function RootDropBoundary({ children }: RootDropBoundaryProps) {
  const activePageId = useAppSelector(selectVisiblePageId);
  const dispatch = useAppDispatch();

  // Keep cursor valid anywhere over the root
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault(); // allow drops on root if no child handles it
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent) => {
    const data = e.dataTransfer.getData(PALETTE_DATA_FORMAT);

    if (!data) return;
    const payload = JSON.parse(data) as DropPayload;

    // Ignore if it's field payload
    if (payload.kind === TemplateTypes.Block) {
      // Append to root
      const dropEvent: DropEvent = {
        pageId: activePageId!,
        side: DropSide.Bottom,
        payload,
        forceRoot: true,
      };
      dispatch(dropCommitted(dropEvent));
    }

    // claim the drop
    e.preventDefault();
  };

  return (
    <div onDragOver={onDragOver} onDrop={onDrop}>
      {children}
    </div>
  );
}

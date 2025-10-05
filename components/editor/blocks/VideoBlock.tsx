import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { Trash2, Upload, Youtube as YoutubeIcon } from "lucide-react";
import clsx from "clsx";
import { useClickOutside } from "../hooks/useClickOutside";
import BorderWrapper from "./BorderWrapper";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectInstance } from "@/lib/features/instance/instanceSlice";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import { usePage } from "../canvas/context/PageContext";
import YouTube, { YouTubeProps } from "react-youtube";
import { deleteBlockRef } from "@/lib/features/thunks/documentThunks";
import { selectPendingFocusInstanceId } from "@/lib/features/ui/uiSlice";
import { setActiveInstance } from "@/lib/features/rich-editor-ui/richEditorUiSlice";

function VideoBlock({ nodeId, instanceId }: BaseBlockProps) {
  const { pageId } = usePage();

  const instance = useAppSelector((state) => selectInstance(state, instanceId));
  const pendingFocusId = useAppSelector(selectPendingFocusInstanceId);

  const dispatch = useAppDispatch();

  const blockRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const onOutside = useCallback(() => {
    setActive(false);
    dispatch(setActiveInstance(null));
  }, [dispatch]);

  const ignoreSelectors = useMemo(
    () => ["[data-rich-editor-toolbar]", "#richEditorToolbar"],
    [],
  );

  useClickOutside(blockRef, onOutside, { enabled: active, ignoreSelectors });

  useEffect(() => {
    if (pendingFocusId === instanceId) {
      setActive(true);
    }
  }, [instanceId, pendingFocusId]);

  const videoId = "69bkCjl4jkQ";
  const autoplay = 0;

  const handleDelete = () => {
    dispatch(
      deleteBlockRef({
        pageId,
        nodeId,
        instanceId,
      }),
    );
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  };

  return (
    <div
      ref={blockRef}
      onClick={() => setActive(true)}
      className="group relative z-10"
    >
      <BorderWrapper active={active}>
        {!videoId ? (
          <div
            className={clsx(
              "flex min-h-[64px] cursor-pointer items-center justify-center bg-[#f7f7f7] text-[#767676]",
              active && "bg-[#e7e7e7]!",
            )}
          >
            <div className="mx-2 text-[#626262]">
              {active ? <Upload size={20} /> : <YoutubeIcon size={20} />}
            </div>
            <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
              Click to add a video
            </div>
          </div>
        ) : (
          <div className={clsx(!active && "pointer-events-none")}>
            <YouTube
              videoId={videoId}
              opts={{
                height: "403",
                width: "100%",
                playerVars: { autoplay },
              }}
              onReady={onPlayerReady}
            />
          </div>
        )}
      </BorderWrapper>
      <ActionsTooltip
        active={active}
        actions={[
          {
            key: "delete",
            label: "Delete",
            icon: <Trash2 size={18} />,
            danger: true,
            onSelect: handleDelete,
          },
        ]}
      />
    </div>
  );
}

export default memo(VideoBlock);

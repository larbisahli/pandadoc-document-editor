import { memo, useEffect, useRef, useState } from "react";
import { BaseBlockProps } from "../canvas/blocks/BlockRegistry";
import { Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";
import clsx from "clsx";
import BorderWrapper from "./BorderWrapper";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectInstance,
  updateInstanceDataField,
} from "@/lib/features/instance/instanceSlice";
import Image from "next/image";
import { ImageDataType } from "@/interfaces/common";
import { ActionsTooltip } from "@/components/ui/ActionsTooltip";
import { usePage } from "../canvas/context/PageContext";
import { deleteBlockRef } from "@/lib/features/thunks/documentThunks";

function ImageBlock({ nodeId, instanceId }: BaseBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { pageId } = usePage();

  const instance = useAppSelector((state) => selectInstance(state, instanceId));
  const dispatch = useAppDispatch();

  const data = instance.data as ImageDataType;

  const [natural, setNatural] = useState<{ w: number; h: number } | null>(
    data.width
      ? {
          w: data.width!,
          h: data.height!,
        }
      : null,
  );
  const [heightPx, setHeightPx] = useState<number | undefined | null>(
    data.height,
  );
  const [previewUrl, setPreviewUrl] = useState<string | undefined | null>(
    data?.url,
  );
  const [active, setActive] = useState(false);

  useClickOutside(blockRef, () => setActive(false));

  useEffect(() => {
    if (!data?.url) {
      setActive(true);
    }
  }, []);

  // Revoke the object URL when it changes or on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Compute wrapper height whenever wrapper width or natural dims change
  useEffect(() => {
    if (!wrapperRef.current || !natural) return;

    const el = wrapperRef.current;

    const compute = () => {
      const width = el.clientWidth || 0;
      if (!width) return;
      const nextH = (width * natural.h) / natural.w;
      // clamp & round
      setHeightPx(Math.max(1, Math.round(nextH)));
    };

    compute();

    const observer = new ResizeObserver(() => compute());
    observer.observe(el);

    return () => observer.disconnect();
  }, [natural]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];

    // revoke previous preview
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      setNatural(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const url = URL.createObjectURL(file);

    const probe = new window.Image();
    probe.onload = () => {
      const w = probe.naturalWidth;
      const h = probe.naturalHeight;

      setNatural({ w, h });
      setPreviewUrl(url);

      dispatch(
        updateInstanceDataField({
          instanceId,
          data: {
            url,
            name: file.name,
            type: file.type,
            size: file.size,
            width: w,
            height: h,
            aspectRatio: w / h,
          },
        }),
      );
    };
    probe.onerror = (e) => {
      console.log(e);
      URL.revokeObjectURL(url);
    };
    probe.src = url;

    // allow choosing the same file again
    if (inputRef.current) inputRef.current.value = "";
  };

  const openFileDialog = () => {
    console.log({ active });
    if (active) {
      inputRef.current?.click();
    }
  };

  const handleDelete = () => {
    dispatch(
      deleteBlockRef({
        pageId,
        nodeId,
        instanceId,
      }),
    );
  };

  return (
    <div
      ref={blockRef}
      onClick={() => setActive(true)}
      className="group relative"
    >
      <BorderWrapper active={active}>
        <div
          ref={wrapperRef}
          role="button"
          tabIndex={0}
          onClick={openFileDialog}
          className={clsx(
            "relative flex w-full cursor-pointer items-center justify-center overflow-hidden bg-[#f7f7f7] text-[#767676]",
            !previewUrl && "min-h-[64px]",
            active && "sbg-[#e7e7e7]!",
          )}
          aria-label="Click to upload an image"
          // style={
          //   previewUrl && heightPx ? { height: `${heightPx}px` } : undefined
          // }
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          {!previewUrl ? (
            <>
              <div className="mx-2 text-[#626262]">
                {active ? <Upload size={20} /> : <ImageIcon size={20} />}
              </div>
              <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                Click to upload an image
              </div>
            </>
          ) : (
            <Image
              src={previewUrl}
              alt="Selected image preview"
              width={data.width}
              height={data.height}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y6vYf8AAAAASUVORK5CYII="
              className="object-contain"
            />
          )}
        </div>
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

export default memo(ImageBlock);

import { DropOverlayWrapper } from "@/dnd";
import { useCallback } from "react";

export default function TextBlock({ nodeId }) {
  const handleDrop = useCallback((payload, side) => {
    console.log({ payload, side });
  }, []);

  return (
    <DropOverlayWrapper onDrop={handleDrop} className="bg-amber-100">
      <p>TextBlock-0</p>
      <DropOverlayWrapper onDrop={handleDrop} className="m-3 bg-blue-100">
        <p>TextBlock-1</p>
        <div className="flex">
          <DropOverlayWrapper onDrop={handleDrop} className="m-3 h-32 flex-1">
            <div className="h-full bg-red-400">1111111</div>
          </DropOverlayWrapper>
          <DropOverlayWrapper onDrop={handleDrop} className="h-full flex-1">
            <div className="h-full bg-green-400 p-3">
              <DropOverlayWrapper
                onDrop={handleDrop}
                className="m-3 h-32 flex-1"
              >
                <div className="h-full bg-red-100">2222-111</div>
              </DropOverlayWrapper>
              <DropOverlayWrapper
                onDrop={handleDrop}
                className="m-3 h-32 flex-1"
              >
                <div className="h-full bg-purple-400">2222-2222</div>
              </DropOverlayWrapper>
            </div>
          </DropOverlayWrapper>
        </div>
      </DropOverlayWrapper>
    </DropOverlayWrapper>
  );
}

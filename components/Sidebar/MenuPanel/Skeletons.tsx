import { Skeleton } from "@/components/ui/skeleton";

export const ContentLibraryPanelSkeleton = () => (
  <div className="h-full py-4">
    <div className="h-fit px-4">
      <Skeleton className="mb-3 h-[30px] w-full" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-[150px] max-w-[120px]" />
        <Skeleton className="h-[150px] max-w-[120px]" />
        <Skeleton className="h-[150px] max-w-[120px]" />
        <Skeleton className="h-[150px] max-w-[120px]" />
        <Skeleton className="h-[150px] max-w-[120px]" />
        <Skeleton className="h-[150px] max-w-[120px]" />
      </div>
    </div>
  </div>
);

export const DesignPanelSkeleton = () => (
  <div className="h-full py-4">
    <div className="h-full">
      <Skeleton className="m-3 mb-8 h-[30px] w-full" />
      <Skeleton className="m-3 h-[30px] w-full" />
      <Skeleton className="m-3 h-[30px] w-full" />
      <Skeleton className="m-3 h-[40px] w-full" />
      <Skeleton className="m-3 h-[40px] w-full" />
      <Skeleton className="m-3 h-[60px] w-full" />
    </div>
  </div>
);

export const VariablesPanelSkeleton = () => (
  <div className="h-full py-4">
    <div className="h-full">
      <Skeleton className="m-2 h-[30px] w-full" />
      <Skeleton className="m-2 h-[30px] w-full" />
      <Skeleton className="m-2 h-[30px] w-full" />
      <Skeleton className="m-2 h-[100px] w-full" />
      <Skeleton className="m-2 h-[100px] w-full" />
      <Skeleton className="m-2 h-[60px] w-full" />
    </div>
  </div>
);

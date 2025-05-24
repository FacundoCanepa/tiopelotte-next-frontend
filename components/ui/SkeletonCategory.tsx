import React from "react";
import { Skeleton } from "./skeleton";

const SkeletonCategory = () => {
  return (
    <div className="w-full h-[400px] flex justify-center items-center overflow-hidden">
      <div className="max-w-[600px] w-full mx-auto">
        <Skeleton className="h-[30vh] w-full" />
      </div>
    </div>
  );
};

export default SkeletonCategory;

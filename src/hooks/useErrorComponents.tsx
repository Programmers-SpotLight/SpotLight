import Forbidden from "@/components/error/Forbidden";
import InternalServer from "@/components/error/InternalServer";
import NotFound from "@/components/error/NotFound";
import { ForbiddenError, NotFoundError } from "@/utils/errors";
import React from "react";

const useErrorComponents = (error: Error | null) => {
  if (error instanceof ForbiddenError) {
    return <Forbidden />;
  } else if (error instanceof NotFoundError) {
    return <NotFound />;
  } else {
    return <InternalServer />;
  }
};

export default useErrorComponents;

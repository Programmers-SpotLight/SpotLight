import BadRequest from "@/components/error/BadRequest";
import Forbidden from "@/components/error/Forbidden";
import InternalServer from "@/components/error/InternalServer";
import NotFound from "@/components/error/NotFound";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/utils/errors";
import React from "react";

const useErrorComponents = (error: Error | null) => {
  if (error === null) return;

  let errorComponent;
  if (error instanceof BadRequestError) {
    errorComponent = <BadRequest />;
  } else if (error instanceof ForbiddenError) {
    errorComponent = <Forbidden />;
  } else if (error instanceof NotFoundError) {
    errorComponent = <NotFound />;
  } else {
    errorComponent = <InternalServer />;
  }

  return <div className={`h-[calc(100vh-74px)]`}>{errorComponent}</div>;
};

export default useErrorComponents;

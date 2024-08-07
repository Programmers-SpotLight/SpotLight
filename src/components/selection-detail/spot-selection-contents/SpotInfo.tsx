import React from "react";

interface ISpotInfo {
  description: string;
}

const SpotInfo = ({ description }: ISpotInfo) => {
  return <div className="whitespace-pre-wrap">{description}</div>;
};

export default SpotInfo;

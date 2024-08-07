import React from "react";

interface ISpotInfoProps {
  description: string;
}

const SpotInfo = ({ description }: ISpotInfoProps) => {
  return <div className="whitespace-pre-wrap">{description}</div>;
};

export default SpotInfo;

import PrivateUser from "@/components/other-user/PrivateUser";
import React from "react";

const user = {
  id: 1,
  isPrivate: false
};
const OtherUserPage = () => {
  return (
    <div className="border border-solid border-grey2  bg-grey0 w-[1024px] mx-auto h-[calc(100vh-74px)]">
      {user.isPrivate ? <PrivateUser /> : <div></div>}
    </div>
  );
};

export default OtherUserPage;

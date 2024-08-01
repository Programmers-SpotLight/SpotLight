import React, { useState } from "react";

interface ITabProps {
  children: React.ReactNode;
  title: string;
}

interface ITabsProps {
  children: React.ReactNode;
}

const Tab = ({ children }: ITabProps) => {
  return <>{children}</>;
};

const Tabs = ({ children }: ITabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = React.Children.toArray(
    children
  ) as React.ReactElement<ITabProps>[];

  return (
    <>
      <div className="flex gap-5 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.props.title}
            onClick={() => setActiveTab(index)}
            className={`${
              activeTab === index
                ? "text-primary underline underline-offset-4"
                : "text-grey3"
            } text-medium font-bold`}
          >
            {tab.props.title}
          </button>
        ))}
      </div>

      <div>{tabs[activeTab]}</div>
    </>
  );
};

export { Tab, Tabs };

// (file cha mới để chứa cả TicketList và TicketDashboard)
import React, { useState } from "react";
import { Tabs } from "antd";
import TicketList from "./TicketList";
import TicketDashboard from "./TicketDashboard/TicketDashboard";

const TicketManagement = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          {
            key: "dashboard",
            label: "Thống kê",
            children: <TicketDashboard />,
          },
          {
            key: "list",
            label: "Danh sách vé",
            children: <TicketList />,
          },
        ]}
      />
    </div>
  );
};

export default TicketManagement;

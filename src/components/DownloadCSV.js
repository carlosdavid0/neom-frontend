import { DownloadOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React from "react";

const DownloadCSV = ({ data, fileName }) => {
  const convertToCSV = (objArray) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    if (array.length > 0) {
      const keys = Object.keys(array[0]);
      let heading = "";
      for (let i = 0; i < keys.length; i++) {
        heading += `${keys[i]},`;
      }
      str += `${heading}\r\n`;
    }

    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in array[i]) {
        if (line !== "") line += ",";

        line += array[i][index];
      }
      str += line + "\r\n";
    }
    return str;
  };

  const downloadCSV = () => {
    const csvData = new Blob([convertToCSV(data)], { type: "text/csv" });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Tooltip title="Download CSV">
      <Button
        onClick={downloadCSV}
        type="primary"
        icon={<DownloadOutlined />}
      />
    </Tooltip>
  );
};

export default DownloadCSV;

import { Chart } from "react-google-charts";

const ChartSensor = () => {
  const data = [
    ["Status", "Total"],
    ["Active", 11],
    ["Idle", 2],
    ["Off", 2],
  ];

  const options = {
    title: "My Sensor",
    is3D: true,
  };

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
};

export default ChartSensor;

import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const LineChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (data && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      const newChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'Jumlah Arsip Baru',
              data: data.values,
              fill: false,
              backgroundColor: 'rgba(255, 206, 60, 0.91)',
              borderColor: 'rgba(255, 206, 60, 0.91)',
              borderWidth: 4,
            },
          ],
        },
        options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

      chartInstanceRef.current = newChartInstance;
    }
  }, [data]);

  return (
    <div className="chart-container bg-white p-3 rounded mb-3">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default LineChart;

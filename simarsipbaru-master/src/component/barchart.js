import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export const BarChart = ({ data, onBarClick, catalogIdMapping }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (data && chartRef.current) {
      try {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');

        const newChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.labels,
            datasets: [
              {
                label: 'Jumlah Kategori',
                data: data.values,
                backgroundColor: 'rgba(255, 206, 60, 0.91)',
                borderColor: 'rgba(255, 206, 60, 0.91)',
                borderWidth: 1,
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

        ctx.canvas.onclick = (event) => {
          const activePoints = newChartInstance.getElementsAtEventForMode(
            event,
            'nearest',
            { intersect: true },
            false,
            { axis: 'x' }
          );
          if (activePoints.length > 0) {
            const clickedElementIndex = activePoints[0].index;

            const clickedLabel = data.labels[clickedElementIndex];
            const archive_catalog_id = catalogIdMapping[clickedLabel];

            onBarClick(archive_catalog_id);
          }
        };

        chartInstanceRef.current = newChartInstance;
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }
  }, [data]);

  return (
    <div className="chart-container bg-white p-3 rounded mb-3">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

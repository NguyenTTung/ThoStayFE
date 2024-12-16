import Chart from 'react-apexcharts';

export interface ChartProps {
    data: {
        options: ApexCharts.ApexOptions;
        series: ApexAxisChartSeries | ApexNonAxisChartSeries; 
        type: "line" |"area" |"bar" |"pie" |"donut" |"radialBar" |"scatter" |"bubble" |"heatmap" |"candlestick" |"boxPlot" |"radar" |"polarArea" |"rangeBar" |"rangeArea" |"treemap";
        width?: string | number;
        height?:string | number;
        id?: string;
    }
}

export const MyChart: React.FC<ChartProps> = ({ data }) => {
    return (
        <div id={data.id}>
            <Chart options={data.options} series={data.series} type={data.type} width={data.width} height={data.height} />
        </div>
    );
}

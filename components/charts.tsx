import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const colorPalette = ["#1C8D70", "#249174", "#2C9478", "#34987D", "#3C9C81", "#44A085", "#4CA389", "#54A78D", "#5CAB92", "#64AF96", "#6DB29A", "#75B69E", "#7DBAA3", "#85BEA7", "#8DC1AB", "#95C5AF", "#9DC9B3", "#A5CDB8", "#ADD0BC", "#B5D4C0"];
const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
};

export function Donut(props: { data: any, title: string, type: string }) {
    const tab = props.data;
    let labels: string[] = [];
    let values: number[] = [];
    let colors: string[] = [];
    const totalColors = colorPalette.length;
    const interval = Math.floor(totalColors / tab.length);
    tab.forEach((d: any, i: number) => {
        labels.push(d.key);
        values.push(d.devices);
        colors.push(colorPalette[i * (interval - 1)]);
    })
    const chartData = {
        labels: labels,
        datasets: [{
            label: "Visiteurs",
            data: values,
            backgroundColor: colors,
            hoverOffset: 4
        }]
    }
    return (
        <div className="flex flex-col justify-between h-auto aspect-square bg-white p-8 rounded-lg shadow dark:border sm:max-w-2xl dark:bg-darkbg-800 dark:border-darkbg-700">
            <h3 className="text-lg mb-2 font-bold text-center leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white">{props.title}</h3>
            {props.type === "donut" ? <Doughnut data={chartData} options={options} /> : <Pie data={chartData} options={options} />}
        </div>

    )
}

export function VerticalBar(props: { data: any, title: string }) {
    const tab = props.data;
    let labels: string[] = [];
    let values: number[] = [];
    let colors: string[] = [];
    const totalColors = colorPalette.length;
    const interval = Math.floor(totalColors / tab.length);
    tab.forEach((d: any, i: number) => {
        labels.push(d.key);
        values.push(d.devices);
        colors.push(colorPalette[i * (interval - 1)]);
    })
    const chartData = {
        labels: labels,
        datasets: [{
            label: "Visiteurs",
            data: values,
            backgroundColor: colors,
            borderColor: ["#ffffff"],
            borderWidth: 2
        }]
    }
    return (
        <div className="flex flex-col justify-between h-auto aspect-square bg-white p-8 rounded-lg shadow dark:border sm:max-w-2xl dark:bg-darkbg-800 dark:border-darkbg-700">
            <h3 className="text-lg mb-2 font-bold text-center leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white">{props.title}</h3>
            <Bar data={chartData} options={options} />
        </div>
    )
}

export function LineChart(props: { data: any, title: string }) {
    const tab = props.data;
    let labels: string[] = [];
    let values: number[] = [];
    for (const [key, value] of Object.entries(tab)) {
        const date = new Date(key);
        labels.push(date.toLocaleDateString());
        values.push(value as number);
    }
    const chartData = {
        labels: labels,
        datasets: [{
            label: "Auditeurs",
            data: values,
            fill: false,
            borderColor: colorPalette[0],
            tension: 0.1
        }]
    }

    return (
        <div className="flex flex-col justify-between h-auto aspect-square bg-white p-8 rounded-lg shadow dark:border sm:max-w-2xl dark:bg-darkbg-800 dark:border-darkbg-700">
            <h3 className="text-lg mb-2 font-bold text-center leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white">{props.title}</h3>
            <Line data={chartData} options={options} />
        </div>
    )
}
import { BarChart } from '@mui/x-charts';
import CustomGradient from '../CustomGradient';

const formatStats = (stats: any[]) => {
	const xData: string[] = ['HP', 'Atk', 'Def', 'SpA', 'Spd', 'Spe'];
	const yData: number[] = [];
	stats.forEach((elem: any) => {yData.push(elem.base_stat);});
	const total = stats.reduce((accum, elem) => {return accum + elem.base_stat}, 0);

	return (
		<div className='flex flex-col h-full gap-0'>
			<p><u>Total:</u> {total}</p>
			<BarChart
				grid={{ horizontal: true }}
				tooltip={{ trigger: 'none' }}
				barLabel='value'
				xAxis={[{
					id: 'stats',
					data: xData,
					scaleType: 'band',
					disableTicks: true,
					colorMap: {
						type: 'ordinal',
						colors: [
							'url(#gradientHP)',
							'url(#gradientAtk)',
							'url(#gradientDef)',
							'url(#gradientSpA)',
							'url(#gradientSpD)',
							'url(#gradientSpe)'
						]
					}
				}]}
				series={[{ data: yData, type: 'bar' }]}
				slotProps={{
					loadingOverlay: { message: 'Cargando información' },
					noDataOverlay: { message: 'No hay información disponible' },
				}}
				sx={{
					'& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {fill: 'white'},
					'& .MuiChartsAxis-root .MuiChartsAxis-line': {stroke: 'white'},
					'& .MuiChartsAxis-left .MuiChartsAxis-tick': {stroke: 'white'},
					'.MuiChartsGrid-line': {stroke: 'gray'},
					'.MuiBarElement-root': {strokeWidth: 2},
					'.MuiBarElement-root:nth-of-type(1)': {stroke: '#448f0c'},
					'.MuiBarElement-root:nth-of-type(2)': {stroke: '#9b8510'},
					'.MuiBarElement-root:nth-of-type(3)': {stroke: '#97410c'},
					'.MuiBarElement-root:nth-of-type(4)': {stroke: '#0d7f9d'},
					'.MuiBarElement-root:nth-of-type(5)': {stroke: '#304591'},
					'.MuiBarElement-root:nth-of-type(6)': {stroke: '#8b1370'},
					'.MuiBarLabel-root': {fontWeight: 1000},
				}}>
				<defs>
					<CustomGradient>{{id: 'gradientHP', start: '#69dc12', end: '#a2db76'}}</CustomGradient>
					<CustomGradient>{{id: 'gradientAtk', start: '#efcc18', end: '#edda80'}}</CustomGradient>
					<CustomGradient>{{id: 'gradientDef', start: '#e86412', end: '#e5a27b'}}</CustomGradient>
					<CustomGradient>{{id: 'gradientSpA', start: '#14c3f1', end: '#81d9ef'}}</CustomGradient>
					<CustomGradient>{{id: 'gradientSpD', start: '#4a6adf', end: '#778ddd'}}</CustomGradient>
					<CustomGradient>{{id: 'gradientSpe', start: '#d51dad', end: '#d372bc'}}</CustomGradient>
				</defs>
			</BarChart>
		</div>
	)
}

export default function Stats(stats: any) {
	return (<><h2 className='text-xl'><strong>Estadísticas</strong></h2>{formatStats(stats.children)}</>)
}

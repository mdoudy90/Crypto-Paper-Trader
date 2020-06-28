import React from "react";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { AreaSeries, BarSeries, CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, EdgeIndicator } from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import {  createVerticalLinearGradient, hexToRGBA, last } from "react-stockcharts/lib/utils";

class ChartView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showCandleView: false,
			showVolume: false,
		}
	}
	render() {

		const { data: initialData, width, ratio, currentTimeScale = 'day' } = this.props;

		const MouseX = () =>
			<MouseCoordinateX
				at="bottom"
				orient="bottom"
				displayFormat={ currentTimeScale === 'day' ? timeFormat("%Y-%m-%d") : timeFormat("%Y-%m-%d %H:%M") }
			/>;

		const MouseY = ({ position, display }) =>
			<MouseCoordinateY at={position} orient={position} displayFormat={format(display)} />;

		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData);
		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 250)]);
		const xExtents = [start, end];

		const canvasGradient = createVerticalLinearGradient([
			{ stop: 0, color: hexToRGBA("#b5d0ff", 0.0) },
			{ stop: 0.7, color: hexToRGBA("#6fa4fc", 0.3) },
			{ stop: 1, color: hexToRGBA("#4286f4", 0.6) },
		]);

		return (
			<div className = 'chart-view-container'>

					<div className = 'chart-type-toggle'>
						<img src = './assets/linegraph-icon.png' ></img>
						<div className = { this.state.showCandleView ? 'toggle-switch-active' : 'toggle-switch' } >
							<div
								className = { this.state.showCandleView ? 'slider-active' : 'slider' }
								onClick = { () => this.setState({ showCandleView: !this.state.showCandleView }) } ></div>
						</div>
						<img src = './assets/candlestick-icon.png' ></img>
					</div>

					<div className = 'volume-type-toggle'>
						<img src = './assets/volume-unselected-icon.png' ></img>
						<div className = { this.state.showVolume ? 'toggle-switch-active' : 'toggle-switch' } >
							<div
								className = { this.state.showVolume ? 'slider-active' : 'slider' }
								onClick = { () => { this.setState({ showVolume: !this.state.showVolume }) } } ></div>
						</div>
						<img src = './assets/volume-selected-icon.png' ></img>
					</div>

				<ChartCanvas
					height={500}
					ratio={ratio}
					width={1050}
					margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
					seriesName="Crypto-Standard-View"
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					xExtents={xExtents}
				>

					{ this.state.showCandleView ?

							<Chart id={0} yExtents={d => [d.high, d.low]}>
								<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
								<YAxis axisAt="right" orient="right" ticks={5} />
								<MouseX />
								<MouseY position={"right"} display={".2f"} />
								<EdgeIndicator itemType="last" orient="right" edgeAt="right"
									yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>
								<CandlestickSeries />
								<OHLCTooltip forChart={0} origin={[-40, 0]} />
							</Chart> :

							<Chart id={1} yExtents={d => d.close}>
									<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
									<YAxis axisAt="right" orient="right" />
									<MouseX />
									<MouseY position={"right"} display={".2f"} />
									<EdgeIndicator itemType="last" orient="right" edgeAt="right"
									yAccessor={d => d.close} fill={d => "#4286f4"}/>
									<AreaSeries
										yAccessor={d => d.close}
										strokeWidth={1}
										canvasGradient={canvasGradient}
									/>
									<OHLCTooltip forChart={1} origin={[-40, 0]} />
							</Chart> }

					{ this.state.showVolume &&

							<Chart id={2} origin={(w, h) => [0, h - 150]} height={150} yExtents={d => d.volume}>
								<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>
								<MouseX />
								<MouseY position={"left"} display={".4s"} />
								<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? 'rgba(41, 163, 41,0.3)' : 'rgba(255,0,0,0.3)'} />
							</Chart> }

					<CrossHairCursor />
				</ChartCanvas>
			</div>
		);
	}
}

ChartView = fitWidth(ChartView);

export default ChartView;
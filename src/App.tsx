import React, { useRef, useState } from "react";
import { useSpring, animated, config } from "react-spring";

import calculatePathSmooth from "./smoothPath";
import { IMetricChartData } from "./types";
import graphHelper from "./metricChartGraphHelper";
import metricsData from "./metrics.json";

type IMetricProps = {
  dataPoints: IMetricChartData;
  lineColor: string;
};

const Metric: React.FC<IMetricProps> = ({ dataPoints, lineColor }) => {
  // Metric Chart
  metricsData.projects.sort((m1, m2) => m1.time - m2.time);

  const dummyPathEl = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState<number>(0);
  const svgPath = calculatePathSmooth(
    graphHelper.mapDataToSvgCoordinates(metricsData.projects)
  );

  React.useEffect(() => {
    setPathLength(dummyPathEl.current.getTotalLength());
    // get the length of the svg path
    // if (svgPath && dummyPathEl?.current) {
    //   console.log("spaghetti a la mongola");
    //   setPathLength(dummyPathEl.current.getTotalLength());
    // }
  }, []);

  // Animation
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const animatePath = useSpring({
    value: playAnimation ? pathLength : 0,
    config: config.molasses
  });

  React.useEffect(() => {
    setPlayAnimation(true);
  }, []);

  const pathAnimation = () => {
    return animatePath.value.to((path) => {
      return pathLength - path > 0 ? pathLength - path : 0.01;
    });
  };

  return (
    <>
      <svg
        style={{ width: "100%" }}
        viewBox={`0 0 ${graphHelper.SVG_WIDTH} ${graphHelper.SVG_HEIGHT}`}
      >
        <path ref={dummyPathEl} d={svgPath} fill="none" stroke="none" />

        {pathLength && (
          <>
            <animated.path
              fill="none"
              stroke={"blue"}
              strokeWidth={1}
              strokeDasharray={pathLength}
              strokeDashoffset={pathAnimation()}
              d={svgPath}
              style={{
                willChange: "stroke-dashoffset",
                transform: "translate3d(0, 0, 0)"
              }}
            />
            <animated.path
              fill="none"
              stroke={"blue"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDashoffset={pathAnimation()}
              strokeDasharray={`0 ${pathLength}`}
              d={svgPath}
              style={{
                willChange: "stroke-dashoffset"
              }}
            />
          </>
        )}
      </svg>
    </>
  );
};

export default Metric;

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { GeoJsonData, MunicipalityData } from '../types';

type GeoJsonFeature = GeoJsonData['features'][number];

interface ChoroplethMapProps {
  geoData: GeoJsonData;
  data: Map<string, MunicipalityData>;
  colorScale: d3.ScaleThreshold<number, string>;
  onMouseEnter: (name: string, municipality: MunicipalityData | undefined, event: React.MouseEvent<SVGPathElement>) => void;
  onMouseMove: (event: React.MouseEvent<SVGPathElement>) => void;
  onMouseLeave: () => void;
  selectedIbgeCode: string | null;
  onSelectIbgeCode: (ibgeCode: string) => void;
  showLabels: boolean;
  selectedRegionMunCodes: Set<string> | null;
}

export const ChoroplethMap: React.FC<ChoroplethMapProps> = ({
  geoData,
  data,
  colorScale,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  selectedIbgeCode,
  onSelectIbgeCode,
  showLabels,
  selectedRegionMunCodes,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomableGroupRef = useRef<SVGGElement>(null);
  const pathsGroupRef = useRef<SVGGElement>(null);
  const labelsGroupRef = useRef<SVGGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const baseScaleRef = useRef<number | null>(null);

  useEffect(() => {
    // When the geoData object changes (e.g., filtering by region),
    // we need to reset the base scale so it can be recalculated by fitSize.
    // This ensures the label font size is appropriate for the new view.
    baseScaleRef.current = null;
  }, [geoData]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: width * 0.75 });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Effect to setup zoom behavior. Runs only once.
  useEffect(() => {
    if (!svgRef.current || !zoomableGroupRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const zoomableGroup = d3.select(zoomableGroupRef.current);
    
    const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      zoomableGroup.attr('transform', event.transform);
    };

    const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 8])
        .on('zoom', zoomed);

    zoomRef.current = zoom;
    svg.call(zoom);
    
    // Cleanup zoom listeners on unmount
    return () => {
      svg.on('.zoom', null);
    };
  }, []);


  // Effect to draw and update the map paths and labels.
  useEffect(() => {
    if (!svgRef.current || !pathsGroupRef.current || !labelsGroupRef.current || !geoData) return;

    const svg = d3.select(svgRef.current);
    const pathsGroup = d3.select(pathsGroupRef.current);
    const labelsGroup = d3.select(labelsGroupRef.current);
    const { width, height } = dimensions;

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
      
    const projection = d3.geoMercator()
      .fitSize([width, height], geoData);

    const pathGenerator = d3.geoPath().projection(projection);
    
    if (!baseScaleRef.current) {
        baseScaleRef.current = projection.scale();
    }
    
    const currentScale = projection.scale();
    const baseScale = baseScaleRef.current || currentScale;
    const effectiveZoom = currentScale / baseScale;

    // Paths
    pathsGroup
      .selectAll<SVGPathElement, GeoJsonFeature>('path')
      .data(geoData.features, (d: GeoJsonFeature) => d.properties?.id as string)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', (d) => {
        const geoId = d.properties?.id as string;
        if (!geoId) return '#E2E8F0';
        
        const ibge6 = geoId.substring(0, 6);
        const municipality = data.get(ibge6);
        return municipality ? colorScale(municipality.coveragePercentage) : '#E2E8F0';
      })
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        const id = d.properties?.id as string;
        setHoveredId(id);
        const ibge6 = id ? id.substring(0, 6) : '';
        const municipality = data.get(ibge6);
        onMouseEnter(
          d.properties?.name || 'Desconhecido',
          municipality,
          event
        );
      })
      .on('mousemove', onMouseMove)
      .on('mouseleave', function () {
        setHoveredId(null);
        onMouseLeave();
      })
      .on('click', function(event, d) {
        const geoId = d.properties?.id as string;
        if (geoId) {
          onSelectIbgeCode(geoId.substring(0, 6));
        }
      });

    // Labels
    labelsGroup
        .style('pointer-events', 'none')
        .selectAll('text')
        .data(showLabels ? geoData.features : [], (d: GeoJsonFeature) => d.properties?.id as string)
        .join('text')
        .attr('x', d => pathGenerator.centroid(d as GeoJsonFeature)[0])
        .attr('y', d => pathGenerator.centroid(d as GeoJsonFeature)[1])
        .text(d => d.properties?.name || '')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .style('font-size', `${8 / effectiveZoom}px`)
        .style('font-weight', '500')
        .style('fill', '#212121')
        .style('stroke', 'rgba(255,255,255,0.8)')
        .style('stroke-width', `${0.5 / effectiveZoom}px`)
        .style('paint-order', 'stroke fill');

  }, [geoData, data, colorScale, dimensions, onMouseEnter, onMouseMove, onMouseLeave, onSelectIbgeCode, showLabels]);

  // Effect for hover and selection styling
  useEffect(() => {
    if (!pathsGroupRef.current || !svgRef.current) return;

    const pathsGroup = d3.select(pathsGroupRef.current);
    const svg = d3.select(svgRef.current);
    const svgNode = svg.node();
    if (!svgNode) return;
    
    const currentTransform = d3.zoomTransform(svgNode);

    pathsGroup.selectAll<SVGPathElement, GeoJsonFeature>('path')
      .attr('stroke', (d) => {
        const ibge6 = d.properties?.id ? d.properties.id.substring(0, 6) : null;
        if (ibge6 === selectedIbgeCode) return '#8B5CF6'; // purple-500
        if (d.properties?.id === hoveredId) return '#475569'; // slate-600
        if (selectedRegionMunCodes && ibge6 && selectedRegionMunCodes.has(ibge6)) {
          return '#3B82F6'; // blue-500
        }
        return '#FFFFFF';
      })
      .attr('stroke-width', (d) => {
        const ibge6 = d.properties?.id ? d.properties.id.substring(0, 6) : null;
        const isSelected = ibge6 === selectedIbgeCode;
        const isHovered = d.properties?.id === hoveredId;
        const isInRegion = selectedRegionMunCodes && ibge6 && selectedRegionMunCodes.has(ibge6);

        let strokeWidth = 0.5;
        if (isSelected || isHovered) {
          strokeWidth = 1.5;
        } else if (isInRegion) {
          strokeWidth = 1;
        }

        return strokeWidth / currentTransform.k; // Scale stroke width based on zoom
      })
      .each(function (d) {
        const isHovered = d.properties?.id === hoveredId;
        const ibge6 = d.properties?.id ? d.properties.id.substring(0, 6) : null;
        const isSelected = ibge6 === selectedIbgeCode;

        if (isSelected || isHovered) {
            this.parentNode?.appendChild(this); // Bring selected/hovered to front within its group
        }
      });
  }, [hoveredId, selectedIbgeCode, selectedRegionMunCodes]);
  
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 1 / 1.3);
    }
  };


  return (
    <div ref={containerRef} className="relative w-full h-auto rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
         <g ref={zoomableGroupRef}>
            <g ref={pathsGroupRef} />
            <g ref={labelsGroupRef} />
         </g>
      </svg>
       <div className="absolute top-2 right-2 flex flex-col space-y-1">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-md shadow text-slate-700 hover:bg-white text-lg font-bold flex items-center justify-center transition"
          aria-label="Aumentar zoom"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-md shadow text-slate-700 hover:bg-white text-xl font-bold flex items-center justify-center transition"
          aria-label="Diminuir zoom"
        >
          -
        </button>
      </div>
    </div>
  );
};

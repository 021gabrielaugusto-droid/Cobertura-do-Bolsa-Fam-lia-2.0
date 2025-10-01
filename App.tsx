import React, { useState, useMemo, useMemo as useMemoAlias } from 'react';
import { ChoroplethMap } from './components/ChoroplethMap';
import { Legend } from './components/Legend';
import { Tooltip } from './components/Tooltip';
import { ControlsPanel } from './components/ControlsPanel';
import { ProgressBar } from './components/ProgressBar';
import { useRioDeJaneiroGeo } from './hooks/useRioDeJaneiroGeo';
import { parseData } from './services/dataParser';
import { rawData } from './services/rawData';
import { regions, municipalityToRegion } from './services/regionData';
import type { MunicipalityData, TooltipData } from './types';
import * as d3 from 'd3';

const App: React.FC = () => {
  const { geoData, loading, error } = useRioDeJaneiroGeo();
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [selectedIbgeCode, setSelectedIbgeCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const parsedStatsMap = useMemoAlias(() => {
    return parseData(rawData);
  }, []);

  const municipalityData: Map<string, MunicipalityData> = useMemo(() => {
    const dataMap = new Map<string, MunicipalityData>();
    if (!geoData) return dataMap;

    for (const feature of geoData.features) {
      const name = feature.properties?.name as string;
      const ibge7 = feature.properties?.id as string;

      if (name && ibge7) {
        const ibge6 = ibge7.substring(0, 6);
        const stats = parsedStatsMap.get(ibge6);
        if (stats) {
          dataMap.set(ibge6, {
            name: name,
            ...stats,
          });
        }
      }
    }
    return dataMap;
  }, [geoData, parsedStatsMap]);


  const sortedMunicipalities = useMemo(() => {
    return Array.from(municipalityData.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [municipalityData]);
  
  const regionalData = useMemo(() => {
    if (municipalityData.size === 0) return [];

    const regionStats: Record<string, {
        beneficiariesToAccompany: number;
        beneficiariesAccompanied: number;
        municipalities: MunicipalityData[];
    }> = {};

    // Initialize with all regions to maintain order
    for (const regionName of regions) {
        regionStats[regionName] = {
            beneficiariesToAccompany: 0,
            beneficiariesAccompanied: 0,
            municipalities: [],
        };
    }

    for (const munData of municipalityData.values()) {
        const regionName = municipalityToRegion[munData.ibgeCode];
        if (regionName && regionStats[regionName]) {
            regionStats[regionName].beneficiariesToAccompany += munData.beneficiariesToAccompany;
            regionStats[regionName].beneficiariesAccompanied += munData.beneficiariesAccompanied;
            regionStats[regionName].municipalities.push(munData);
        }
    }

    return regions.map(regionName => {
        const stats = regionStats[regionName];
        stats.municipalities.sort((a, b) => b.coveragePercentage - a.coveragePercentage);
        const coveragePercentage = stats.beneficiariesToAccompany > 0
            ? (stats.beneficiariesAccompanied / stats.beneficiariesToAccompany) * 100
            : 0;
        return {
            name: regionName,
            ...stats,
            coveragePercentage,
        };
    });
  }, [municipalityData]);
  
  const selectedRegionData = useMemo(() => {
    if (!selectedRegion) return null;
    return regionalData.find(r => r.name === selectedRegion) || null;
  }, [selectedRegion, regionalData]);


  const selectedRegionMunCodes = useMemo(() => {
    if (!selectedRegion) return null;
    const region = regionalData.find(r => r.name === selectedRegion);
    if (!region) return null;
    return new Set(region.municipalities.map(m => m.ibgeCode));
  }, [selectedRegion, regionalData]);

    const geoDataForMap = useMemo(() => {
        if (!selectedRegion || !geoData) {
            return geoData;
        }

        const region = regionalData.find(r => r.name === selectedRegion);
        if (!region) return geoData;
        const regionMunCodes = new Set(region.municipalities.map(m => m.ibgeCode));


        const filteredFeatures = geoData.features.filter(feature => {
            const featureIbge7 = feature.properties?.id as string;
            if (!featureIbge7) return false;
            const featureIbge6 = featureIbge7.substring(0, 6);
            return regionMunCodes.has(featureIbge6);
        });
        
        if (filteredFeatures.length === 0) return geoData; // Fallback if no features match

        return {
            ...geoData,
            features: filteredFeatures,
        };
    }, [selectedRegion, geoData, regionalData]);


  const filteredMunicipalities = useMemo(() => {
    if (!searchTerm) return [];
    return sortedMunicipalities.filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedMunicipalities, searchTerm]);

  const selectedMunicipality = useMemo(() => {
    if (!selectedIbgeCode) return null;
    return municipalityData.get(selectedIbgeCode) || null;
  }, [selectedIbgeCode, municipalityData]);

  const colorScale = useMemoAlias(() => {
    return d3.scaleThreshold<number, string>()
      .domain([61, 71, 81, 91])
      .range([
        '#E0F2F1', // Teal 50 (50-60%)
        '#80CBC4', // Teal 200 (61-70%)
        '#26A69A', // Teal 400 (71-80%)
        '#00796B', // Teal 600 (81-90%)
        '#004D40', // Teal 800 (91-100%)
      ]);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    if (selectedMunicipality && selectedMunicipality.name !== newTerm) {
      setSelectedIbgeCode(null);
    }
  };
  
  const handleMunicipalitySelect = (mun: MunicipalityData, keepRegion: boolean = false) => {
    setSelectedIbgeCode(mun.ibgeCode);
    setSearchTerm(mun.name);
    setIsSearchFocused(false);
    if (!keepRegion) {
        setSelectedRegion('');
    }
  };
  
  const handleMapSelect = (ibgeCode: string) => {
    const mun = municipalityData.get(ibgeCode);
    if (mun) {
        handleMunicipalitySelect(mun, !!selectedRegion);
    }
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
    setSelectedIbgeCode(null);
    setSearchTerm('');
  };

  const handleMouseEnter = (name: string, municipality: MunicipalityData | undefined, event: React.MouseEvent<SVGPathElement>) => {
    setTooltipData({
      x: event.pageX,
      y: event.pageY,
      name: name,
      value: municipality ? `${municipality.coveragePercentage.toFixed(2)}%` : 'Sem dados',
      beneficiariesAccompanied: municipality?.beneficiariesAccompanied ?? 0,
      beneficiariesToAccompany: municipality?.beneficiariesToAccompany ?? 0,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<SVGPathElement>) => {
    if (tooltipData) {
      setTooltipData(prev => prev ? { ...prev, x: event.pageX, y: event.pageY } : null);
    }
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const numberFormatter = new Intl.NumberFormat('pt-BR');

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-screen-2xl bg-white rounded-xl shadow-2xl p-6 lg:p-8">
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">
            Cobertura do Bolsa Família
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Análise da cobertura de saúde no Rio de Janeiro - 1º Semestre de 2025
          </p>
        </header>

        <main className="mt-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:h-[75vh]">
          <aside className="lg:col-span-3 flex flex-col space-y-6">
             <ControlsPanel
                regions={regions}
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
                showLabels={showLabels}
                onShowLabelsChange={setShowLabels}
                selectedRegionData={selectedRegionData}
                onMunicipalitySelect={(mun) => handleMunicipalitySelect(mun, true)}
                selectedIbgeCode={selectedIbgeCode}
             />
          </aside>

          <div className="relative lg:col-span-6 mt-8 lg:mt-0 h-full">
            {loading && <div className="absolute inset-0 flex items-center justify-center text-slate-500">Carregando dados do mapa...</div>}
            {error && <div className="absolute inset-0 flex items-center justify-center text-red-500">Erro ao carregar dados: {error}</div>}
            {geoDataForMap && municipalityData.size > 0 && (
              <>
                <ChoroplethMap
                  geoData={geoDataForMap}
                  data={municipalityData}
                  colorScale={colorScale}
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  selectedIbgeCode={selectedIbgeCode}
                  onSelectIbgeCode={handleMapSelect}
                  showLabels={showLabels}
                  selectedRegionMunCodes={selectedRegionMunCodes}
                />
                <Legend colorScale={colorScale} />
              </>
            )}
          </div>

          <aside className="lg:col-span-3 flex flex-col space-y-6 mt-8 lg:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar município..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {isSearchFocused && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
                  {filteredMunicipalities.length > 0 ? (
                    <ul className="divide-y divide-slate-200">
                      {filteredMunicipalities.map(mun => (
                        <li key={mun.ibgeCode}>
                          <button
                            onMouseDown={() => handleMunicipalitySelect(mun)}
                            className="w-full text-left p-3 transition-colors duration-150 hover:bg-slate-50"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm text-slate-800">{mun.name}</span>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full`} style={{backgroundColor: colorScale(mun.coveragePercentage), color: mun.coveragePercentage > 70 ? 'white' : 'black' }}>
                                {mun.coveragePercentage.toFixed(2)}%
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="p-4 text-center text-sm text-slate-500">Nenhum município encontrado.</p>
                  )}
                </div>
              )}
            </div>
            
            {!selectedMunicipality ? (
               <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-center text-slate-500 flex-grow flex items-center justify-center min-h-[300px]">
                  <p className="text-base">Selecione uma região ou município para ver os detalhes.</p>
               </div>
            ) : (
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 animate-fade-in">
                <h3 className="font-bold text-xl text-slate-800">{selectedMunicipality.name}</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-semibold text-slate-600">Percentual de Cobertura</h4>
                      <span className="font-bold text-teal-600">{selectedMunicipality.coveragePercentage.toFixed(2)}%</span>
                    </div>
                    <ProgressBar percentage={selectedMunicipality.coveragePercentage} />
                  </div>
                   <div>
                    <h4 className="text-sm font-semibold text-slate-600 mb-1">Beneficiários</h4>
                    <div className="text-sm flex justify-between text-slate-500 border-t pt-2">
                        <span>Acompanhados:</span>
                        <span className="font-semibold text-slate-700">{numberFormatter.format(selectedMunicipality.beneficiariesAccompanied)}</span>
                    </div>
                     <div className="text-sm flex justify-between text-slate-500 border-t pt-2 mt-2">
                        <span>Total a acompanhar:</span>
                        <span className="font-semibold text-slate-700">{numberFormatter.format(selectedMunicipality.beneficiariesToAccompany)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </main>
      </div>
      {tooltipData && <Tooltip data={tooltipData} />}
    </div>
  );
};

export default App;
import React from 'react';
import type { MunicipalityData } from '../types';
import { ProgressBar } from './ProgressBar';

interface RegionData {
    name: string;
    beneficiariesToAccompany: number;
    beneficiariesAccompanied: number;
    municipalities: MunicipalityData[];
    coveragePercentage: number;
}

interface ControlsPanelProps {
    regions: string[];
    selectedRegion: string;
    onRegionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    showLabels: boolean;
    onShowLabelsChange: (show: boolean) => void;
    selectedRegionData: RegionData | null;
    onMunicipalitySelect: (mun: MunicipalityData) => void;
    selectedIbgeCode: string | null;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
    regions,
    selectedRegion,
    onRegionChange,
    showLabels,
    onShowLabelsChange,
    selectedRegionData,
    onMunicipalitySelect,
    selectedIbgeCode,
}) => {
    const numberFormatter = new Intl.NumberFormat('pt-BR');

    return (
        <div className="flex flex-col space-y-4 h-full">
            <div className="border border-slate-200 rounded-lg bg-slate-50 p-4 space-y-4">
                <div>
                    <label htmlFor="region-select" className="block font-bold text-lg text-slate-800 mb-2">
                        Controles
                    </label>
                    <select
                        id="region-select"
                        value={selectedRegion}
                        onChange={onRegionChange}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                        aria-label="Selecionar região para filtrar o mapa"
                    >
                        <option value="">Todas as Regiões</option>
                        {regions.map(regionName => (
                            <option key={regionName} value={regionName}>
                                {regionName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Exibir nomes no mapa</span>
                    <button
                        onClick={() => onShowLabelsChange(!showLabels)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${showLabels ? 'bg-teal-500' : 'bg-slate-300'}`}
                        aria-label="Exibir nomes dos municípios no mapa"
                        role="switch"
                        aria-checked={showLabels}
                    >
                        <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showLabels ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>
            </div>

            {selectedRegionData && (
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 animate-fade-in flex-grow flex flex-col min-h-0">
                    <div className="flex-shrink-0">
                        <h3 className="font-bold text-xl text-slate-800 mb-4">{selectedRegionData.name}</h3>
                        <div>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-sm font-semibold text-slate-600">Cobertura da Região</h4>
                                <span className="font-bold text-teal-600">{selectedRegionData.coveragePercentage.toFixed(2)}%</span>
                            </div>
                            <ProgressBar percentage={selectedRegionData.coveragePercentage} />
                            <div className="text-xs flex justify-between text-slate-500 mt-2">
                                <span>Acompanhados:</span>
                                <span className="font-semibold text-slate-700">
                                    {numberFormatter.format(selectedRegionData.beneficiariesAccompanied)} / {numberFormatter.format(selectedRegionData.beneficiariesToAccompany)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 border-t border-slate-300 pt-3 flex-grow overflow-y-auto pr-1">
                         <div className="grid grid-cols-2 gap-2">
                            {selectedRegionData.municipalities.map(mun => (
                                <button
                                    key={mun.ibgeCode}
                                    onClick={() => onMunicipalitySelect(mun)}
                                    className={`p-2 rounded-md text-sm text-center transition-colors duration-150 truncate ${
                                        selectedIbgeCode === mun.ibgeCode
                                            ? 'bg-teal-500 text-white font-semibold ring-2 ring-teal-300'
                                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                    }`}
                                    title={mun.name}
                                >
                                    {mun.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
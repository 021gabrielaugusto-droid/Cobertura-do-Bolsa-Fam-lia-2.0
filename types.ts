
import type { FeatureCollection } from 'geojson';

export interface MunicipalityData {
  ibgeCode: string;
  name: string;
  coveragePercentage: number;
  beneficiariesToAccompany: number;
  beneficiariesAccompanied: number;
}

export type GeoJsonData = FeatureCollection;

export interface TooltipData {
  x: number;
  y: number;
  name: string;
  value: string;
  beneficiariesToAccompany: number;
  beneficiariesAccompanied: number;
}

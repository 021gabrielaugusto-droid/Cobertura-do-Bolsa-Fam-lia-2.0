import type { MunicipalityData } from '../types';

export const parseData = (text: string): Map<string, Omit<MunicipalityData, 'name'>> => {
  const lines = text
    .replace(//g, '') // Remove form feed characters
    .split(/\r?\n/)
    .map(l => l.trim().replace(/"/g, ''))
    .filter(l => l);

  const dataMap = new Map<string, Omit<MunicipalityData, 'name'>>();
  
  // This regex is designed to find the core data block: IBGE code, two numbers with dot separators, and a percentage with a comma separator.
  const dataCaptureRegex = /(\d{6})\s+([\d\.]+)\s+([\d\.]+)\s+([\d,]+%)/;

  for (const line of lines) {
    // We only process lines that contain the data pattern. A check for "12025 RJ" helps filter irrelevant lines.
    if (!/12025\s+RJ/.test(line)) {
      continue;
    }
    
    const match = line.match(dataCaptureRegex);

    if (match) {
      try {
        const ibgeCode = match[1];
        const beneficiariesToAccompany = parseInt(match[2].replace(/\./g, ''), 10);
        const beneficiariesAccompanied = parseInt(match[3].replace(/\./g, ''), 10);
        const percentageStr = match[4];
        const coveragePercentage = parseFloat(
          percentageStr.replace(/\./g, '').replace(',', '.').replace('%', '')
        );

        if (!isNaN(coveragePercentage) && !isNaN(beneficiariesToAccompany) && !isNaN(beneficiariesAccompanied)) {
          // Use set to overwrite any previous entry, ensuring the last one in the doc wins if there are duplicates.
          dataMap.set(ibgeCode, { 
            ibgeCode, 
            coveragePercentage,
            beneficiariesToAccompany,
            beneficiariesAccompanied
          });
        }
      } catch (e) {
        console.error("Failed to parse a data row from line:", line, e);
      }
    }
  }

  return dataMap;
};

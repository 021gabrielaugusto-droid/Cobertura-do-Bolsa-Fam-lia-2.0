// Data based on the official Health Regions (Regiões de Saúde) of the state of Rio de Janeiro.
// Names have been adapted to match the user's request.

export const regions: string[] = [
    'Metropolitana 1',
    'Metropolitana 2',
    'Baia da ilha grande',
    'Baixada litorânea',
    'Médio Paraíba',
    'Centro Sul',
    'Norte',
    'Noroeste',
    'Serrana',
];

export const municipalityToRegion: Record<string, string> = {
    // Metropolitana 1
    '330455': 'Metropolitana 1', // RIO DE JANEIRO
    '330045': 'Metropolitana 1', // BELFORD ROXO
    '330170': 'Metropolitana 1', // DUQUE DE CAXIAS
    '330185': 'Metropolitana 1', // GUAPIMIRIM
    '330200': 'Metropolitana 1', // ITAGUAI
    '330227': 'Metropolitana 1', // JAPERI
    '330250': 'Metropolitana 1', // MAGE
    '330285': 'Metropolitana 1', // MESQUITA
    '330320': 'Metropolitana 1', // NILOPOLIS
    '330350': 'Metropolitana 1', // NOVA IGUACU
    '330360': 'Metropolitana 1', // PARACAMBI
    '330414': 'Metropolitana 1', // QUEIMADOS
    '330510': 'Metropolitana 1', // SAO JOAO DE MERITI
    '330555': 'Metropolitana 1', // SEROPEDICA

    // Metropolitana 2
    '330330': 'Metropolitana 2', // NITEROI
    '330490': 'Metropolitana 2', // SAO GONCALO
    '330080': 'Metropolitana 2', // CACHOEIRAS DE MACACU
    '330190': 'Metropolitana 2', // ITABORAI
    '330270': 'Metropolitana 2', // MARICA
    '330430': 'Metropolitana 2', // RIO BONITO
    '330560': 'Metropolitana 2', // SILVA JARDIM
    '330575': 'Metropolitana 2', // TANGUA

    // Baia da ilha grande
    '330010': 'Baia da ilha grande', // ANGRA DOS REIS
    '330260': 'Baia da ilha grande', // MANGARATIBA
    '330380': 'Baia da ilha grande', // PARATY

    // Baixada litorânea
    '330020': 'Baixada litorânea', // ARARUAMA
    '330023': 'Baixada litorânea', // ARMACAO DOS BUZIOS
    '330025': 'Baixada litorânea', // ARRAIAL DO CABO
    '330070': 'Baixada litorânea', // CABO FRIO
    '330130': 'Baixada litorânea', // CASIMIRO DE ABREU
    '330187': 'Baixada litorânea', // IGUABA GRANDE
    '330452': 'Baixada litorânea', // RIO DAS OSTRAS
    '330520': 'Baixada litorânea', // SAO PEDRO DA ALDEIA
    '330550': 'Baixada litorânea', // SAQUAREMA

    // Médio Paraíba
    '330630': 'Médio Paraíba', // VOLTA REDONDA
    '330030': 'Médio Paraíba', // BARRA DO PIRAI
    '330040': 'Médio Paraíba', // BARRA MANSA
    '330180': 'Médio Paraíba', // ENGENHEIRO PAULO DE FRONTIN
    '330225': 'Médio Paraíba', // ITATIAIA
    '330395': 'Médio Paraíba', // PINHEIRAL
    '330400': 'Médio Paraíba', // PIRAI
    '330411': 'Médio Paraíba', // PORTO REAL
    '330412': 'Médio Paraíba', // QUATIS
    '330420': 'Médio Paraíba', // RESENDE
    '330440': 'Médio Paraíba', // RIO CLARO
    '330610': 'Médio Paraíba', // VALENCA

    // Centro Sul
    '330600': 'Centro Sul', // TRES RIOS
    '330022': 'Centro Sul', // AREAL
    '330095': 'Centro Sul', // COMENDADOR LEVY GASPARIAN
    '330280': 'Centro Sul', // MENDES
    '330290': 'Centro Sul', // MIGUEL PEREIRA
    '330370': 'Centro Sul', // PARAIBA DO SUL
    '330385': 'Centro Sul', // PATY DO ALFERES
    '330450': 'Centro Sul', // RIO DAS FLORES
    '330540': 'Centro Sul', // SAPUCAIA
    '330620': 'Centro Sul', // VASSOURAS

    // Norte
    '330100': 'Norte', // CAMPOS DOS GOYTACAZES
    '330115': 'Norte', // CARDOSO MOREIRA
    '330093': 'Norte', // CARAPEBUS
    '330140': 'Norte', // CONCEICAO DE MACABU
    '330240': 'Norte', // MACAE
    '330415': 'Norte', // QUISSAMA
    '330480': 'Norte', // SAO FIDELIS
    '330475': 'Norte', // SAO FRANCISCO DE ITABAPOANA
    '330500': 'Norte', // SAO JOAO DA BARRA
    
    // Noroeste
    '330220': 'Noroeste', // ITAPERUNA
    '330015': 'Noroeste', // APERIBE
    '330060': 'Noroeste', // BOM JESUS DO ITABAPOANA
    '330090': 'Noroeste', // CAMBUCI
    '330205': 'Noroeste', // ITALVA
    '330210': 'Noroeste', // ITAOCARA
    '330230': 'Noroeste', // LAJE DO MURIAE
    '330300': 'Noroeste', // MIRACEMA
    '330310': 'Noroeste', // NATIVIDADE
    '330410': 'Noroeste', // PORCIUNCULA
    '330470': 'Noroeste', // SANTO ANTONIO DE PADUA
    '330513': 'Noroeste', // SAO JOSE DE UBA
    '330615': 'Noroeste', // VARRE-SAI
    
    // Serrana
    '330390': 'Serrana', // PETROPOLIS
    '330580': 'Serrana', // TERESOPOLIS
    '330340': 'Serrana', // NOVA FRIBURGO
    '330050': 'Serrana', // BOM JARDIM
    '330110': 'Serrana', // CANTAGALO
    '330120': 'Serrana', // CARMO
    '330150': 'Serrana', // CORDEIRO
    '330160': 'Serrana', // DUAS BARRAS
    '330245': 'Serrana', // MACUCO
    '330460': 'Serrana', // SANTA MARIA MADALENA
    '330515': 'Serrana', // SAO JOSE DO VALE DO RIO PRETO
    '330530': 'Serrana', // SAO SEBASTIAO DO ALTO
    '330570': 'Serrana', // SUMIDOURO
    '330590': 'Serrana', // TRAJANO DE MORAES
};
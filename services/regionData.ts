// Data based on the official Health Regions (Regiões de Saúde) of the state of Rio de Janeiro.
// Updated according to user's provided list.

export const regions: string[] = [
    'Baía da Ilha Grande',
    'Baixada Litorânea',
    'Centro Sul',
    'Metropolitana I',
    'Metropolitana II',
    'Médio Paraíba',
    'Noroeste',
    'Norte',
    'Serrana',
];

export const municipalityToRegion: Record<string, string> = {
    // Baía da Ilha Grande
    '330010': 'Baía da Ilha Grande', // ANGRA DOS REIS
    '330260': 'Baía da Ilha Grande', // MANGARATIBA
    '330380': 'Baía da Ilha Grande', // PARATY

    // Baixada Litorânea
    '330020': 'Baixada Litorânea', // ARARUAMA
    '330023': 'Baixada Litorânea', // ARMACAO DOS BUZIOS
    '330025': 'Baixada Litorânea', // ARRAIAL DO CABO
    '330070': 'Baixada Litorânea', // CABO FRIO
    '330130': 'Baixada Litorânea', // CASIMIRO DE ABREU
    '330187': 'Baixada Litorânea', // IGUABA GRANDE
    '330452': 'Baixada Litorânea', // RIO DAS OSTRAS
    '330520': 'Baixada Litorânea', // SAO PEDRO DA ALDEIA
    '330550': 'Baixada Litorânea', // SAQUAREMA

    // Centro Sul
    '330022': 'Centro Sul', // AREAL
    '330095': 'Centro Sul', // COMENDADOR LEVY GASPARIAN
    '330180': 'Centro Sul', // ENGENHEIRO PAULO DE FRONTIN
    '330280': 'Centro Sul', // MENDES
    '330290': 'Centro Sul', // MIGUEL PEREIRA
    '330360': 'Centro Sul', // PARACAMBI
    '330370': 'Centro Sul', // PARAIBA DO SUL
    '330385': 'Centro Sul', // PATY DO ALFERES
    '330540': 'Centro Sul', // SAPUCAIA
    '330600': 'Centro Sul', // TRES RIOS
    '330620': 'Centro Sul', // VASSOURAS

    // Metropolitana I
    '330045': 'Metropolitana I', // BELFORD ROXO
    '330170': 'Metropolitana I', // DUQUE DE CAXIAS
    '330200': 'Metropolitana I', // ITAGUAI
    '330227': 'Metropolitana I', // JAPERI
    '330250': 'Metropolitana I', // MAGE
    '330285': 'Metropolitana I', // MESQUITA
    '330320': 'Metropolitana I', // NILOPOLIS
    '330350': 'Metropolitana I', // NOVA IGUACU
    '330414': 'Metropolitana I', // QUEIMADOS
    '330455': 'Metropolitana I', // RIO DE JANEIRO
    '330510': 'Metropolitana I', // SAO JOAO DE MERITI
    '330555': 'Metropolitana I', // SEROPEDICA

    // Metropolitana II
    '330190': 'Metropolitana II', // ITABORAI
    '330270': 'Metropolitana II', // MARICA
    '330330': 'Metropolitana II', // NITEROI
    '330430': 'Metropolitana II', // RIO BONITO
    '330490': 'Metropolitana II', // SAO GONCALO
    '330560': 'Metropolitana II', // SILVA JARDIM
    '330575': 'Metropolitana II', // TANGUA

    // Médio Paraíba
    '330030': 'Médio Paraíba', // BARRA DO PIRAI
    '330040': 'Médio Paraíba', // BARRA MANSA
    '330225': 'Médio Paraíba', // ITATIAIA
    '330395': 'Médio Paraíba', // PINHEIRAL
    '330400': 'Médio Paraíba', // PIRAI
    '330411': 'Médio Paraíba', // PORTO REAL
    '330412': 'Médio Paraíba', // QUATIS
    '330420': 'Médio Paraíba', // RESENDE
    '330440': 'Médio Paraíba', // RIO CLARO
    '330450': 'Médio Paraíba', // RIO DAS FLORES
    '330610': 'Médio Paraíba', // VALENCA
    '330630': 'Médio Paraíba', // VOLTA REDONDA

    // Noroeste
    '330015': 'Noroeste', // APERIBE
    '330060': 'Noroeste', // BOM JESUS DO ITABAPOANA
    '330090': 'Noroeste', // CAMBUCI
    '330115': 'Noroeste', // CARDOSO MOREIRA
    '330205': 'Noroeste', // ITALVA
    '330210': 'Noroeste', // ITAOCARA
    '330220': 'Noroeste', // ITAPERUNA
    '330230': 'Noroeste', // LAJE DO MURIAE
    '330300': 'Noroeste', // MIRACEMA
    '330310': 'Noroeste', // NATIVIDADE
    '330410': 'Noroeste', // PORCIUNCULA
    '330470': 'Noroeste', // SANTO ANTONIO DE PADUA
    '330513': 'Noroeste', // SAO JOSE DE UBA
    '330615': 'Noroeste', // VARRE-SAI

    // Norte
    '330100': 'Norte', // CAMPOS DOS GOYTACAZES
    '330093': 'Norte', // CARAPEBUS
    '330140': 'Norte', // CONCEICAO DE MACABU
    '330240': 'Norte', // MACAE
    '330415': 'Norte', // QUISSAMA
    '330480': 'Norte', // SAO FIDELIS
    '330475': 'Norte', // SAO FRANCISCO DE ITABAPOANA
    '330500': 'Norte', // SAO JOAO DA BARRA
    
    // Serrana
    '330050': 'Serrana', // BOM JARDIM
    '330080': 'Serrana', // CACHOEIRAS DE MACACU
    '330110': 'Serrana', // CANTAGALO
    '330120': 'Serrana', // CARMO
    '330150': 'Serrana', // CORDEIRO
    '330160': 'Serrana', // DUAS BARRAS
    '330185': 'Serrana', // GUAPIMIRIM
    '330245': 'Serrana', // MACUCO
    '330340': 'Serrana', // NOVA FRIBURGO
    '330390': 'Serrana', // PETROPOLIS
    '330460': 'Serrana', // SANTA MARIA MADALENA
    '330515': 'Serrana', // SAO JOSE DO VALE DO RIO PRETO
    '330530': 'Serrana', // SAO SEBASTIAO DO ALTO
    '330570': 'Serrana', // SUMIDOURO
    '330580': 'Serrana', // TERESOPOLIS
    '330590': 'Serrana', // TRAJANO DE MORAES
};

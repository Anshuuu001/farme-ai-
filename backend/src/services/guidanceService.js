// AgriVision AI - Agronomic Guidance and Disease Knowledge Base
// All guidance is mapped to the 10 verified tomato pathology classes

export const DISCLAIMER_STATEMENT = 
  'AI-assisted predictions are informational decision-support aids only and do not replace certified botanical or agricultural extension diagnosis. Field confirmation and adherence to local pesticide regulations/pre-harvest intervals (PHI) are mandatory before chemical application.';

export const TOMATO_DISEASE_TAXONOMY = {
  'Tomato___Bacterial_spot': {
    diseaseKey: 'tomato_bacterial_spot',
    displayName: 'Tomato Bacterial Spot',
    scientificName: 'Xanthomonas perforans / euvesicatoria',
    severity: 'Moderate Concern',
    isHealthy: false,
    affectedParts: ['Foliage', 'Stems', 'Fruit'],
    summary: 'Small, dark, angular water-soaked lesions that may dry out into shot-holes. Highly favored by wet, warm field environments.',
    symptoms: [
      'Small, circular to angular water-soaked spots on foliage (<3mm)',
      'Lesion centers dry out and drop, creating shot-hole effect',
      'Yellow halos surrounding older necrotic lesions',
      'Raised, scab-like spots with dark margins on green fruit'
    ],
    solutions: {
      cultural: [
        'Avoid working in tomato fields or pruning while foliage is damp or wet.',
        'Use certified pathogen-free seeds and hot-water seed sanitation protocols (50°C for 25 min).',
        'Sterilize trellises, pruning shears, and harvesting crates with 10% sodium hypochlorite.'
      ],
      organic: [
        'Apply fixed copper bactericides combined with bio-fungicide Bacillus amyloliquefaciens.',
        'Apply bacteriophage biopesticides registered specifically for Xanthomonas species.'
      ],
      chemicalCaution: 'Standard fungal-specific fungicides do not manage bacterial spot. Do not apply synthetic fungicides without verified lab bacteriological confirmation.',
      sourceReference: 'ICAR Indian Institute of Vegetable Research & University Extension IPM Bulletin'
    }
  },

  'Tomato___Early_blight': {
    diseaseKey: 'tomato_early_blight',
    displayName: 'Tomato Early Blight',
    scientificName: 'Alternaria solani',
    severity: 'High Concern',
    isHealthy: false,
    affectedParts: ['Lower Leaves', 'Stems', 'Fruit Calyx'],
    summary: 'Classic target-board concentric ring lesions starting on older bottom foliage and progressing upward under warm, humid conditions.',
    symptoms: [
      'Dark brown to black circular lesions on older lower foliage',
      'Distinct concentric rings forming a bullseye or target-board pattern',
      'Prominent chlorotic (yellow) halos encircling mature lesions',
      'Progressive upward defoliation exposing green fruit to sunscald'
    ],
    solutions: {
      cultural: [
        'Prune bottom 12 inches of foliage to prevent soil splash onto leaves.',
        'Transition to drip irrigation to keep the canopy completely dry.',
        'Enforce a strict 3-year crop rotation away from Solanaceous crops (potatoes, peppers, eggplants).',
        'Stake and trellis tomato plants to maximize air circulation and sunlight penetration.'
      ],
      organic: [
        'Apply organic copper octanoate (copper soap fungicide) at initial symptom onset.',
        'Incorporate beneficial bio-fungicides containing Bacillus subtilis or Trichoderma harzianum into the rhizosphere.'
      ],
      chemicalCaution: 'Synthetic fungicides (Chlorothalonil, Mancozeb) must only be applied under licensed agronomist guidance with strict compliance to pre-harvest intervals (PHI).',
      sourceReference: 'USDA Plant Pathology Diagnostic Index & ICAR IIVR Tomato IPM Guidelines'
    }
  },

  'Tomato___Late_blight': {
    diseaseKey: 'tomato_late_blight',
    displayName: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    severity: 'Critical / Emergency',
    isHealthy: false,
    affectedParts: ['Leaves', 'Petioles', 'Green Fruit'],
    summary: 'Rapidly spreading water mold capable of defoliating entire tomato plots in cool, humid weather within 7 to 10 days.',
    symptoms: [
      'Irregular, pale to dark water-soaked lesions on upper foliage',
      'Purplish-brown necrotic patches that expand rapidly during damp weather',
      'Delicate white fungal-like sporulation visible on leaf undersides in humid mornings',
      'Greasy, olive-brown firm rot lesions on developing green fruit'
    ],
    solutions: {
      cultural: [
        'Immediately rogue out and bag severely infected plants; do not compost blighted material.',
        'Maintain wide plant spacing (minimum 24-36 inches) for rapid morning dew drying.',
        'Eliminate nearby cull piles, volunteer tomato plants, and weed nightshades.'
      ],
      organic: [
        'Prophylactic copper hydroxide sprays prior to prolonged cool rain events.',
        'Bio-rational foliar applications with Streptomyces lydicus.'
      ],
      chemicalCaution: 'Late blight is an aggressive community-level pathogen. Report outbreaks to local extension agents immediately for targeted systemic fungicide protocol.',
      sourceReference: 'FAO Integrated Pest Management Manual for Solanaceous Crops'
    }
  },

  'Tomato___Leaf_Mold': {
    diseaseKey: 'tomato_leaf_mold',
    displayName: 'Tomato Leaf Mold',
    scientificName: 'Passalora fulva (Cladosporium fulvum)',
    severity: 'Moderate Concern',
    isHealthy: false,
    affectedParts: ['Foliage (Underside predominantly)'],
    summary: 'Fungal infection primarily problematic in greenhouses and high tunnels with relative humidity above 85%.',
    symptoms: [
      'Pale green or yellowish indistinct spots on the upper leaf surface',
      'Olive-green to velvety brown mold growth on the corresponding lower surface',
      'Leaves curl upward, wither, and drop prematurely',
      'Blossoms may drop without setting fruit in severe infestations'
    ],
    solutions: {
      cultural: [
        'Increase ventilation in protected tunnels and greenhouse structures using circulation fans.',
        'Maintain relative humidity below 85% through heating and vent management.',
        'Water early in the morning and avoid overhead sprinkler systems.'
      ],
      organic: [
        'Apply potassium bicarbonate or sulfur sprays at first detection.',
        'Use neem oil extract as a foliar suppressant in early vegetative stages.'
      ],
      chemicalCaution: 'Ensure thorough coverage of leaf undersides when applying approved protectant sprays.',
      sourceReference: 'Cornell Cooperative Extension Tomato Disease Guide'
    }
  },

  'Tomato___Septoria_leaf_spot': {
    diseaseKey: 'tomato_septoria_leaf_spot',
    displayName: 'Tomato Septoria Leaf Spot',
    scientificName: 'Septoria lycopersici',
    severity: 'High Concern',
    isHealthy: false,
    affectedParts: ['Foliage', 'Stems', 'Calyx'],
    summary: 'High-frequency fungal disease characterized by numerous small, circular spots with dark margins and gray centers containing tiny black pycnidia.',
    symptoms: [
      'Numerous small (1.5–3mm) circular spots with dark brown margins',
      'Centers of mature spots turn light gray or tan',
      'Tiny black fruiting bodies (pycnidia) visible inside spot centers under magnification',
      'Severe lower leaf chlorosis and premature defoliation'
    ],
    solutions: {
      cultural: [
        'Apply 2-3 inches of organic straw mulch around plant base to inhibit spore splash from soil.',
        'Remove and incinerate or deeply bury infected lower leaves at first sign.',
        'Disinfect all stakes, cages, and tools at the end of every season.'
      ],
      organic: [
        'Bio-fungicide sprays containing Bacillus subtilis (Serenade).',
        'Fixed copper compounds applied every 7 to 10 days during rainy intervals.'
      ],
      chemicalCaution: 'Preventative spray schedules are more effective than curative sprays once lower canopy is heavily colonized.',
      sourceReference: 'Purdue University Extension - Tomato Foliar Diseases'
    }
  },

  'Tomato___Spider_mites Two-spotted_spider_mite': {
    diseaseKey: 'tomato_spider_mites',
    displayName: 'Two-Spotted Spider Mite Damage',
    scientificName: 'Tetranychus urticae',
    severity: 'Moderate Concern',
    isHealthy: false,
    affectedParts: ['Foliage', 'Terminal Shoots'],
    summary: 'Microscopic arachnid pests that pierce leaf cells, sucking sap and causing fine yellow stippling and silk webbing.',
    symptoms: [
      'Fine white to yellow speckled stippling on the upper leaf surface',
      'Bronze, dry, or scorched appearance on leaves in advanced stages',
      'Delicate silky webbing on leaf undersides and shoot axils',
      'Stunted growth and premature leaf drop in hot, dusty weather'
    ],
    solutions: {
      cultural: [
        'Wash dusty roads and field borders, as dust promotes mite proliferation.',
        'Avoid over-fertilization with excess nitrogen, which stimulates mite reproduction.',
        'Overhead misting during hot midday hours can disrupt mite webbing and micro-climate.'
      ],
      organic: [
        'Release predatory mites (Phytoseiulus persimilis or Neoseiulus californicus).',
        'Apply insecticidal soap or horticultural mineral oil directly to leaf undersides.'
      ],
      chemicalCaution: 'Broad-spectrum synthetic pyrethroids kill beneficial natural predators and can trigger severe spider mite population explosions.',
      sourceReference: 'UC Davis Statewide Integrated Pest Management Program - Spider Mites'
    }
  },

  'Tomato___Target_Spot': {
    diseaseKey: 'tomato_target_spot',
    displayName: 'Tomato Target Spot',
    scientificName: 'Corynespora cassiicola',
    severity: 'Moderate Concern',
    isHealthy: false,
    affectedParts: ['Leaves', 'Stems', 'Fruit'],
    summary: 'Fungal disease producing brown circular lesions with light brown centers, frequently confused with Early Blight.',
    symptoms: [
      'Brown circular lesions on leaves, up to 10mm in diameter',
      'Zonate markings without prominent concentric bullseye rings',
      'Pitting and sunken brown lesions with dark margins on mature fruit',
      'Lesions frequently cross leaf veins, unlike bacterial spot'
    ],
    solutions: {
      cultural: [
        'Increase row spacing to reduce humidity within plant canopy.',
        'Avoid excessive vegetative growth by moderating nitrogen inputs.',
        'Destroy old crop residues promptly after harvest.'
      ],
      organic: [
        'Copper-based fungicides alternated with bio-fungicide formulations.',
        'Application of Reynoutria sachalinensis (giant knotweed) plant extract to trigger systemic resistance.'
      ],
      chemicalCaution: 'Check local label registrations; fungicide resistance has been reported in Corynespora strains.',
      sourceReference: 'University of Florida IFAS Extension - Target Spot of Tomato'
    }
  },

  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    diseaseKey: 'tomato_yellow_leaf_curl',
    displayName: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    scientificName: 'Begomovirus / TYLCV',
    severity: 'Critical / Emergency',
    isHealthy: false,
    affectedParts: ['Upper Shoots', 'Foliage', 'Flowers'],
    summary: 'Devastating viral pathogen transmitted solely by whiteflies (Bemisia tabaci). Infected young plants produce virtually no marketable fruit.',
    symptoms: [
      'Severe upward curling and cupping of leaflet margins',
      'Marked interveinal chlorosis (yellowing) on younger leaves',
      'Significant plant stunting with shortened internodes',
      'Severe reduction in flower set and complete flower drop'
    ],
    solutions: {
      cultural: [
        'Plant certified TYLCV-resistant or tolerant tomato hybrids.',
        'Use 50-mesh insect-proof netting in greenhouse vents and nursery seedling houses.',
        'Install reflective silver plastic mulches to repel whitefly vectors in open fields.'
      ],
      organic: [
        'Deploy yellow sticky traps (1 per 100 sq meters) for early whitefly population monitoring.',
        'Foliar spray of botanical neem seed kernel extract (NSKE 5%) or Beauveria bassiana bio-insecticide.'
      ],
      chemicalCaution: 'Viruses cannot be cured once inside the plant. Management is 100% focused on whitefly vector suppression and resistant cultivars.',
      sourceReference: 'ICAR National Research Centre on Integrated Pest Management'
    }
  },

  'Tomato___Tomato_mosaic_virus': {
    diseaseKey: 'tomato_mosaic_virus',
    displayName: 'Tomato Mosaic Virus (ToMV)',
    scientificName: 'Tobamovirus / ToMV',
    severity: 'High Concern',
    isHealthy: false,
    affectedParts: ['Foliage', 'Stems', 'Fruit'],
    summary: 'Highly stable and infectious mechanical virus transmitted on workers’ hands, tools, and infected seeds.',
    symptoms: [
      'Mottled light and dark green mosaic patterns on foliage',
      'Distortion, blistering, and "shoestring" fern-like leaf thinning',
      'Stunted plant growth and uneven ripening of fruit ("internal browning")',
      'Necrotic brown streaks along stems in severe systemic infections'
    ],
    solutions: {
      cultural: [
        'Workers must thoroughly wash hands with soap or 20% non-fat dry milk solution before handling plants.',
        'Strictly prohibit tobacco smoking near tomato plants (tobacco can harbor related tobamoviruses).',
        'Immediately rogue out and destroy infected plants upon positive diagnosis.'
      ],
      organic: [
        'Seed treatment with trisodium phosphate (TSP 10%) solution for 30 minutes before planting.',
        'Grow ToMV-resistant rootstocks and cultivars.'
      ],
      chemicalCaution: 'No chemical pesticides exist for viral pathogens. Chemical sprays against weeds/soil do not cure mosaic virus.',
      sourceReference: 'International Potato Center & World Vegetable Center Pathology Index'
    }
  },

  'Tomato___healthy': {
    diseaseKey: 'tomato_healthy',
    displayName: 'Healthy Tomato Foliage',
    scientificName: 'Solanum lycopersicum',
    severity: 'Optimal Health',
    isHealthy: true,
    affectedParts: ['None - Healthy Specimen'],
    summary: 'Vigorous, chlorophyll-rich tomato foliage exhibiting normal serrated margins, consistent deep green coloration, and no signs of pathogen damage.',
    symptoms: [
      'No fungal lesions, necrosis, or chlorosis detected',
      'Normal cell turgor and healthy transpiration cuticle',
      'Clean leaf underside without spore masses, mold, or webbing',
      'Even vascular venation and normal leaf posture'
    ],
    solutions: {
      cultural: [
        'Maintain consistent, balanced drip watering schedule (1 to 1.5 inches per week).',
        'Preserve mulch barrier (straw or black film) to maintain soil moisture stability.',
        'Continue twice-weekly scouting for early pest or disease incursions.'
      ],
      organic: [
        'Periodic application of diluted kelp/seaweed extract to enhance systemic plant vigor.',
        'Compost tea soil drenching to nurture beneficial root rhizosphere microbes.'
      ],
      chemicalCaution: 'No synthetic or protective chemical treatments required for healthy foliage.',
      sourceReference: 'State Agricultural University Good Agricultural Practices (GAP) Guidelines'
    }
  }
};

const LABEL_ALIASES = {
  // Model labels.json strings (exact match from checkpoint)
  'tomato with bacterial spot': 'Tomato___Bacterial_spot',
  'tomato with early blight': 'Tomato___Early_blight',
  'tomato with late blight': 'Tomato___Late_blight',
  'tomato with leaf mold': 'Tomato___Leaf_Mold',
  'tomato with septoria leaf spot': 'Tomato___Septoria_leaf_spot',
  'tomato with spider mites or two-spotted spider mite': 'Tomato___Spider_mites Two-spotted_spider_mite',
  'tomato with target spot': 'Tomato___Target_Spot',
  'tomato yellow leaf curl virus': 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'tomato mosaic virus': 'Tomato___Tomato_mosaic_virus',
  'healthy tomato plant': 'Tomato___healthy',

  // Raw dataset taxonomy folder names
  'tomato___bacterial_spot': 'Tomato___Bacterial_spot',
  'tomato___early_blight': 'Tomato___Early_blight',
  'tomato___late_blight': 'Tomato___Late_blight',
  'tomato___leaf_mold': 'Tomato___Leaf_Mold',
  'tomato___septoria_leaf_spot': 'Tomato___Septoria_leaf_spot',
  'tomato___spider_mites two-spotted_spider_mite': 'Tomato___Spider_mites Two-spotted_spider_mite',
  'tomato___target_spot': 'Tomato___Target_Spot',
  'tomato___tomato_yellow_leaf_curl_virus': 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'tomato___tomato_mosaic_virus': 'Tomato___Tomato_mosaic_virus',
  'tomato___healthy': 'Tomato___healthy',

  // Internal normalized disease keys
  'tomato_bacterial_spot': 'Tomato___Bacterial_spot',
  'tomato_early_blight': 'Tomato___Early_blight',
  'tomato_late_blight': 'Tomato___Late_blight',
  'tomato_leaf_mold': 'Tomato___Leaf_Mold',
  'tomato_septoria_leaf_spot': 'Tomato___Septoria_leaf_spot',
  'tomato_spider_mites': 'Tomato___Spider_mites Two-spotted_spider_mite',
  'tomato_target_spot': 'Tomato___Target_Spot',
  'tomato_yellow_leaf_curl': 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'tomato_mosaic_virus': 'Tomato___Tomato_mosaic_virus',
  'tomato_healthy': 'Tomato___healthy'
};

export function getGuidanceForLabel(rawLabel) {
  if (!rawLabel) rawLabel = '';
  const clean = String(rawLabel).toLowerCase().trim();

  // 1. Direct alias match
  const aliasKey = LABEL_ALIASES[clean];
  if (aliasKey && TOMATO_DISEASE_TAXONOMY[aliasKey]) {
    return { ...TOMATO_DISEASE_TAXONOMY[aliasKey], disclaimer: DISCLAIMER_STATEMENT };
  }

  // 2. Direct key or displayName match
  const directKey = Object.keys(TOMATO_DISEASE_TAXONOMY).find(
    k => k.toLowerCase() === clean ||
         TOMATO_DISEASE_TAXONOMY[k].displayName.toLowerCase() === clean ||
         TOMATO_DISEASE_TAXONOMY[k].diseaseKey.toLowerCase() === clean
  );
  if (directKey) {
    return { ...TOMATO_DISEASE_TAXONOMY[directKey], disclaimer: DISCLAIMER_STATEMENT };
  }

  // 3. Normalized keyword matching (strip special characters)
  const simplified = clean.replace(/[^a-z0-9]/g, '');
  const fuzzyKey = Object.keys(TOMATO_DISEASE_TAXONOMY).find(k => {
    const kSimp = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    const dSimp = TOMATO_DISEASE_TAXONOMY[k].displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return (
      simplified.includes(kSimp) ||
      kSimp.includes(simplified) ||
      simplified.includes(dSimp) ||
      dSimp.includes(simplified)
    );
  });
  if (fuzzyKey) {
    return { ...TOMATO_DISEASE_TAXONOMY[fuzzyKey], disclaimer: DISCLAIMER_STATEMENT };
  }

  return {
    diseaseKey: 'unknown_pathology',
    displayName: rawLabel || 'Unspecified Condition',
    scientificName: 'Solanum lycopersicum pathology',
    severity: 'Inconclusive',
    isHealthy: false,
    disclaimer: DISCLAIMER_STATEMENT,
    summary: 'Classification requires secondary inspection. The model confidence did not meet unambiguous diagnostic thresholds.',
    symptoms: ['Visual symptom markers are ambiguous or uncharacteristic.'],
    solutions: {
      cultural: ['Isolate the suspect plant until physical agronomist inspection.'],
      organic: ['Consult local extension office before applying sprays.'],
      chemicalCaution: 'Do not administer fungicides without positive species identification.',
      sourceReference: 'Extension Diagnostic Service'
    }
  };
}

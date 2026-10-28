// AgriVision AI - Phase 1 Mock Data & Botanical Knowledge References
// Note: All data below is clearly marked as demonstration placeholders.
// No machine learning model or database is connected in Phase 1.

export const SYSTEM_NOTICE = {
  isPrototype: true,
  phase: "Phase 1: Frontend Prototype",
  backendStatus: "Offline / Disconnected (Frontend Demo Only)",
  disclaimer: "Simulated clinical data for interface review only. Do not apply chemical fungicides based on placeholder outputs."
};

export const MOCK_DISEASE_TEMPLATES = {
  early_blight: {
    id: "early_blight",
    name: "Tomato Early Blight",
    scientificName: "Alternaria solani",
    statusType: "danger",
    severity: "High Concern",
    simulatedConfidence: 94.2,
    sampleImage: "/images/tomato_early_blight.jpg",
    affectedParts: ["Foliage", "Stems", "Fruit Calyx"],
    summary: "A common fungal disease causing characteristic dark brown spots with concentric rings, primarily affecting older bottom leaves first before spreading upward.",
    symptoms: [
      "Dark brown to black circular lesions on older lower foliage",
      "Distinct concentric rings forming a 'target-board' or bullseye pattern",
      "Chlorotic (yellowing) halo surrounding mature lesions",
      "Premature leaf drop leading to defoliation and fruit sunscald"
    ],
    solutions: {
      cultural: [
        "Prune bottom 12 inches of foliage to prevent soil splash onto lower leaves.",
        "Transition to drip or soaker hose irrigation to keep leaf canopy completely dry.",
        "Practice a strict 3-year crop rotation away from all Solanaceous plants (potatoes, peppers, eggplants).",
        "Stake and trellis tomato vines to maximize airflow and sunlight penetration."
      ],
      organic: [
        "Apply organic copper octanoate (copper soap fungicide) at initial symptom onset.",
        "Incorporate beneficial bio-fungicides containing Bacillus subtilis or Trichoderma harzianum into root zone."
      ],
      chemicalNotice: "Chemical fungicides (such as Chlorothalonil or Mancozeb) should only be administered after in-person agronomist confirmation and strict adherence to pre-harvest intervals (PHI).",
      source: "ICAR Indian Institute of Vegetable Research & USDA Tomato IPM Extension Bulletin"
    }
  },
  late_blight: {
    id: "late_blight",
    name: "Tomato Late Blight",
    scientificName: "Phytophthora infestans",
    statusType: "danger",
    severity: "Critical / Emergency",
    simulatedConfidence: 91.8,
    sampleImage: "/images/tomato_early_blight.jpg",
    affectedParts: ["Leaves", "Petiole", "Green Fruit"],
    summary: "A devastating water mold that spreads rapidly during cool, humid conditions, causing water-soaked lesions and white fungal growth on leaf undersides.",
    symptoms: [
      "Irregular, pale to dark green water-soaked spots on foliage",
      "Lesions turn purplish-brown to black during damp weather",
      "Delicate white fungal growth visible on undersides of infected leaves",
      "Rapid vine collapse and greasy brown rot on developing green fruit"
    ],
    solutions: {
      cultural: [
        "Immediately remove and bag heavily infected plants; do not compost diseased foliage.",
        "Ensure wide plant spacing (at least 24-36 inches) for rapid morning dew evaporation.",
        "Destroy cull piles and volunteer tomato/potato plants near fields."
      ],
      organic: [
        "Prophylactic copper hydroxide spray before prolonged rainy spells.",
        "Bio-rational foliar sprays with Streptomyces lydicus strains."
      ],
      chemicalNotice: "Consult local agricultural extension immediately; late blight can defoliate entire fields within 7 to 10 days if unmanaged.",
      source: "FAO Integrated Pest Management Manual for Solanaceous Crops"
    }
  },
  healthy: {
    id: "healthy",
    name: "Healthy Tomato Foliage",
    scientificName: "Solanum lycopersicum",
    statusType: "success",
    severity: "Optimal Health",
    simulatedConfidence: 97.6,
    sampleImage: "/images/tomato_healthy.jpg",
    affectedParts: ["None - Leaf Tissue Pristine"],
    summary: "Vigorous, chlorophyll-rich tomato foliage exhibiting normal serrated margins, consistent deep green coloration, and no signs of pathogen damage.",
    symptoms: [
      "No fungal lesions, necrosis, or chlorosis detected",
      "Normal cell turgor and healthy transpiration cuticle",
      "Clean leaf underside without spore masses or webbing",
      "Even vascular venation and normal leaf posture"
    ],
    solutions: {
      cultural: [
        "Continue current balanced watering schedule (1 to 1.5 inches per week).",
        "Maintain mulch layer (straw or wood shavings) to regulate soil moisture and prevent weed competition.",
        "Routine scouting twice weekly for early detection of hornworms, whiteflies, or blight."
      ],
      organic: [
        "Foliar application of diluted sea kelp or seaweed extract for systemic plant vigor.",
        "Periodic compost tea root drenching to support beneficial rhizosphere bacteria."
      ],
      chemicalNotice: "No chemical fungicides or bactericides required for healthy foliage.",
      source: "University Agricultural Extension Good Farming Practices Guide"
    }
  },
  bacterial_spot: {
    id: "bacterial_spot",
    name: "Bacterial Leaf Spot",
    scientificName: "Xanthomonas perforans",
    statusType: "warning",
    severity: "Moderate Concern",
    simulatedConfidence: 88.5,
    sampleImage: "/images/tomato_early_blight.jpg",
    affectedParts: ["Leaflets", "Stems", "Fruit"],
    summary: "Bacterial pathogen favored by high temperatures and driving rains, producing small, dark, angular spots that may develop shot-hole centers.",
    symptoms: [
      "Small (less than 3mm), water-soaked angular dark brown lesions",
      "Centers of older lesions may dry out and fall away ('shot-hole' effect)",
      "Yellowing of leaflets followed by browning and curl",
      "Severe infections lead to general foliage scorched appearance"
    ],
    solutions: {
      cultural: [
        "Never work in wet fields or prune plants while foliage is wet.",
        "Use certified disease-free seed and hot water seed treatment protocols.",
        "Sanitize all stakes, pruning shears, and harvesting crates with 10% bleach solution."
      ],
      organic: [
        "Fixed copper sprays combined with mancozeb or organic copper-soap formulations.",
        "Bacteriophage biopesticides specifically registered for Xanthomonas."
      ],
      chemicalNotice: "Standard fungicides do not kill bacteria. Verify bacterial identification with a plant diagnostic lab before treatment.",
      source: "CABI Plantwise Knowledge Bank - Tomato Pathology"
    }
  }
};

export const INITIAL_SCAN_HISTORY = [
  {
    id: "SCN-2026-1042",
    date: "2026-10-21 • 14:15",
    timestamp: 1792592000000,
    diseaseKey: "early_blight",
    diseaseName: "Tomato Early Blight",
    scientificName: "Alternaria solani",
    statusType: "danger",
    severity: "High Concern",
    confidence: 94.2,
    imageUrl: "/images/tomato_early_blight.jpg",
    leafPart: "Lower Canopy Leaflet",
    isDemoSample: true
  },
  {
    id: "SCN-2026-1041",
    date: "2026-10-20 • 09:30",
    timestamp: 1792505000000,
    diseaseKey: "healthy",
    diseaseName: "Healthy Tomato Foliage",
    scientificName: "Solanum lycopersicum",
    statusType: "success",
    severity: "Optimal Health",
    confidence: 97.6,
    imageUrl: "/images/tomato_healthy.jpg",
    leafPart: "Upper New Shoot",
    isDemoSample: true
  },
  {
    id: "SCN-2026-1039",
    date: "2026-10-18 • 16:45",
    timestamp: 1792345000000,
    diseaseKey: "bacterial_spot",
    diseaseName: "Bacterial Leaf Spot",
    scientificName: "Xanthomonas perforans",
    statusType: "warning",
    severity: "Moderate Concern",
    confidence: 88.5,
    imageUrl: "/images/tomato_early_blight.jpg",
    leafPart: "Mid-tier Leaflet",
    isDemoSample: true
  },
  {
    id: "SCN-2026-1035",
    date: "2026-10-15 • 11:20",
    timestamp: 1792080000000,
    diseaseKey: "early_blight",
    diseaseName: "Tomato Early Blight",
    scientificName: "Alternaria solani",
    statusType: "danger",
    severity: "High Concern",
    confidence: 92.1,
    imageUrl: "/images/tomato_early_blight.jpg",
    leafPart: "Lower Foliage",
    isDemoSample: true
  }
];

export const CAPTURE_GUIDELINES = [
  {
    id: "single_leaf",
    title: "Isolate Single Leaf",
    desc: "Frame one primary leaflet flat against the camera lens. Avoid crowded background weeds or soil clutter."
  },
  {
    id: "natural_light",
    title: "Diffused Natural Light",
    desc: "Capture during daylight without harsh flashlight reflections or heavy shadows that mask lesion colors."
  },
  {
    id: "sharp_focus",
    title: "Sharp Close-up Focus",
    desc: "Ensure the leaf veins and lesion margins are in crisp focus. Discard blurry or motion-shaken photos."
  },
  {
    id: "both_surfaces",
    title: "Check Both Surfaces",
    desc: "If powdery or moldy growth is visible, photograph the underside of the leaflet as well."
  }
];

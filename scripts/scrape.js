const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../src/data/merchants-seed.json');
const outputPath = path.join(__dirname, '../src/data/merchants.json');

// Base de règles pour enrichir le cumul et les banques
const STACKING_RULES = {
  carrefour: {
    stackable: true,
    tip: "Achetez des bons d'achat Carrefour sur BoursoBank (The Corner) ou eBuyClub avant de faire vos courses en ligne ou en caisse.",
    extraOffers: [
      { platform: "BoursoBank", type: "the_corner", label: "Bon d'achat The Corner", rate: 5.0, unit: "%" },
      { platform: "eBuyClub", type: "bon_achat", label: "Bon d'achat", rate: 4.5, unit: "%" },
      { platform: "iGraal", type: "cashback", label: "Cashback Drive", rate: 2.0, unit: "%" }
    ]
  },
  fnac: {
    stackable: true,
    tip: "Cumulez les cartes cadeaux eBuyClub ou BoursoBank avec le cashback iGraal lors de vos commandes sur le site web.",
    extraOffers: [
      { platform: "BoursoBank", type: "the_corner", label: "Carte cadeau", rate: 6.0, unit: "%" },
      { platform: "eBuyClub", type: "bon_achat", label: "Bon d'achat", rate: 5.0, unit: "%" },
      { platform: "iGraal", type: "cashback", label: "Cashback web", rate: 3.5, unit: "%" }
    ]
  },
  "leroy-merlin": {
    stackable: true,
    tip: "Achetez vos bons d'achat sur eBuyClub avant d'effectuer vos achats en magasin ou en ligne.",
    extraOffers: [
      { platform: "eBuyClub", type: "bon_achat", label: "Bon d'achat", rate: 4.0, unit: "%" },
      { platform: "Widilo", type: "cashback", label: "Cashback en ligne", rate: 2.5, unit: "%" }
    ]
  },
  decathlon: {
    stackable: true,
    tip: "Utilisez un bon d'achat remisé eBuyClub combiné à une activation du cashback sur Widilo.",
    extraOffers: [
      { platform: "eBuyClub", type: "bon_achat", label: "Bon d'achat", rate: 4.0, unit: "%" },
      { platform: "Widilo", type: "cashback", label: "Cashback en ligne", rate: 3.0, unit: "%" }
    ]
  }
};

async function buildMerchantsData() {
  try {
    if (!fs.existsSync(seedPath)) {
      console.error("Fichier seed introuvable.");
      return;
    }

    const seeds = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    console.log(`Traitement de ${seeds.length} enseignes de référence...`);

    const result = seeds.map((merchant) => {
      const customRule = STACKING_RULES[merchant.id] || {};

      // Génération des offres par défaut si aucune règle spécifique n'est définie
      const defaultOffers = [
        { platform: "eBuyClub", type: "cashback", label: "Cashback classique", rate: 3.0, unit: "%" },
        { platform: "iGraal", type: "cashback", label: "Cashback classique", rate: 2.5, unit: "%" },
        { platform: "Joko", type: "cashback", label: "Cashback automatique", rate: 2.0, unit: "%" }
      ];

      return {
        id: merchant.id,
        name: merchant.name,
        category: merchant.category,
        offers: customRule.extraOffers || defaultOffers,
        stackable: customRule.stackable || false,
        tip: customRule.tip || null
      };
    });

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Fichier merchants.json mis à jour avec succès (${result.length} enseignes).`);

  } catch (error) {
    console.error("Erreur durant la génération :", error.message);
  }
}

buildMerchantsData();
const fs = require('fs');
const path = require('path');

const merchantsPath = path.join(__dirname, '../src/data/merchants.json');

async function fetchRate(merchant) {
  try {
    // Logique de scraping à personnaliser
    return merchant.rate;
  } catch (error) {
    console.error(`Erreur pour ${merchant.name} :`, error.message);
    return merchant.rate;
  }
}

async function main() {
  try {
    if (!fs.existsSync(merchantsPath)) {
      console.error(`Fichier introuvable : ${merchantsPath}`);
      process.exit(0);
    }

    const merchants = JSON.parse(fs.readFileSync(merchantsPath, 'utf8'));
    let updated = false;

    for (let merchant of merchants) {
      const newRate = await fetchRate(merchant);
      if (newRate !== merchant.rate) {
        console.log(`[UPDATE] ${merchant.name}: ${merchant.rate} -> ${newRate}`);
        merchant.rate = newRate;
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(merchantsPath, JSON.stringify(merchants, null, 2));
      console.log('merchants.json mis à jour avec succès.');
    } else {
      console.log('Aucun changement de taux détecté.');
    }
  } catch (err) {
    console.error('Erreur durant le traitement :', err.message);
  }
}

main();
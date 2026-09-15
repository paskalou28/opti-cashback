const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const merchantsPath = path.join(__dirname, '../src/data/merchants.json');

// Dictionnaire des sélecteurs ou URLs selon les plateformes
async function fetchRate(merchant) {
  try {
    // Exemple d'extraction HTTP (à adapter selon les balises HTML des sites cibles)
    /*
    if (merchant.platform === 'eBuyClub') {
      const res = await fetch(`https://www.ebuyclub.com/cashback/${merchant.name.toLowerCase()}`);
      const html = await res.text();
      const $ = cheerio.load(html);
      const rate = $('.cashback-rate').first().text().trim();
      return rate || merchant.rate;
    }
    */
    return merchant.rate; // Conserve le taux actuel si aucune regle ne matche
  } catch (error) {
    console.error(`Erreur pour ${merchant.name} :`, error.message);
    return merchant.rate;
  }
}

async function main() {
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
    console.log('Aunement aucun changement de taux détecté.');
  }
}

main();
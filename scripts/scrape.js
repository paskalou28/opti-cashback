const fs = require('fs');
const path = require('path');

const merchantsPath = path.join(__dirname, '../src/data/merchants.json');

async function main() {
  try {
    if (!fs.existsSync(merchantsPath)) {
      console.log(`Fichier introuvable : ${merchantsPath}`);
      return;
    }

    const merchants = JSON.parse(fs.readFileSync(merchantsPath, 'utf8'));
    console.log(`Lecture de ${merchants.length} marchands réussie.`);

    // Traitement automatique des offres à venir ici...

  } catch (err) {
    console.error('Erreur durant le scraping :', err.message);
  }
}

main();
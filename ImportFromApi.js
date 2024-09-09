(async () => {
    const { default: pLimit } = await import('p-limit');
    const limit = pLimit(10);

    require('dotenv').config(); // Charger les variables d'environnement
    const axios = require('axios');
    const XLSX = require('xlsx');
    
    // Informations de connexion API Shopify
    const shopifyStoreName = process.env.SHOPIFY_STORE_NAME;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shopifyUrl = `https://${shopifyStoreName}/admin/api/2023-01/products.json`;

    // Chemin du fichier Excel
    const excelFilePath = 'sneakers_data.xlsx';

    // Fonction pour créer un produit dans Shopify
    async function createProductInShopify(productDataForShopify) {
        const headers = {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
        };

        try {
            console.log('URL de la requête :', shopifyUrl);
            console.log('Données du produit pour Shopify :', JSON.stringify(productDataForShopify, null, 2));

            const response = await axios.post(shopifyUrl, productDataForShopify, { headers });

            console.log('Produit créé avec succès!');
            console.log('Réponse de l\'API :', response.data);
        } catch (error) {
            console.error('Erreur lors de la création du produit :', error.message);

            if (error.response) {
                console.error('Code de statut HTTP :', error.response.status);
                console.error('Données de la réponse :', error.response.data);
            }
        }
    }

    // Fonction pour lire les données du fichier Excel
    function readExcelFile(filePath) {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet);
    }

    // Fonction pour obtenir les données des produits depuis le fichier Excel et les transformer pour Shopify
    async function fetchAndTransformProductData() {
        try {
            const productListFromExcel = readExcelFile(excelFilePath);

            // Transformer les produits en requêtes Shopify
            const productPromises = productListFromExcel.map(productDataFromExcel => limit(async () => {
                const attributes = productDataFromExcel;

                // Préparer les images, y compris celles du champ 360
                const images = [
                    attributes['Image Small'],
                    attributes['Image Original'],
                    attributes['Image Thumbnail']
                ].filter(src => src); // Filtrer les URL vides

                // Ajouter des images du champ 360 si elles existent
                if (attributes['Image 360'] && attributes['Image 360'].length > 0) {
                    images.push(...attributes['Image 360'].split(',').map(url => url.trim()));
                }

                const productDataForShopify = {
                    product: {
                        title: attributes['Name'],
                        body_html: `<strong>Brand:</strong> ${attributes['Brand']}<br>
                                    <strong>Colorway:</strong> ${attributes['Colorway']}<br>
                                    <strong>Gender:</strong> ${attributes['Gender']}<br>
                                    <strong>Retail Price:</strong> $${attributes['Retail Price']}<br>
                                    <strong>Estimated Market Value:</strong> $${attributes['Estimated Market Value']}<br>
                                    <strong>Release Date:</strong> ${attributes['Release Date']}<br>
                                    <strong>Story:</strong> ${attributes['Story'] || 'No story available'}<br>
                                    <strong>Links:</strong><br>
                                    <a href="${attributes['Goat Link']}">Goat</a><br>
                                    <a href="${attributes['StockX Link']}">StockX</a><br>
                                    <a href="${attributes['FlightClub Link']}">Flight Club</a>`,
                        vendor: attributes['Brand'],
                        product_type: attributes['Silhouette'],
                        variants: [
                            {
                                option1: attributes['Colorway'],
                                price: attributes['Retail Price'].toString(),
                                sku: attributes['SKU']
                            }
                        ],
                        images: images.map(src => ({ src })) // Format des images pour Shopify
                    }
                };

                // Envoi du produit à Shopify
                await createProductInShopify(productDataForShopify);
            }));

            // Exécuter toutes les promesses en parallèle avec la limite définie
            await Promise.all(productPromises);

        } catch (error) {
            console.error('Erreur lors de la récupération des données des produits :', error.message);

            if (error.response) {
                console.error('Code de statut HTTP :', error.response.status);
                console.error('Données de la réponse :', error.response.data);
            }
        }
    }

    // Appel de la fonction pour récupérer et transformer les données puis créer les produits
    fetchAndTransformProductData();
})();

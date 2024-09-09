import requests
import pandas as pd
from dotenv import load_dotenv
import os

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Configuration Shopify
shop_url = os.getenv('SHOPIFY_STORE_NAME')
access_token = os.getenv('SHOPIFY_ACCESS_TOKEN')

headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': access_token
}

# Fonction pour nettoyer les valeurs
def clean_value(value):
    if pd.isna(value):
        return ''  # Ou une autre valeur par défaut appropriée
    return value

# Fonction pour formater les données du produit
def format_product_data(row):
    return {
        'product': {
            'title': clean_value(row['Name']),
            'body_html': clean_value(row['Story']),
            'vendor': clean_value(row['Brand']),
            'product_type': clean_value(row['Silhouette']),
            'variants': [
                {
                    'price': clean_value(row['Retail Price']),
                    'sku': clean_value(row['SKU']),
                    'inventory_quantity': 0,  # Ajuste cette valeur si nécessaire
                }
            ],
            'images': [
                {
                    'src': clean_value(row['Image Small'])
                },
                {
                    'src': clean_value(row['Image Original'])
                },
                {
                    'src': clean_value(row['Image Thumbnail'])
                },
                # Ajouter plus d'images si nécessaire
            ],
            'metafields': [
                {
                    'namespace': 'global',
                    'key': 'colorway',
                    'value': clean_value(row['Colorway']),
                    'value_type': 'string'
                },
                {
                    'namespace': 'global',
                    'key': 'estimated_market_value',
                    'value': clean_value(row['Estimated Market Value']),
                    'value_type': 'string'
                },
                {
                    'namespace': 'global',
                    'key': 'release_date',
                    'value': clean_value(row['Release Date']),
                    'value_type': 'string'
                },
                {
                    'namespace': 'global',
                    'key': 'release_year',
                    'value': clean_value(row['Release Year']),
                    'value_type': 'string'
                },
                {
                    'namespace': 'global',
                    'key': 'gender',
                    'value': clean_value(row['Gender']),
                    'value_type': 'string'
                },
                # Ajouter plus de champs personnalisés si nécessaire
            ]
        }
    }

# Chargement des données à importer
df = pd.read_excel('sneakers_data.xlsx')

# Importation des produits dans Shopify
for _, row in df.iterrows():
    product_data = format_product_data(row)
    response = requests.post(shop_url, json=product_data, headers=headers)
    
    if response.status_code == 201:
        print(f"Produit '{row['Name']}' importé avec succès.")
    else:
        print(f"Erreur lors de l'importation du produit '{row['Name']}': {response.status_code} - {response.text}")

print("Importation terminée.")
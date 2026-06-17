from db.db_config import local_session
from models.db_seller import Seller_database
from models.db_inventory import Inventory_database

from scripts.csvdata_seller_import import import_seller_csv
from scripts.csvdata_inventory_import import import_inventory_csv


def seed_database():

    db = local_session()

    try:

        seller_count = db.query(Seller_database).count()

        if seller_count == 0:
            print("Importing sellers...")
            import_seller_csv()

        inventory_count = db.query(Inventory_database).count()

        if inventory_count == 0:
            print("Importing inventory...")
            import_inventory_csv()

    finally:
        db.close()
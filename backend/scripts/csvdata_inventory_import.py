# NOTE: This script imports inventory data from a CSV file into the database using SQLAlchemy ORM. It should be run after importing seller data from CSV as inventory items require valid seller IDs to be added to the database.

import csv

from db.db_config import local_session
from models.db_inventory import Inventory_database

ls = local_session()


with open("sample_data\\_inventory_data.csv", encoding="utf-8-sig") as file:

    reader = csv.DictReader(file)

    print(reader.fieldnames)

    for row in reader:

        existing_item = (
            ls.query(Inventory_database)
            .filter(
                Inventory_database.item_name == row["item_name"],
                Inventory_database.item_description == row["item_description"],
                Inventory_database.seller_id == int(row["seller_id"]),
            )
            .first()
        )

        if existing_item:
            print(f"{row["item_name"]} already exists")
            continue

        item = Inventory_database(
            item_name=row["item_name"],
            item_description=row["item_description"],
            item_category=row["item_category"],
            item_price=float(row["item_price"]),
            item_stock_qty=int(row["item_stock_qty"]),
            in_stock=row["in_stock"].strip().lower() == "true",
            seller_id=int(row["seller_id"]),
        )

        ls.add(item)

    ls.commit()

    ls.close()

    print("Inventory CSV data imported successfully!")

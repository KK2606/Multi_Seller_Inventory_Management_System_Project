# NOTE: This script imports inventory data from a CSV file into the database using SQLAlchemy ORM.
# It should be run after importing seller data.

import csv
from pathlib import Path

from db.db_config import local_session
from models.db_inventory import Inventory_database


def import_inventory_csv():

    csv_path = (
        Path(__file__).resolve().parent.parent
        / "sample_data"
        / "_inventory_data.csv"
    )

    ls = local_session()

    try:

        with open(csv_path, encoding="utf-8-sig") as file:

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
                    print(f"{row['item_name']} already exists")
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

        print("Inventory CSV data imported successfully!")

    finally:
        ls.close()
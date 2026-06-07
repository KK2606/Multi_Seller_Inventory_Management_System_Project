# NOTE: This script imports seller data from a CSV file into the database using SQLAlchemy ORM. It should be run before importing inventory data from CSV as inventory items require valid seller IDs in inventory table to be added to the database.

import csv

from db.db_config import local_session
from models.db_seller import Seller_database

ls = local_session()

with open("sample_data\\_seller_data.csv", encoding="utf-8-sig") as file:

    reader = csv.DictReader(file)
    print(reader.fieldnames)

    for row in reader:

        existing_seller = (
            ls.query(Seller_database)
            .filter(
                Seller_database.seller_email == row["seller_email"],
                Seller_database.seller_key == row["seller_key"],
            )
            .first()
        )

        if existing_seller:
            print(f"{row['seller_name']} already exists")
            continue

        seller = Seller_database(
            seller_name=row["seller_name"],
            seller_email=row["seller_email"],
            seller_key=row["seller_key"],
        )

        ls.add(seller)

    ls.commit()

    ls.close()

    print("Seller CSV data imported successfully!")

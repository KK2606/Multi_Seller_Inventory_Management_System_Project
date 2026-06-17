# NOTE: This script imports seller data from a CSV file into the database using SQLAlchemy ORM.
# It should be run before importing inventory data as inventory records require valid seller IDs.

import csv
from pathlib import Path

from db.db_config import local_session
from models.db_seller import Seller_database


def import_seller_csv():

    csv_path = (
        Path(__file__).resolve().parent.parent
        / "sample_data"
        / "_seller_data.csv"
    )

    ls = local_session()

    try:

        with open(csv_path, encoding="utf-8-sig") as file:

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

        print("Seller CSV data imported successfully!")

    finally:
        ls.close()
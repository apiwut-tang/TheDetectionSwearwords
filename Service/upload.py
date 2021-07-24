from google.cloud import storage


def upload_blob(source_file_name):
    """Uploads a file to the bucket."""
    bucket_name = "tangstorage_bucket"
    # source_file_name = "tangstorage_bucket/Datasets"
    destination_blob_name = "Datasets/output.wav"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(
        "File {} uploaded to {}.".format(
            source_file_name, destination_blob_name
        )
    )

if __name__ == "__main__":
    upload_blob("C:\Work\ProjectSoundEnglish\cloud storage\Scene.wav")

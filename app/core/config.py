class Settings:
    app_name: str = "Vereasy API"
    version: str = "0.1.0"

settings = Settings()


from dotenv import load_dotenv


import os

load_dotenv()  # Carga las variables desde .env

class Settings:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "vereasy")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "7410")

    @property
    def DATABASE_URL(self):
        return (
            f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

settings = Settings()

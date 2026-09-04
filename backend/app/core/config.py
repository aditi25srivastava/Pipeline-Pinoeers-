from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pipeline Pioneers API"
    DATABASE_URL: str = "postgresql://admin:password@localhost:5432/pipeline_pioneers"

    class Config:
        env_file = ".env"

settings = Settings()

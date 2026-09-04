from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pipeline Pioneers API"
    DATABASE_URL: str = "sqlite:///./pipeline_pioneers.db"

    class Config:
        env_file = ".env"

settings = Settings()

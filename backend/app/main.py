from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.routers import projects, webhooks, metrics
from app.core.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pipeline Pioneers API")

# Instrument the app to expose /metrics
Instrumentator().instrument(app).expose(app)

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(webhooks.router)
app.include_router(metrics.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Pipeline Pioneers API"}

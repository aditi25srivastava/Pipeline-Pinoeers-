from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.routers import projects, webhooks, metrics
from app.core.database import engine, Base, SessionLocal
from app.models import domain as models

# Create tables
Base.metadata.create_all(bind=engine)

# Seed database if empty
db = SessionLocal()
if db.query(models.Project).count() == 0:
    p1 = models.Project(name="ecommerce/api", description="Main backend API", status="healthy", health_score=98)
    p2 = models.Project(name="payments/service", description="Payment gateway", status="deploying", health_score=85)
    db.add_all([p1, p2])
    db.commit()
    
    r1 = models.PipelineRun(project_id=p1.id, version="v1.4.2", status="completed", commit_sha="a1b2c3d", commit_message="Fix checkout bug", author_name="Aditi")
    r2 = models.PipelineRun(project_id=p2.id, version="v2.0.1", status="running", commit_sha="e5f6g7h", commit_message="Update Stripe SDK", author_name="System")
    db.add_all([r1, r2])
    
    a1 = models.Activity(user_name="Aditi", action="deployed to production", target="ecommerce/api")
    db.add(a1)
    db.commit()
db.close()

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

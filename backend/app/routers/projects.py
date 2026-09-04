from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.core.database import SessionLocal
from app.models import domain as models
from app.schemas import domain as schemas
from app.core import jenkins_client

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/projects/{project_id}/trigger")
def trigger_project_run(project_id: uuid.UUID, db: Session = Depends(get_db)):
    # Demo override
    project = db.query(models.Project).filter(models.Project.name == "ecommerce/api").first()
    if not project:
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 1. Create a pending run
    run = models.PipelineRun(
        project_id=project.id,
        version="manual-run",
        status="pending",
        commit_sha="manual",
        commit_message="Manual Trigger via Dashboard",
        author_name="Admin"
    )
    db.add(run)

    # 2. Log activity
    activity = models.Activity(
        user_name="Admin",
        user_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        action="manually triggered deployment for",
        target=project.name
    )
    db.add(activity)
    
    db.commit()

    # 3. Call Jenkins
    success, msg = jenkins_client.trigger_jenkins_job(project.name)

    return {"status": "ok", "message": msg, "jenkins_success": success}

@router.get("/projects", response_model=List[schemas.ProjectResponse])
def read_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@router.get("/runs", response_model=List[schemas.PipelineRunResponse])
def read_runs(limit: int = 10, db: Session = Depends(get_db)):
    return db.query(models.PipelineRun).order_by(models.PipelineRun.started_at.desc()).limit(limit).all()

@router.get("/stats")
def read_stats(db: Session = Depends(get_db)):
    total_projects = db.query(models.Project).count()
    total_runs = db.query(models.PipelineRun).count()
    failed_runs = db.query(models.PipelineRun).filter(models.PipelineRun.status == "failed").count()
    
    success_rate = 100
    if total_runs > 0:
        success_rate = ((total_runs - failed_runs) / total_runs) * 100

    active_rollbacks = db.query(models.Project).filter(models.Project.status == "failed").count()

    return {
        "total_projects": total_projects,
        "total_runs": total_runs,
        "success_rate": round(success_rate, 1),
        "active_rollbacks": active_rollbacks
    }

@router.get("/activities", response_model=List[schemas.ActivityResponse])
def read_activities(limit: int = 10, db: Session = Depends(get_db)):
    return db.query(models.Activity).order_by(models.Activity.timestamp.desc()).limit(limit).all()

@router.post("/projects/{project_id}/rollback")
def trigger_project_rollback(project_id: uuid.UUID, db: Session = Depends(get_db)):
    # Demo override
    project = db.query(models.Project).filter(models.Project.name == "ecommerce/api").first()
    if not project:
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.status = "failed"
    
    run = models.PipelineRun(
        project_id=project.id,
        version="rollback-run",
        status="pending",
        commit_sha="rollback",
        commit_message="Automatic Rollback Triggered",
        author_name="System"
    )
    db.add(run)

    activity = models.Activity(
        user_name="System",
        user_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=System",
        action="initiated an automatic rollback for",
        target=project.name
    )
    db.add(activity)
    
    db.commit()

    success, msg = jenkins_client.trigger_jenkins_job(project.name)

    return {"status": "ok", "message": f"Rollback initiated: {msg}", "jenkins_success": success}

@router.post("/projects/{project_id}/simulate-failure")
def simulate_project_failure(project_id: uuid.UUID, db: Session = Depends(get_db)):
    # For this demo, always force the simulate failure to target ecommerce/api 
    # so we don't accidentally rollback auth/gateway
    project = db.query(models.Project).filter(models.Project.name == "ecommerce/api").first()
    
    if not project:
        # Fallback to the requested one if ecommerce/api is missing
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.status = "failed"
    
    activity = models.Activity(
        user_name="Chaos Monkey",
        user_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Chaos",
        action="simulated a catastrophic failure in",
        target=project.name
    )
    db.add(activity)
    db.commit()
    
    # Automatically trigger rollback
    return trigger_project_rollback(project.id, db)

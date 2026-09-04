from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import domain as models
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

class JenkinsWebhookPayload(BaseModel):
    name: str # e.g. "ecommerce-api"
    url: str
    build: Dict[str, Any]

@router.post("/jenkins")
async def jenkins_webhook(payload: JenkinsWebhookPayload, db: Session = Depends(get_db)):
    """
    Receives webhook events from Jenkins (e.g. using the Notification Plugin)
    """
    project_name = payload.name
    build_phase = payload.build.get("phase", "UNKNOWN") # STARTED, COMPLETED, FINISHED
    build_status = payload.build.get("status", "UNKNOWN") # SUCCESS, FAILURE, ABORTED
    build_number = payload.build.get("number", 0)
    
    # 1. Find the project
    project = db.query(models.Project).filter(models.Project.name.like(f"%{project_name}%")).first()
    if not project:
        # Fallback or create dummy for now if project not found
        project = db.query(models.Project).first()
        if not project:
            raise HTTPException(status_code=404, detail="No projects found to attach run to")

    # Determine our mapped status
    mapped_status = "running"
    if build_phase in ["COMPLETED", "FINISHED"]:
        mapped_status = "completed" if build_status == "SUCCESS" else "failed"

    # 2. Update or Create Pipeline Run
    # In a real app we'd match by a unique build ID or URL. Here we match by project and run_id if we have one.
    run = db.query(models.PipelineRun).filter(
        models.PipelineRun.project_id == project.id,
        models.PipelineRun.commit_message.like(f"Jenkins Build #{build_number}%")
    ).first()

    if not run:
        run = models.PipelineRun(
            project_id=project.id,
            version=f"bld-{build_number}",
            status=mapped_status,
            commit_sha=f"bld{build_number}",
            commit_message=f"Jenkins Build #{build_number}",
            author_name="Jenkins",
        )
        db.add(run)
    else:
        run.status = mapped_status

    # 3. Add Activity
    action = f"started build #{build_number} for"
    if mapped_status == "completed":
        action = f"successfully completed build #{build_number} for"
    elif mapped_status == "failed":
        action = f"failed build #{build_number} for"

    activity = models.Activity(
        user_name="Jenkins",
        user_avatar="https://api.dicebear.com/7.x/bottts/svg?seed=Jenkins",
        action=action,
        target=project.name
    )
    db.add(activity)

    run.completed_at = datetime.utcnow()
    if mapped_status == "completed":
        project.status = "healthy"
    elif mapped_status == "failed":
        # If the build failed organically, we shouldn't necessarily trigger an endless loop of rollbacks.
        # But for the sake of this demo, let's trigger our rollback function directly if it's not already a rollback
        if run.version != "rollback-run":
            from app.routers.projects import trigger_project_rollback
            # Trigger rollback in a background task or just call it directly
            # Wait, calling it directly here will mark project as failed and create a new run
            trigger_project_rollback(project.id, db)
        else:
            project.status = "failed"
            
    db.commit()

    return {"status": "ok", "message": f"Processed Jenkins build {build_number} for {project.name}"}

@router.post("/github")
async def github_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    
    # 1. Verify GitHub Signature (Skipped for local prototype)
    
    # 2. Extract Data
    try:
        repo_name = payload["repository"]["name"]
        commit_sha = payload["head_commit"]["id"]
        commit_msg = payload["head_commit"]["message"]
        author = payload["head_commit"]["author"]["name"]
        author_avatar = payload["sender"]["avatar_url"]
    except KeyError:
        return {"status": "ignored", "message": "Not a valid push event"}

    # 3. Find Project
    project = db.query(models.Project).filter(models.Project.name.like(f"%{repo_name}%")).first()
    if not project:
        return {"status": "ignored", "message": "Project not configured in Pipeline Pioneers"}

    # 4. Create Pipeline Run
    run = models.PipelineRun(
        project_id=project.id,
        version="pending",
        status="pending",
        commit_sha=commit_sha[:7],
        commit_message=commit_msg,
        author_name=author,
        author_avatar=author_avatar
    )
    db.add(run)

    # 5. Create Activity
    activity = models.Activity(
        user_name=author,
        user_avatar=author_avatar,
        action="pushed commit to",
        target=project.name
    )
    db.add(activity)

    db.commit()

    # 6. Trigger Jenkins (To be implemented)
    # trigger_jenkins_job(project.name, payload["ref"])

    return {"status": "ok", "message": f"Pipeline triggered for {project.name}"}

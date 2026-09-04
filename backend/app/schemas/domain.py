from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class ActivityBase(BaseModel):
    user_name: str
    user_avatar: Optional[str] = None
    action: str
    target: str

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: UUID
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)

class PipelineRunBase(BaseModel):
    version: str
    status: str
    commit_sha: Optional[str] = None
    commit_message: Optional[str] = None
    author_name: Optional[str] = None
    author_avatar: Optional[str] = None

class PipelineRunCreate(PipelineRunBase):
    project_id: UUID

class PipelineRunResponse(PipelineRunBase):
    id: UUID
    project_id: UUID
    project_name: Optional[str] = None
    project_env: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class ProjectBase(BaseModel):
    name: str
    environment: str
    status: str
    github_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: UUID
    runs: List[PipelineRunResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

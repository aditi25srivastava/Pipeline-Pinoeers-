from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    environment = Column(String, nullable=False) # PROD, STG, DEV
    status = Column(String, nullable=False) # healthy, degraded, failed
    github_url = Column(String, nullable=True)

    runs = relationship("PipelineRun", back_populates="project", cascade="all, delete-orphan")

class PipelineRun(Base):
    __tablename__ = "pipeline_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    version = Column(String, nullable=False)
    status = Column(String, nullable=False) # success, failed, active, pending
    commit_sha = Column(String, nullable=True)
    commit_message = Column(String, nullable=True)
    author_name = Column(String, nullable=True)
    author_avatar = Column(String, nullable=True)
    
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="runs")
    
    @property
    def project_name(self):
        return self.project.name if self.project else None

    @property
    def project_env(self):
        return self.project.environment if self.project else None

class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_name = Column(String, nullable=False)
    user_avatar = Column(String, nullable=True)
    action = Column(String, nullable=False)
    target = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

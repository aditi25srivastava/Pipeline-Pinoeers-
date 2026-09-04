from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models import domain as models

def seed():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already seeded
    if db.query(models.Project).first():
        print("Database already seeded!")
        db.close()
        return

    print("Seeding Projects...")
    p1 = models.Project(name="ecommerce/api", environment="PROD", status="healthy", github_url="https://github.com/ecommerce/api")
    p2 = models.Project(name="payments/service", environment="STG", status="healthy", github_url="https://github.com/payments/service")
    p3 = models.Project(name="auth/gateway", environment="PROD", status="failed", github_url="https://github.com/auth/gateway")
    p4 = models.Project(name="inventory/sync", environment="DEV", status="healthy", github_url="https://github.com/inventory/sync")
    p5 = models.Project(name="frontend/store", environment="PROD", status="failed", github_url="https://github.com/frontend/store")
    p6 = models.Project(name="notification/sms", environment="PROD", status="healthy", github_url="https://github.com/notification/sms")
    
    db.add_all([p1, p2, p3, p4, p5, p6])
    db.commit()

    print("Seeding Pipeline Runs...")
    # Add runs for ecommerce/api (p1)
    run1 = models.PipelineRun(project_id=p1.id, version="v1.4.2", status="success", commit_sha="8b3c9a2", commit_message="Fix checkout bug", author_name="Felix", author_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")
    
    # Add runs for payments/service (p2)
    run2 = models.PipelineRun(project_id=p2.id, version="v2.0.1", status="success", commit_sha="1a4f8d9", commit_message="Update Stripe SDK", author_name="Aneka", author_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka")
    
    # Add runs for auth/gateway (p3)
    run3 = models.PipelineRun(project_id=p3.id, version="v0.9.7", status="failed", commit_sha="c7f90e1", commit_message="Refactor OAuth flow", author_name="Jack", author_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Jack")

    # Add runs for inventory/sync (p4)
    run4 = models.PipelineRun(project_id=p4.id, version="v3.1.0", status="success", commit_sha="9d2b1c4", commit_message="Add Redis caching", author_name="Molly", author_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Molly")
    
    db.add_all([run1, run2, run3, run4])
    db.commit()

    print("Seeding Activity Feed...")
    a1 = models.Activity(user_name="Sarah J.", user_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", action="triggered deployment for", target="ecommerce/api")
    a2 = models.Activity(user_name="Mike T.", user_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", action="reverted commit in", target="auth/gateway")
    a3 = models.Activity(user_name="System", user_avatar="https://api.dicebear.com/7.x/bottts/svg?seed=System", action="auto-scaled runner pool", target="production-cluster")
    a4 = models.Activity(user_name="Alex W.", user_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", action="updated secrets for", target="inventory/sync")
    
    db.add_all([a1, a2, a3, a4])
    db.commit()
    db.close()
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()

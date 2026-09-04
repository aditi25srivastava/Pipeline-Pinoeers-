from app.core.database import SessionLocal
from app.models import domain as models

def insert_test_data():
    db = SessionLocal()
    
    # Create a brand new activity
    new_activity = models.Activity(
        user_name="Aditi (You!)", 
        user_avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi", 
        action="tested the new", 
        target="PostgreSQL Database!"
    )
    
    db.add(new_activity)
    db.commit()
    print("✅ Successfully inserted a new test activity into the PostgreSQL Database!")
    db.close()

if __name__ == "__main__":
    insert_test_data()

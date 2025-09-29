from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from shared.config import settings

DATABASE_URL = (
    f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
)

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from sqlalchemy import Column, Integer, String, Date
from app.database.conexion import Base

class Nino(Base):
    __tablename__ = "ninos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    ci = Column(String, unique=True, nullable=False)

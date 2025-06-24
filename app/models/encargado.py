from sqlalchemy import Column, Integer, String
from app.database.conexion import Base

class Encargado(Base):
    __tablename__ = "encargados"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    ci = Column(String, unique=True, nullable=False)
    telefono = Column(String, nullable=False)
    direccion = Column(String, nullable=False)
    correo = Column(String, nullable=True)

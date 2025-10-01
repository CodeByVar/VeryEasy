from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.conexion import Base

class Encargado(Base):
    __tablename__ = "encargados"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255), nullable=False)
    ci = Column(String(20), unique=True, nullable=False)
    telefono = Column(String(20), nullable=False)
    telefono_alternativo = Column(String(20), nullable=True)
    direccion = Column(Text, nullable=False)
    correo = Column(String(255), nullable=True)
    parentesco = Column(String(50), nullable=False)  # Padre, Madre, Abuelo, Tío, etc.
    ocupacion = Column(String(100), nullable=True)
    lugar_trabajo = Column(String(255), nullable=True)
    telefono_trabajo = Column(String(20), nullable=True)
    estado = Column(String(20), default="Activo")  # Activo, Inactivo
    observaciones = Column(Text, nullable=True)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
    es_contacto_emergencia = Column(Boolean, default=False)
    
    # Relaciones
    permisos = relationship("Permiso", back_populates="encargado")

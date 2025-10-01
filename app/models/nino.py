from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.orm import relationship
from app.database.conexion import Base

class Nino(Base):
    __tablename__ = "ninos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    genero = Column(String(20), nullable=False)
    carnet = Column(String(20), unique=True, nullable=False)
    tipo_sangre = Column(String(10), nullable=False)
    departamento = Column(String(100), nullable=False)
    ciudad = Column(String(100), nullable=False)
    direccion = Column(Text, nullable=False)
    telefono = Column(String(20))
    email = Column(String(255))
    encargado = Column(String(255), nullable=False)
    telefono_encargado = Column(String(20), nullable=False)
    colegio = Column(String(255), nullable=False)
    grado = Column(String(100), nullable=False)
    alergias = Column(Text, default="Ninguna")
    medicamentos = Column(Text, default="Ninguno")
    condiciones_medicas = Column(Text)
    nombre_padre = Column(String(255))
    nombre_madre = Column(String(255))
    observaciones = Column(Text)
    estado = Column(String(20), default="Activo")
    permisos_activos = Column(Integer, default=0)
    viajes_realizados = Column(Integer, default=0)
    
    # Relaciones
    permisos = relationship("Permiso", back_populates="nino")

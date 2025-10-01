from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.schemas.nino import NinoCrear, NinoMostrar, NinoActualizar
from app.models.nino import Nino
from app.database.conexion import SessionLocal
from typing import List, Optional
from datetime import date

router = APIRouter(
    prefix="/ninos",
    tags=["ninos"]
)

# Dependency para obtener la sesión
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear niño
@router.post("/", response_model=NinoMostrar)
def crear_nino(nino: NinoCrear, db: Session = Depends(get_db)):
    # Verificar si ya existe un niño con ese carnet
    db_nino = db.query(Nino).filter(Nino.carnet == nino.carnet).first()
    if db_nino:
        raise HTTPException(status_code=400, detail="Ya existe un niño con ese carnet de identidad")
    
    # Crear nuevo niño
    nuevo_nino = Nino(**nino.dict())
    db.add(nuevo_nino)
    db.commit()
    db.refresh(nuevo_nino)
    return nuevo_nino

# Obtener todos los niños con filtros opcionales
@router.get("/", response_model=List[NinoMostrar])
def obtener_ninos(
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(100, ge=1, le=100, description="Número máximo de registros"),
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    departamento: Optional[str] = Query(None, description="Filtrar por departamento"),
    colegio: Optional[str] = Query(None, description="Filtrar por colegio"),
    db: Session = Depends(get_db)
):
    query = db.query(Nino)
    
    # Aplicar filtros si se proporcionan
    if estado:
        query = query.filter(Nino.estado == estado)
    if departamento:
        query = query.filter(Nino.departamento == departamento)
    if colegio:
        query = query.filter(Nino.colegio == colegio)
    
    # Aplicar paginación
    ninos = query.offset(skip).limit(limit).all()
    return ninos

# Obtener niño por ID
@router.get("/{nino_id}", response_model=NinoMostrar)
def obtener_nino(nino_id: int, db: Session = Depends(get_db)):
    nino = db.query(Nino).filter(Nino.id == nino_id).first()
    if not nino:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    return nino

# Obtener niño por carnet
@router.get("/carnet/{carnet}", response_model=NinoMostrar)
def obtener_nino_por_carnet(carnet: str, db: Session = Depends(get_db)):
    nino = db.query(Nino).filter(Nino.carnet == carnet).first()
    if not nino:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    return nino

# Actualizar niño
@router.put("/{nino_id}", response_model=NinoMostrar)
def actualizar_nino(nino_id: int, datos: NinoActualizar, db: Session = Depends(get_db)):
    nino = db.query(Nino).filter(Nino.id == nino_id).first()
    if not nino:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    # Verificar si el carnet ya existe en otro niño
    if datos.carnet and datos.carnet != nino.carnet:
        existing_nino = db.query(Nino).filter(Nino.carnet == datos.carnet).first()
        if existing_nino:
            raise HTTPException(status_code=400, detail="Ya existe un niño con ese carnet de identidad")
    
    # Actualizar solo los campos proporcionados
    update_data = datos.dict(exclude_unset=True)
    for campo, valor in update_data.items():
        setattr(nino, campo, valor)
    
    db.commit()
    db.refresh(nino)
    return nino

# Eliminar niño
@router.delete("/{nino_id}")
def eliminar_nino(nino_id: int, db: Session = Depends(get_db)):
    nino = db.query(Nino).filter(Nino.id == nino_id).first()
    if not nino:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    
    db.delete(nino)
    db.commit()
    return {"mensaje": "Niño eliminado exitosamente"}

# Obtener estadísticas de niños
@router.get("/estadisticas/resumen")
def obtener_estadisticas(db: Session = Depends(get_db)):
    total_ninos = db.query(Nino).count()
    ninos_activos = db.query(Nino).filter(Nino.estado == "Activo").count()
    ninos_inactivos = db.query(Nino).filter(Nino.estado == "Inactivo").count()
    
    # Estadísticas por departamento
    departamentos = db.query(Nino.departamento, db.func.count(Nino.id)).group_by(Nino.departamento).all()
    
    return {
        "total_ninos": total_ninos,
        "ninos_activos": ninos_activos,
        "ninos_inactivos": ninos_inactivos,
        "por_departamento": dict(departamentos)
    }

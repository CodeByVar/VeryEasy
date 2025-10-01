from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.conexion import SessionLocal
from app.models.encargado import Encargado
from app.schemas.encargado import EncargadoCrear, EncargadoMostrar, EncargadoActualizar
from typing import List, Optional

router = APIRouter(
    prefix="/encargados",
    tags=["encargados"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear encargado
@router.post("/", response_model=EncargadoMostrar)
def crear_encargado(encargado: EncargadoCrear, db: Session = Depends(get_db)):
    # Verificar si ya existe un encargado con ese CI
    existente = db.query(Encargado).filter(Encargado.ci == encargado.ci).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe un encargado con ese CI")
    
    # Crear nuevo encargado
    nuevo = Encargado(**encargado.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# Obtener todos los encargados con filtros opcionales
@router.get("/", response_model=List[EncargadoMostrar])
def obtener_encargados(
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(100, ge=1, le=100, description="Número máximo de registros"),
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    parentesco: Optional[str] = Query(None, description="Filtrar por parentesco"),
    es_contacto_emergencia: Optional[bool] = Query(None, description="Filtrar por contacto de emergencia"),
    db: Session = Depends(get_db)
):
    query = db.query(Encargado)
    
    # Aplicar filtros si se proporcionan
    if estado:
        query = query.filter(Encargado.estado == estado)
    if parentesco:
        query = query.filter(Encargado.parentesco == parentesco)
    if es_contacto_emergencia is not None:
        query = query.filter(Encargado.es_contacto_emergencia == es_contacto_emergencia)
    
    # Aplicar paginación
    encargados = query.offset(skip).limit(limit).all()
    return encargados

# Obtener encargado por ID
@router.get("/{encargado_id}", response_model=EncargadoMostrar)
def obtener_encargado(encargado_id: int, db: Session = Depends(get_db)):
    encargado = db.query(Encargado).filter(Encargado.id == encargado_id).first()
    if not encargado:
        raise HTTPException(status_code=404, detail="Encargado no encontrado")
    return encargado

# Obtener encargado por CI
@router.get("/ci/{ci}", response_model=EncargadoMostrar)
def obtener_encargado_por_ci(ci: str, db: Session = Depends(get_db)):
    encargado = db.query(Encargado).filter(Encargado.ci == ci).first()
    if not encargado:
        raise HTTPException(status_code=404, detail="Encargado no encontrado")
    return encargado

# Actualizar encargado
@router.put("/{encargado_id}", response_model=EncargadoMostrar)
def actualizar_encargado(encargado_id: int, datos: EncargadoActualizar, db: Session = Depends(get_db)):
    encargado = db.query(Encargado).filter(Encargado.id == encargado_id).first()
    if not encargado:
        raise HTTPException(status_code=404, detail="Encargado no encontrado")
    
    # Verificar si el CI ya existe en otro encargado
    if datos.ci and datos.ci != encargado.ci:
        existing_encargado = db.query(Encargado).filter(Encargado.ci == datos.ci).first()
        if existing_encargado:
            raise HTTPException(status_code=400, detail="Ya existe un encargado con ese CI")
    
    # Actualizar solo los campos proporcionados
    update_data = datos.dict(exclude_unset=True)
    for campo, valor in update_data.items():
        setattr(encargado, campo, valor)
    
    db.commit()
    db.refresh(encargado)
    return encargado

# Eliminar encargado
@router.delete("/{encargado_id}")
def eliminar_encargado(encargado_id: int, db: Session = Depends(get_db)):
    encargado = db.query(Encargado).filter(Encargado.id == encargado_id).first()
    if not encargado:
        raise HTTPException(status_code=404, detail="Encargado no encontrado")
    
    db.delete(encargado)
    db.commit()
    return {"mensaje": "Encargado eliminado exitosamente"}

# Obtener estadísticas de encargados
@router.get("/estadisticas/resumen")
def obtener_estadisticas(db: Session = Depends(get_db)):
    total_encargados = db.query(Encargado).count()
    encargados_activos = db.query(Encargado).filter(Encargado.estado == "Activo").count()
    encargados_inactivos = db.query(Encargado).filter(Encargado.estado == "Inactivo").count()
    contactos_emergencia = db.query(Encargado).filter(Encargado.es_contacto_emergencia == True).count()
    
    # Estadísticas por parentesco
    parentescos = db.query(Encargado.parentesco, db.func.count(Encargado.id)).group_by(Encargado.parentesco).all()
    
    return {
        "total_encargados": total_encargados,
        "encargados_activos": encargados_activos,
        "encargados_inactivos": encargados_inactivos,
        "contactos_emergencia": contactos_emergencia,
        "por_parentesco": dict(parentescos)
    }

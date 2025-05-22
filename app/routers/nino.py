from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.nino import NinoCrear, NinoMostrar
from app.models.nino import Nino
from app.database.conexion import SessionLocal

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
    db_nino = db.query(Nino).filter(Nino.ci == nino.ci).first()
    if db_nino:
        raise HTTPException(status_code=400, detail="Ya existe un niño con ese CI")
    nuevo_nino = Nino(**nino.dict())
    db.add(nuevo_nino)
    db.commit()
    db.refresh(nuevo_nino)
    return nuevo_nino

# Obtener todos
@router.get("/", response_model=list[NinoMostrar])
def obtener_ninos(db: Session = Depends(get_db)):
    return db.query(Nino).all()

# Obtener por ID
@router.get("/{nino_id}", response_model=NinoMostrar)
def obtener_nino(nino_id: int, db: Session = Depends(get_db)):
    nino = db.query(Nino).filter(Nino.id == nino_id).first()
    if not nino:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    return nino

# Actualizar
@router.put("/{nino_id}", response_model=NinoMostrar)
def actualizar_nino(nino_id: int, datos: NinoCrear, db: Session = Depends(get_db)):
    nino = db.query(Nino).filter(Nino.id == nino_id).first()
    if not nino:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    for campo, valor in datos.dict().items():
        setattr(nino, campo, valor)
    db.commit()
    db.refresh(nino)
    return nino

# Eliminar
@router.delete("/{nino_id}")
def eliminar_nino(nino_id: int, db: Session = Depends(get_db)):
    nino = db.query(Nino).filter(Nino.id == nino_id).first()
    if not nino:
        raise HTTPException(status_code=404, detail="Niño no encontrado")
    db.delete(nino)
    db.commit()
    return {"mensaje": "Niño eliminado"}

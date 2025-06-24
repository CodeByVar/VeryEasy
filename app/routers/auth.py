from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext

router = APIRouter()

# Configuración de seguridad
SECRET_KEY = "tu_clave_secreta_aqui"  # En producción, usa una clave segura y guárdala en variables de entorno
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Función para crear el token JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Endpoint de login
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Aquí deberías verificar las credenciales contra tu base de datos
    # Por ahora, usaremos credenciales de prueba
    if form_data.username == "admin@example.com" and form_data.password == "admin123":
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": form_data.username}, expires_delta=access_token_expires
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "email": form_data.username,
            "role": "admin"
        }
    raise HTTPException(
        status_code=401,
        detail="Credenciales incorrectas",
        headers={"WWW-Authenticate": "Bearer"},
    ) 
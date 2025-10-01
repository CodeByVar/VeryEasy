import os
import sys

# Agregar el directorio app al path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy import create_engine, text
from app.database.conexion import engine, Base
from app.models.nino import Nino
from app.models.encargado import Encargado
from app.models.permiso import Permiso

def migrate_all_tables():
    """
    Script para migrar todas las tablas a la nueva estructura
    """
    try:
        # Crear todas las tablas en el orden correcto
        Base.metadata.create_all(bind=engine)
        
        print("✅ Migración de todas las tablas completada exitosamente")
        print("📋 Tablas creadas:")
        
        # Mostrar las tablas creadas
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
            """))
            
            for row in result:
                print(f"   - {row.name}")
                
    except Exception as e:
        print(f"❌ Error durante la migración: {e}")
        raise
    finally:
        engine.dispose()

if __name__ == "__main__":
    print("🚀 Iniciando migración de todas las tablas...")
    migrate_all_tables()




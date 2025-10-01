import os
import sys

# Agregar el directorio app al path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy import create_engine, text
from app.database.conexion import engine, Base
from app.models.encargado import Encargado

def migrate_encargados_table():
    """
    Script para migrar la tabla de encargados a la nueva estructura
    """
    try:
        # Crear la nueva tabla con la estructura actualizada
        Base.metadata.create_all(bind=engine, tables=[Encargado.__table__])
        
        print("✅ Migración de tabla de encargados completada exitosamente")
        print("📋 Nueva estructura de la tabla:")
        
        # Mostrar la estructura de la tabla
        with engine.connect() as conn:
            # Para SQLite
            result = conn.execute(text("""
                PRAGMA table_info(encargados)
            """))
            
            for row in result:
                nullable = "NULL" if row.notnull == 0 else "NOT NULL"
                default = f"DEFAULT {row.dflt_value}" if row.dflt_value else ""
                print(f"   - {row.name}: {row.type} {nullable} {default}")
                
    except Exception as e:
        print(f"❌ Error durante la migración: {e}")
        raise
    finally:
        engine.dispose()

if __name__ == "__main__":
    print("🚀 Iniciando migración de tabla de encargados...")
    migrate_encargados_table()




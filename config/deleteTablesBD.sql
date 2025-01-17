-- Deshabilitar la comprobación de claves foráneas temporalmente (si es necesario)
SET FOREIGN_KEY_CHECKS = 0;

-- Generar y ejecutar las sentencias para eliminar todas las tablas
SELECT CONCAT('DROP TABLE IF EXISTS `', table_name, '`;') 
FROM information_schema.tables
WHERE table_schema = 'nombre_de_tu_base_de_datos';

-- Habilitar de nuevo las comprobaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
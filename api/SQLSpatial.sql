-- My GPS position is (@lat, @lon)
declare @g geography = geography::Point(@lat, @lon, 4326)

-- Get a region of 20m around me
declare @region geography = geography::Point(@lat, @lon).STBuffer(20);

-- Get all stores within distance X
declare @me geography = geography::Point(@lat, @lon, 4326)
declare @distance int = 1 --(como decirle si son metros o kms)
select * from Stores s where s.geo.STDistance(@me) < @distance

-- Convert 2 columns (latitude, longitude) to geography
alter table MyTable
add geo as (geography::Point(lat, lon, 4326)) persisted

-- Or update
update MyTable set geo = geography::Point(lat, lon, 4326)

-- Interesting Queries
DECLARE @g geography;
SET @g = geography::STPointFromText('POINT(-122.34900 47.65100)', 4326);
SELECT @g.ToString();

-- Acciones a realizar

-- 1.- Convertir las columnas de latitud y longitud a geography
-- 2.- Crear un índica sobre la nueva columna spatial
-- 3.- Pasar los datos originales a la nueva columna (si es que con la acción 1 no se hace ya)
-- 4.- Modificar el procedimiento almacenado para que usen esta nueva columna (crear, listar, etc)

# BcCertificated



Los comandos para ejecutar son los siguientes

# Contruir el contenedor de la base de datos
- ´docker run --name mongo -d mongo mongod --smallfiles´

# Se ingresa en el contenedor y se crea la base de datos con el nombre de blocklife
´docker exec -it mongo bash´

Cuando se ingrese se ejecuta los siguientes comandos

´
mongo
show dbs
use blocklife
db.owner.insert({nombre:"Jose David Sanchez"})
exit
exit
´
# Construir imagen (Se debe ejecutar en la raiz del proyecto)
 ´docker build -t blocklife .´

# Ejecuta la imagen en un contenedor conectandose a la base de datos anteriormente creada

'docker run --name blocklife4 --link mongo:mongo -p 3000:3000 -d blocklife'



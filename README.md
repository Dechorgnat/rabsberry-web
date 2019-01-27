# rabsberry web




## Mongo
installation de Mongodb 2.4 

    sudo apt-get install mongodb

## Modules python
dans le répertoire rabsberyy-web/api:  

    pip install -r requirements.txt

## lancement API 
dans le répertoire rabsberyy-web/api:  

    uwsgi --ini uwsgi.conf &
    
Logs dans /var/log/rabsberry

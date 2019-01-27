# rabsberry web
Serveur web en deux parties:
* app:
  IHM d'administration servie par Nginx
* api:
  api servie par uwsgi


## Installation Nginx

    sudo apt-get install nginx
    sudo ln -s /etc/nginx/sites-enabled/rabsberry /home/pi/Rabsberry/rabsberry-web/rabsberry-web.nginx.conf
    sudo rm /etc/nginx/sites-enabled/Default
    sudo service nginx restart
   

## Mongo
installation de Mongodb 2.4 

    sudo apt-get install mongodb


## Modules python
dans le répertoire rabsberry-web/api:  

    pip install -r requirements.txt


## lancement API 
dans le répertoire rabsberry-web/api:  

    uwsgi --ini uwsgi.conf &
    
Logs dans /var/log/rabsberry

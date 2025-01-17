# server\app\auth.py
import jwt
from datetime import datetime, timedelta

# Définition de la clé secrète et de l'algorithme pour la création et la vérification des tokens JWT
SECRET_KEY = "secret-key"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Durée de validité par défaut du token (en minutes)

# Fonction pour créer un token d'accès
def create_access_token(data: dict, expires_delta: timedelta = None):
    # Création d'une copie des données passées pour l'encodage
    to_encode = data.copy()
    
    # Si une durée d'expiration spécifique est fournie, elle est utilisée
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Si aucune durée n'est spécifiée, on utilise la durée par défaut
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Mise à jour des données avec la clé d'expiration
    to_encode.update({"exp": expire})
    
    # Encodage des données dans un token JWT
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Fonction pour vérifier la validité d'un token d'accès
def verify_token(token: str):
    try:
        # Décodage du token avec la clé secrète et l'algorithme
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Retourne les données du token si la vérification réussit
    except jwt.PyJWTError:
        # Retourne None si le token est invalide ou expiré
        return None

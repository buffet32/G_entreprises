from django.db import models

# Create your models here.

class Entreprise(models.Model):
    nom_entreprise = models.CharField(max_length=255)
    code_ice = models.CharField(max_length=50, db_index=True)
    secteur = models.TextField()

    # Choices pour forme_juridique
    SA = 'SA'
    SARL = 'SARL'
    SNC = 'SNC'
    SCS = 'SCS'
    AUTRE = 'autre'
    FORMES_JURIDIQUES = [
        (SA, 'SA'),
        (SARL, 'SARL'),
        (SNC, 'SNC'),
        (SCS, 'SCS'),
        (AUTRE, 'Autre'),
    ]
    forme_juridique = models.CharField(max_length=10, choices=FORMES_JURIDIQUES)

    ville = models.CharField(max_length=255)
    adresse = models.TextField()

    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)

    activite = models.CharField(max_length=255)

    # Choices pour type personne
    PP = 'PP'  # Personne Physique
    PM = 'PM'  # Personne Morale
    TYPES_PERSONNE = [
        (PP, 'Personne Physique'),
        (PM, 'Personne Morale'),
    ]
    type = models.CharField(max_length=2, choices=TYPES_PERSONNE)

    email = models.EmailField(max_length=255, blank=True, null=True)
    fax = models.CharField(max_length=50, blank=True, null=True)
    site_web = models.CharField(max_length=255, blank=True, null=True)
    contact = models.CharField(max_length=255, blank=True, null=True)
    tel = models.CharField(max_length=20, blank=True, null=True)
    certifications = models.TextField(blank=True, null=True)
    cnss = models.CharField(max_length=50, blank=True, null=True)
    identifiant_fiscal = models.CharField(max_length=50, blank=True, null=True, db_column='if')  # "if" est mot réservé, on met identifiant_fiscal 
    patente = models.CharField(max_length=50, blank=True, null=True)
    rc = models.CharField(max_length=50, blank=True, null=True)

    # Choices pour en_activite
    OUI = 'oui'
    NON = 'non'
    EN_ACTIVITE_CHOICES = [
        (OUI, 'Oui'),
        (NON, 'Non'),
    ]
    en_activite = models.CharField(max_length=3, choices=EN_ACTIVITE_CHOICES, default=OUI)

    date_creation = models.DateTimeField(auto_now_add=True)

    # Choices pour taille_entreprise
    PME = 'PME'
    GE = 'GE'
    SU = 'SU'
    TAILLES_ENTREPRISE = [
        (PME, 'Petite et Moyenne Entreprise'),
        (GE, 'Grande Entreprise'),
        (SU, 'Startup'),
    ]
    taille_entreprise = models.CharField(max_length=3, choices=TAILLES_ENTREPRISE)

from django import forms
from .models import Entreprise

class EntrepriseForm(forms.ModelForm):
    class Meta:
        model = Entreprise
        fields = '__all__'
        widgets = {
            'nom_entreprise': forms.TextInput(attrs={'class': 'input', 'placeholder': 'Nom d’entreprise'}),
            'code_ice': forms.TextInput(attrs={'class': 'input', 'placeholder': 'ICE'}),
            'secteur': forms.TextInput(attrs={'class': 'input', 'placeholder': 'Secteur'}),
            'forme_juridique': forms.Select(attrs={'class': 'input'}),
            'ville': forms.TextInput(attrs={'class': 'input', 'placeholder': 'Ville'}),
            'adresse': forms.TextInput(attrs={'class': 'input', 'placeholder': 'Adresse'}),
            'activite': forms.TextInput(attrs={'class': 'input', 'placeholder': 'Activité'}),
            'contact': forms.TextInput(attrs={'class': 'input', 'placeholder': 'Contact'}),
            'email': forms.EmailInput(attrs={'class': 'input', 'placeholder': 'Email'}),
            # Ajoutez d'autres champs ici si besoin
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            # Remplace toute autre classe par uniquement 'input' pour forcer le style
            visible.field.widget.attrs['class'] = 'input'


# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from .models import Entreprise
from .forms import EntrepriseForm

def liste_entreprises(request):
    entreprises = Entreprise.objects.all()
    return render(request, 'entreprise_app/admin/index.html', {'entreprises': entreprises})

def ajouter_entreprise(request):
    form = EntrepriseForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('liste_entreprises')
    return render(request, 'entreprise_app/admin/create.html', {'form': form})

def modifier_entreprise(request, id):
    entreprise = get_object_or_404(Entreprise, id=id)
    form = EntrepriseForm(request.POST or None, instance=entreprise)
    if form.is_valid():
        form.save()
        return redirect('liste_entreprises')
    return render(request, 'entreprise_app/admin/edit.html', {'form': form})

def supprimer_entreprise(request, id):
    entreprise = get_object_or_404(Entreprise, id=id)
    if request.method == 'POST':
        entreprise.delete()
        return redirect('liste_entreprises')
    return render(request, 'G_entreprise/confirmer_suppression.html', {'entreprise': entreprise})

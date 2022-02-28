from django.urls import path

from core.juegos.views import *

urlpatterns = [
    # Cursos
    path('game/juegomemoria/', GameMemoryView.as_view(), name='juegomemoria'),
    path('game/juegomemoria2/', GameMemoryView2.as_view(), name='juegomemoria2'),
     path('game/juegomemoria3/', GameMemoryView3.as_view(), name='juegomemoria3'),
    path('game/encuentraTesoro/', EncuentraElTesoroView.as_view(), name='encuentraTesoro'),
    path('game/paint/', PaintView.as_view(), name='paint'),
    path('game/rompecabezas/', RompecabezasView.as_view(), name='rompecabezas'),
    path('game/reflejos/', ReflejosView.as_view(), name='reflejos'),
    path('game/sentidos/', SentidosView.as_view(), name='sentidos'),
    path('game/juegonuevo/', JuegoNUevoView.as_view(), name='juegonuevo'),
    path('game/pares/', JuegoParesView.as_view(), name='juegopares'),
    path('game/geometria/', JuegoGeometriaView.as_view(), name='geometria'),
    path('game/hormiga/', JuegoHormigaView.as_view(), name='hormiga'),
    path('game/piano/', JuegoPianoView.as_view(), name='piano'),
    path('game/burbuja/', JuegoBurbujaView.as_view(), name='burbuja'),



    path('game/', JuegoListView.as_view(), name='juego_list'),
    path('game/add/', JuegoCreateView.as_view(), name='juego_create'),
    path('game/update/<int:pk>/', JuegoUpdateView.as_view(), name='juego_update'),

]

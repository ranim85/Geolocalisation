import { Component, OnDestroy } from '@angular/core';

@Component({
selector: 'app-home',
templateUrl: 'home.page.html',
styleUrls: ['home.page.scss'],
standalone: false,
})
export class HomePage implements OnDestroy {

// Position actuelle
position: GeolocationCoordinates | null = null;

// Gestion des états
isLoading = false;
isTracking = false;

// Gestion des erreurs
errorMessage = '';

// Informations du suivi
positionCount = 0;
trackingDuration = 0;

// Identifiant du suivi GPS
private watchId: number | null = null;

// Temps de début du suivi
private trackingStartTime = 0;

// Timer pour calculer la durée
private durationInterval: ReturnType<typeof setInterval> | null = null;

constructor() {}

/**

* EXERCICE 3.2
* Obtient la position actuelle une seule fois.
  */
  obtenirPositionPonctuelle(): void {
  this.isLoading = true;
  this.errorMessage = '';

navigator.geolocation.getCurrentPosition(

  (position: GeolocationPosition) => {
    this.position = position.coords;
    this.isLoading = false;
  },
  (error: GeolocationPositionError) => {
    this.isLoading = false;
    this.gererErreur(error);
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  }
);

}

/**

* EXERCICE 3.3
* Démarre le suivi continu de la position.
  */
  demarrerSuivi(): void {
  // Évite de démarrer plusieurs suivis simultanément
  if (this.isTracking) {
  return;
  }

this.errorMessage = '';

this.positionCount = 0;
this.trackingDuration = 0;

this.trackingStartTime = Date.now();
this.isTracking = true;

this.watchId = navigator.geolocation.watchPosition(
  (position: GeolocationPosition) => {
    this.position = position.coords;
    this.positionCount++;
  },
  (error: GeolocationPositionError) => {
    this.gererErreur(error);
    this.arreterSuivi();
  },
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  }
);

// Mise à jour de la durée chaque seconde
this.durationInterval = setInterval(() => {
  this.trackingDuration = Math.floor(
    (Date.now() - this.trackingStartTime) / 1000
  );
}, 1000);

}

/**

* Arrête le suivi continu.
  */
  arreterSuivi(): void {
  if (this.watchId !== null) {
  navigator.geolocation.clearWatch(this.watchId);
  this.watchId = null;
  }

if (this.durationInterval !== null) {

  clearInterval(this.durationInterval);
  this.durationInterval = null;
}

this.isTracking = false;

}

/**

* EXERCICE 3.4
* Gestion des erreurs de géolocalisation.
  */
  private gererErreur(error: GeolocationPositionError): void {
  switch (error.code) {
  case error.PERMISSION_DENIED:
  this.errorMessage =
  'Permission de géolocalisation refusée.';
  break;

  case error.POSITION_UNAVAILABLE:
  this.errorMessage =
  'Position géographique indisponible.';
  break;

  case error.TIMEOUT:
  this.errorMessage =
  'La demande de géolocalisation a expiré.';
  break;

  default:
  this.errorMessage =
  'Une erreur inconnue est survenue.';
  break;
  }
  }

/**

* EXERCICE 3.5
* Nettoyage lorsque la page est détruite.
  */
  ngOnDestroy(): void {
  this.arreterSuivi();
  }
  }

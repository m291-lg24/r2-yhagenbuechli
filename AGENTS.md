# Matchday Content Planner

## Projektidee

Der Matchday Content Planner ist eine Web-App für Social-Media-Teams, Fotograf:innen, Videograf:innen und Content Creators im Fussball.

Die App hilft dabei, alle Medieninhalte rund um einen Matchday zu planen und zu verwalten.

Zu einem Fussballspiel können verschiedene Content-Aufgaben erstellt werden, zum Beispiel:

- Matchday Graphic
- Starting XI
- Instagram Story
- Arrival Reel
- Match Photos
- Player Interview
- Result Post

## Zielgruppe

Die App richtet sich an Personen, die Content rund um Fussballspiele produzieren und organisieren.

Dazu gehören zum Beispiel:

- Social-Media-Teams von Vereinen
- Fotograf:innen
- Videograf:innen
- Sportredaktionen
- Content Creators

## Hauptfunktionen

Die App soll folgende Funktionen enthalten:

1. Dashboard mit einer Übersicht über den nächsten Matchday
2. Übersicht über alle Matches
3. Detailansicht eines Matches
4. Matches erstellen
5. Content-Aufgaben zu einem Match erstellen
6. Status einer Aufgabe ändern
7. Aufgaben löschen
8. Fortschritt eines Matchdays automatisch berechnen
9. Formulare validieren
10. Daten lokal speichern

## Ansichten

Die App soll mindestens folgende Ansichten besitzen:

- Dashboard
- Matches
- Match Detail

## Datenstruktur

Ein Match enthält unter anderem:

- ID
- Heimteam
- Auswärtsteam
- Wettbewerb
- Stadion
- Datum
- Anspielzeit

Eine Content-Aufgabe enthält unter anderem:

- ID
- Match-ID
- Titel
- Content-Typ
- Plattform
- Veröffentlichungszeit
- Status
- Priorität
- verantwortliche Person

## Content-Typen

Mögliche Content-Typen:

- Graphic
- Photo
- Video
- Reel
- Story
- Interview
- Article

## Plattformen

Mögliche Plattformen:

- Instagram
- TikTok
- YouTube
- Website
- X

## Status

Eine Content-Aufgabe kann folgende Status besitzen:

- Open
- In Progress
- Review
- Done

## Technik

Die App wird mit folgenden Technologien umgesetzt:

- Vue 3
- Vite
- JavaScript
- Vue Router
- Pinia
- LocalStorage
- CSS

Es soll keine unnötige zusätzliche Library verwendet werden.

## Design

Das Design soll professionell, modern und ruhig wirken.

Die Farbwelt basiert auf:

- Dunkelblau: #0A3C6E
- Hellblau: #1783C1
- Weiss: #FFFFFF
- Dunkelgrau: #333333
- Heller Hintergrund: #F5F7FA

Das Design soll nicht wie ein generisches KI-Dashboard aussehen.

Wichtig sind:

- klare Abstände
- saubere Typografie
- wenige Farben
- konsistente Karten
- dezente Schatten
- klare Statusanzeigen
- responsive Darstellung

## Code-Qualität

Der Code soll sauber strukturiert sein.

Nicht alles in eine einzige Datei schreiben.

Sinnvolle Aufteilung:

- Views
- Components
- Stores
- Router

Wiederverwendbare Elemente sollen als eigene Komponenten umgesetzt werden.

Doppelter Code soll vermieden werden.

## Arbeitsweise

Vor dem Programmieren zuerst einen Plan erstellen.

Noch keinen Code schreiben.

Der Plan soll enthalten:

- benötigte Seiten
- benötigte Komponenten
- Stores
- Datenstruktur
- Reihenfolge der Umsetzung

Danach wird die App Schritt für Schritt gebaut.

Nach jedem Schritt soll geprüft werden:

- funktioniert die Seite?
- gibt es Fehler in der Konsole?
- ist die Darstellung sauber?
- funktioniert die Navigation?
- funktionieren Formulare?
- bleiben Daten nach einem Reload erhalten?

Änderungen sollen klein und nachvollziehbar bleiben.
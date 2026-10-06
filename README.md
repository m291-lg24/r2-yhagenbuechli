# R2 – Vibe Coding: eine komplette App

> Ersetze diese Aufgabe durch die Beschreibung deiner App, sobald du sie abgibst.
> Solange dieser Satz im README steht, bleibt der Punkt «README im Repo vorhanden» im Dashboard offen.

Modul 291, Dienstag. Formativ: Du erhältst eine Rückmeldung, aber keine Punkte.

## Aufgabe

Lass einen KI-Agenten (Claude Code, GitHub Copilot, Cursor …) eine komplette Web-App bauen. Du schreibst so wenig Code wie möglich selbst, steuerst den Agenten aber gezielt: Du gibst den Auftrag, prüfst das Ergebnis und korrigierst.

Dieses Repo ist absichtlich leer. Welche Technik, welche Ordnerstruktur, welche Bibliotheken: Das entscheidest du zusammen mit dem Agenten. Am Mittwoch vergleichen wir, was dabei herausgekommen ist.

- **Thema:** eine Idee aus dem Ideenkatalog im Dashboard oder eine eigene. Der Prototyp darf verworfen werden; ihr dürft ihn aber auch für R4 weiterentwickeln.
- **Umfang:** mehrere Seiten oder Ansichten, mindestens ein Formular mit Validierung, Daten, die gespeichert oder von einer API geladen werden.
- **Frist:** Dienstag 17:00 (Dashboard).

## Vorgehen

1. `AGENTS.md` anlegen: Was soll die App können, für wen ist sie, welche Technik verwendest du? Claude Code liest zusätzlich `CLAUDE.md`; dort genügt die Zeile `@AGENTS.md`.
2. Den Agenten zuerst planen lassen, noch ohne Code: Seiten, Komponenten, Daten, Schritte.
3. Pro Schritt: ein Prompt, ein Test im Browser, ein Commit, ein Eintrag in `prompt-protokoll.md`.
4. Beobachte, wo der Agent schlechte Entscheide trifft (alles in einer Datei, doppelter Code, erfundene Bibliotheken), und korrigiere ihn ausdrücklich.

## Abgabe

- [ ] App im Repo gepusht; sie startet lokal nach der Anleitung im README.
- [ ] README ersetzt: was die App macht, Installation und Start, Technik.
- [ ] `prompt-protokoll.md` nachgeführt und im Dashboard als Artefakt «Prompt-Protokoll» eingereicht.
- [ ] Im README oder im Protokoll festgehalten: was der Agent generiert hat, was du angepasst hast, was du verstanden hast und was noch nicht.
- [ ] Keine Zugangsdaten im Repo; `.env*` steht in `.gitignore`.

Kriterien der Rückmeldung: Dashboard → Bewertung → R2. Tipps zum Arbeiten mit dem Agenten: Handout «KI-Agenten» unter Unterlagen.


VON YARA:
# Matchday Content Planner

Der Matchday Content Planner ist eine Web-App zur Planung und Organisation von Content rund um Fussballspiele.

Die App richtet sich vor allem an Social-Media-Teams, Fotograf:innen, Videograf:innen und Content Creators von Fussballvereinen.

Zu jedem Match können Content-Aufgaben wie zum Beispiel Starting XI, Matchday Graphic, Arrival Reel, Match Photos oder Result Post erstellt und verwaltet werden.

## Funktionen

Die App enthält aktuell folgende Funktionen:

- Dashboard mit Übersicht über den nächsten Matchday
- Übersicht über alle Matches
- Suche nach Team oder Stadion
- Filter nach Club und Monat
- Matches erstellen
- Formularvalidierung beim Erstellen eines Matches
- Detailansicht für jedes Match
- Content-Aufgaben zu einem Match erstellen
- Vorlagen für typische Matchday-Aufgaben
- Plattform, Priorität und verantwortliche Person festlegen
- Veröffentlichungszeit erfassen
- Status einer Aufgabe ändern
- Aufgaben bearbeiten
- Aufgaben löschen
- Bestätigung vor dem Löschen
- automatischer Matchday-Fortschritt
- lokale Speicherung der Matches und Aufgaben
- responsive Darstellung für unterschiedliche Bildschirmgrössen

## Ansichten

Die App besteht aus mehreren Ansichten.

### Dashboard

Das Dashboard bietet eine schnelle Übersicht über den Matchday und wichtige Content-Aufgaben.

Unter anderem werden angezeigt:

- nächstes Match
- offene Aufgaben
- High-Priority-Aufgaben
- Aufgaben im Review
- nächste geplante Content-Aufgaben
- Fortschritt des nächsten Matchdays

### Matches

Auf der Matchübersicht können alle gespeicherten Spiele angesehen werden.

Die Matches können nach Club und Monat gefiltert und über eine Suche gefunden werden.

Ausserdem können neue Matches über ein Formular erstellt werden.

### Match Detail

Die Matchdetail-Seite ist der wichtigste Arbeitsbereich der App.

Hier können Content-Aufgaben für ein bestimmtes Spiel geplant und verwaltet werden.

Die Aufgaben werden in folgende Status aufgeteilt:

- Open
- In Progress
- Review
- Done

Der Fortschritt des Matchdays wird automatisch anhand der erledigten Aufgaben berechnet.

## Technologien

Das Projekt wurde mit folgenden Technologien umgesetzt:

- Vue 3
- Vite
- JavaScript
- Vue Router
- Pinia
- LocalStorage
- CSS

Es wurden keine zusätzlichen UI-Frameworks verwendet.

## Installation

Voraussetzung ist eine installierte Version von Node.js.

Repository herunterladen oder klonen und anschliessend die Abhängigkeiten installieren:

```bash
npm install
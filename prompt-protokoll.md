# Prompt-Protokoll R2

Pro wichtigem Schritt ein Eintrag, neuster unten.

Werkzeug und Modell: ChatGPT

## 1. Planung der App

**Prompt:**  
Ich habe die KI zuerst angewiesen, die `AGENTS.md` zu lesen und noch keinen Code zu schreiben. Sie sollte zuerst Seiten, Komponenten, Stores, Datenstruktur und die Reihenfolge der Umsetzung planen.

**Ergebnis:**  
Es wurde ein Plan mit drei Hauptansichten erstellt:

- Dashboard
- Matches
- Match Detail

Zusätzlich wurden ein Match Store und ein Task Store mit Pinia geplant.

**Korrektur:**  
Ich habe darauf geachtet, dass keine unnötigen Libraries eingebaut werden und die App für den Umfang des Moduls nicht zu kompliziert wird.

**Gelernt:**  
Ich habe verstanden, dass eine klare Planung vor dem Programmieren hilft, damit die App später sauber strukturiert bleibt.


## 2. Grundstruktur mit Vue Router

**Prompt:**  
Ich habe die KI gebeten, die Grundstruktur der App mit Vue 3, Vite und Vue Router umzusetzen.

**Ergebnis:**  
Es wurden die verschiedenen Views erstellt und über Vue Router miteinander verbunden.

**Korrektur:**  
Die Navigation wurde mehrfach angepasst, damit Dashboard, Matchübersicht und Matchdetail-Seite klar erreichbar sind.

**Gelernt:**  
Ich habe besser verstanden, wie Vue Router funktioniert und wie verschiedene Views über unterschiedliche URLs geladen werden.


## 3. Matchübersicht

**Prompt:**  
Ich habe die KI gebeten, eine Übersicht aller Matches zu erstellen.

**Ergebnis:**  
Die Matches werden als Karten angezeigt. Jede Karte enthält Heimteam, Auswärtsteam, Wettbewerb, Datum, Uhrzeit und Stadion.

**Korrektur:**  
Die Darstellung wurde danach überarbeitet, weil sie zuerst zu generisch wirkte. Abstände, Farben, Karten und Typografie wurden angepasst.

**Gelernt:**  
Ich habe verstanden, wie Daten mit `v-for` in Vue ausgegeben werden und wie Props an Komponenten übergeben werden.


## 4. Suche und Filter

**Prompt:**  
Ich habe die KI gebeten, die Matchübersicht mit einer Suche und Filtern zu erweitern.

**Ergebnis:**  
Matches können nach Club und Monat gefiltert und über Team oder Stadion gesucht werden.

Zusätzlich wurde eine Funktion eingebaut, mit der zuerst nur eine begrenzte Anzahl Matches angezeigt und über `Mehr laden` erweitert wird.

**Korrektur:**  
Die Filter mussten so angepasst werden, dass sie miteinander funktionieren und beim Ändern wieder auf die erste Anzahl sichtbarer Matches zurückgesetzt werden.

**Gelernt:**  
Ich habe besser verstanden, wie `computed` und `watch` verwendet werden können, um Daten dynamisch zu filtern.


## 5. Dashboard

**Prompt:**  
Ich habe die KI gebeten, ein Dashboard für die Startseite zu erstellen.

**Ergebnis:**  
Das Dashboard zeigt das nächste Match und später auch wichtige Informationen zu Content-Aufgaben.

Dazu gehören unter anderem:

- offene Aufgaben
- High-Priority-Aufgaben
- Aufgaben im Review
- nächste geplante Aufgabe
- Fortschritt des nächsten Matchdays

**Korrektur:**  
Eine frühere Änderung am CSS führte dazu, dass das Dashboard teilweise nicht mehr richtig gestylt war. Das Styling wurde danach wieder ergänzt und überarbeitet.

**Gelernt:**  
Ich habe verstanden, dass globale CSS-Änderungen Auswirkungen auf mehrere Seiten haben können und deshalb vorsichtig vorgenommen werden müssen.


## 6. Matchdetail-Seite

**Prompt:**  
Ich habe die KI gebeten, für jedes Match eine Detailseite zu erstellen.

**Ergebnis:**  
Die Seite zeigt die wichtigsten Matchinformationen und einen Bereich für Content-Aufgaben.

Zusätzlich wurden Bereiche für Aufstellung und Matchstatistiken vorbereitet.

**Korrektur:**  
Die Reihenfolge der Inhalte wurde angepasst, damit der Content Planner stärker im Mittelpunkt steht.

**Gelernt:**  
Ich habe verstanden, wie Route-Parameter verwendet werden, um über die Match-ID das richtige Match aus dem Store zu laden.


## 7. Task Store mit Pinia und LocalStorage

**Prompt:**  
Ich habe die KI gebeten, Content-Aufgaben mit Pinia zu verwalten und dauerhaft im Browser zu speichern.

**Ergebnis:**  
Ein eigener `taskStore` wurde erstellt. Aufgaben können einem Match zugeordnet und im LocalStorage gespeichert werden.

**Korrektur:**  
Es gab zeitweise zwei Getter, die praktisch das Gleiche gemacht haben. Der Store wurde später aufgeräumt, damit nur noch eine Variante verwendet wird.

**Gelernt:**  
Ich habe verstanden, wie Pinia Stores Daten zentral verwalten und wie LocalStorage genutzt werden kann, damit Daten nach einem Reload erhalten bleiben.


## 8. Fehlerbehebung bei weisser Seite

**Prompt:**  
Nach einer Änderung wurde die App nur noch weiss angezeigt. Ich habe die KI gebeten, den Fehler zu analysieren.

**Ergebnis:**  
In der Browser-Konsole wurde der Fehler gefunden:

`taskStore.getTasksByMatch is not a function`

Die View und der Store verwendeten unterschiedliche Namen für denselben Getter.

**Korrektur:**  
Der Store wurde angepasst, damit die verwendete Funktion wieder vorhanden war. Danach konnte die Seite wieder geladen werden.

**Gelernt:**  
Ich habe gelernt, dass eine weisse Seite bei Vue oft durch einen JavaScript-Fehler verursacht wird und dass die Browser-Konsole bei der Fehlersuche sehr wichtig ist.


## 9. Content-Aufgaben erstellen

**Prompt:**  
Ich habe die KI gebeten, auf der Matchdetail-Seite Content-Aufgaben erstellen zu können.

Die Aufgaben sollten folgende Daten enthalten:

- Titel
- Content-Typ
- Plattform
- Veröffentlichungszeit
- Priorität
- verantwortliche Person
- Status

**Ergebnis:**  
Es wurde ein Formular mit Validierung erstellt.

Zusätzlich wurden Vorlagen für typische Inhalte eingebaut, zum Beispiel:

- Starting XI
- Matchday Graphic
- Arrival Reel
- Result Post
- Match Photos
- Player Interview

**Korrektur:**  
Die Pflichtfelder wurden angepasst, damit keine unvollständigen Aufgaben gespeichert werden können.

**Gelernt:**  
Ich habe verstanden, wie Formulare mit `v-model`, `reactive` und Validierungsfunktionen umgesetzt werden.


## 10. Status und Fortschritt

**Prompt:**  
Ich habe die KI gebeten, den Status von Aufgaben verändern zu können und daraus automatisch den Fortschritt des Matchdays zu berechnen.

**Ergebnis:**  
Aufgaben können zwischen folgenden Status wechseln:

- Open
- In Progress
- Review
- Done

Der Fortschritt wird anhand der erledigten Aufgaben automatisch in Prozent berechnet.

**Korrektur:**  
Die Statusdarstellung wurde visuell angepasst, damit die verschiedenen Zustände besser erkennbar sind.

**Gelernt:**  
Ich habe verstanden, wie sich berechnete Werte mit `computed` automatisch aktualisieren, wenn sich Daten verändern.


## 11. Aufgaben bearbeiten und löschen

**Prompt:**  
Ich habe die KI gebeten, bestehende Aufgaben bearbeiten zu können und das Löschen sicherer zu machen.

**Ergebnis:**  
Aufgaben können jetzt nachträglich geändert werden.

Dabei können unter anderem folgende Werte angepasst werden:

- Titel
- Plattform
- Uhrzeit
- Priorität
- verantwortliche Person
- Status

Beim Löschen wird zuerst eine Bestätigung angezeigt.

**Korrektur:**  
Die ID-Erstellung wurde vereinfacht. Die ID wird nur noch im Store erzeugt und nicht zusätzlich in der View.

**Gelernt:**  
Ich habe besser verstanden, wie bestehende Objekte in einem Pinia Store aktualisiert werden.


## 12. Matches erstellen

**Prompt:**  
Ich habe die KI gebeten, auf der Matchübersicht neue Matches erstellen zu können.

**Ergebnis:**  
Es wurde ein Formular mit folgenden Feldern erstellt:

- Heimteam
- Auswärtsteam
- Wettbewerb
- Stadion
- Datum
- Anspielzeit

Die Eingaben werden validiert und danach im Match Store gespeichert.

**Korrektur:**  
Zuerst waren Teams, Wettbewerb und Stadion normale Textfelder.

Ich wollte stattdessen Dropdowns, damit weniger falsche Eingaben möglich sind.

Das Stadion wird nun passend zum ausgewählten Heimteam automatisch vorausgewählt, wenn bereits ein passendes Stadion bekannt ist.

**Gelernt:**  
Ich habe verstanden, wie Select-Felder mit `v-model` funktionieren und wie Daten aus bestehenden Matches für neue Formulare wiederverwendet werden können.


## 13. Speicherung testen

**Prompt:**  
Ich habe die KI gebeten, sicherzustellen, dass selbst erstellte Matches und Aufgaben nach einem Reload erhalten bleiben.

**Ergebnis:**  
Sowohl Matches als auch Content-Aufgaben werden im LocalStorage gespeichert.

**Korrektur:**  
Beim Laden der Daten wurden Fehlerbehandlungen eingebaut, falls gespeicherte Daten ungültig sein sollten.

**Gelernt:**  
Ich habe verstanden, wie JSON-Daten im LocalStorage gespeichert und beim Start der App wieder geladen werden.


## 14. README und Dokumentation

**Prompt:**  
Ich habe die KI gebeten, das ursprüngliche Aufgaben-README durch eine Dokumentation meiner eigenen App zu ersetzen.

**Ergebnis:**  
Das README beschreibt jetzt:

- Zweck der App
- Funktionen
- Ansichten
- verwendete Technologien
- Installation
- Start der App
- lokale Speicherung
- Projektstruktur
- Einsatz von KI

**Korrektur:**  
Der ursprüngliche Platzhaltertext aus der Aufgabenstellung wurde entfernt.

**Gelernt:**  
Ich habe verstanden, dass ein README nicht nur für die Bewertung wichtig ist, sondern auch erklärt, wie ein Projekt installiert und verwendet wird.


## Rückblick auf den KI-Einsatz

Die KI hat mich vor allem bei Planung, Codevorschlägen und Fehlersuche unterstützt.

Ich habe die Ergebnisse aber nicht einfach unverändert übernommen. Während der Entwicklung habe ich mehrmals Änderungen verlangt, wenn Funktionen nicht sinnvoll waren, das Design nicht gepasst hat oder Fehler aufgetreten sind.

Besonders wichtig war die Fehlersuche über die Browser-Konsole. Dadurch konnte ich nachvollziehen, warum die App teilweise nicht mehr geladen wurde.

Ich habe durch das Projekt besser verstanden, wie Vue Views, Komponenten, Router, Pinia Stores, Formulare und LocalStorage zusammenspielen.

Einige grössere Erweiterungen wie echte Matchdaten über eine API, eine komplette Aufstellung oder Live-Match-Events habe ich bewusst nicht mehr umgesetzt, weil zuerst der geforderte Umfang der Modulaufgabe stabil fertiggestellt werden sollte.
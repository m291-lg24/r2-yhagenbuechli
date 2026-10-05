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

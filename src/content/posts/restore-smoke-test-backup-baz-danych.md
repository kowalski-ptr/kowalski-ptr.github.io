---
title: "Restore-smoke: dlaczego sam backup bazy danych to za mało"
description: "Codzienny backup daje fałszywe poczucie bezpieczeństwa, dopóki nikt nie sprawdził, czy da się z niego faktycznie odtworzyć bazę. Wyjaśnienie, czym jest automatyczny restore-smoke test i dlaczego warto go mieć zanim zaufasz produkcyjnym danym."
category: "Infra"
tags: ["backup", "postgresql", "devops", "database", "reliability", "disaster-recovery", "lang:pl"]
date: 2026-07-08
draft: false
---

# Restore-smoke: dlaczego sam backup bazy danych to za mało

## Sam backup to obietnica, nie gwarancja

Wyobraź sobie prosty scenariusz: co noc o ustalonej porze skrypt robi dump bazy danych — plik `.dump` ląduje na dysku, waży swoje, i masz poczucie bezpieczeństwa. Backup jest, więc jesteś zabezpieczony.

Problem w tym, że to poczucie jest fałszywe, dopóki nikt z tego pliku faktycznie nie odtworzył bazy.

Plik dumpu może być:

- **ucięty** — dysk zapełnił się w połowie procesu,
- **skorumpowany** — błąd I/O albo zły format zapisu,
- **nieodtwarzalny dla konkretnego silnika** — niektóre rozszerzenia bazodanowe (np. TimescaleDB dla danych czasowych) wymagają specjalnej procedury restore (`pre_restore` → `pg_restore` → `post_restore`), i jeśli coś się zmieni po aktualizacji wersji, zwykły restore po prostu się wywali,
- **pusty semantycznie** — proces backupu zakończył się sukcesem, ale np. wziął dane z niewłaściwej bazy albo z pustej tabeli.

Żadnej z tych rzeczy nie wykryjesz, patrząc na sam plik na dysku. Wykryjesz je dopiero w momencie, w którym próbujesz odtworzyć — a to zwykle jest najgorszy możliwy moment: baza produkcyjna właśnie padła i pod presją czasu odkrywasz, że backup jest bezużyteczny.

To zjawisko ma nawet swoją nazwę w branży: **"Schrödinger backup"**. Dopóki nie otworzysz pudełka i nie sprawdzisz, backup jest jednocześnie żywy i martwy. Nie wiesz, który — dopóki nie sprawdzisz.

## Co robi restore-smoke test

"Smoke test" to termin z inżynierii sprzętu — włącz urządzenie i zobacz, czy z niego nie dymi, zanim zaczniesz szczegółowe testy. W kontekście backupów oznacza to samo: prosty, automatyczny test, który sprawdza, czy backup w ogóle *da się* odtworzyć, bez wchodzenia w szczegóły każdego rekordu.

Typowy skrypt restore-smoke, uruchamiany cyklicznie, robi coś takiego:

1. **Bierze najnowszy dump** z katalogu backupów.
2. **Tworzy tymczasową bazę** o osobnej nazwie (np. `appdb_smoke_<timestamp>`) — nie dotyka bazy produkcyjnej.
3. **Odtwarza do niej dump** pełną procedurą właściwą dla danego silnika bazy (w tym ewentualne kroki pre/post-restore wymagane przez rozszerzenia).
4. **Weryfikuje, że schemat naprawdę wrócił** — np. sprawdza, czy istnieje wpis w tabeli wersji migracji (`alembic_version` lub odpowiednik) i czy w bazie jest sensowna liczba tabel.
5. **Kasuje bazę tymczasową** — najlepiej przez mechanizm `trap`, żeby nawet jeśli coś padnie w trakcie testu, nie zostały śmieci na dysku.

Wynik działania jest binarny: albo dostajesz komunikat w stylu `OK restore-smoke: migracja=0015, tabel=18` (zielono), albo proces kończy się błędem i systemowy scheduler (np. systemd) oznacza usługę jako `failed` — co widać od razu w standardowym monitoringu (`systemctl --failed` albo odpowiednik).

## Jakie korzyści to realnie daje

**Wczesny alarm.** Dowiadujesz się, że backup jest zepsuty, w spokojny dzień z automatu — a nie w środku prawdziwej awarii produkcji. Masz czas, żeby to naprawić, zanim będzie to potrzebne.

**Wykrywa ciche regresje.** Aktualizacja wersji silnika bazy danych albo jego rozszerzeń może subtelnie zmienić zachowanie procedury restore. Bez smoke testu dowiedziałbyś się o tym dopiero przy realnym odtwarzaniu — czyli za późno. Restore-smoke łapie taką regresję automatycznie, przy najbliższym cyklu testowym.

**Zamienia "ufam, że działa" w "mam na to dowód".** Jednorazowy ręczny test przywracania bazy udowadnia, że dana kopia w danym momencie się odtworzyła. Nie mówi nic o kopii sprzed tygodnia ani o tej, która powstanie jutro. Automatyzacja zamienia jednorazowy fakt w powtarzalny proces.

**To twardy warunek przed podłączeniem realnych, kosztownych danych.** Jeśli system ma zacząć przyjmować dane, których pozyskanie jest jednorazowe albo kosztowne (np. historyczne dane rynkowe kupowane u zewnętrznego dostawcy, dane z długotrwałego eksperymentu, importy, których nie da się łatwo powtórzyć), to zanim to zrobisz, chcesz mieć pewność, że w razie awarii faktycznie wrócisz do stanu sprzed niej. Bez działającego, zweryfikowanego restore backup jest tylko teatrem bezpieczeństwa.

## Dlaczego cyklicznie, a nie za każdym razem

Backup jest relatywnie lekką operacją (sam dump) i zwykle robi się go codziennie. Restore jest znacznie cięższy — tworzy nową bazę i odtwarza do niej cały zestaw danych — więc uruchamianie go raz w tygodniu (najlepiej zaraz po najświeższym backupie) w zupełności wystarcza, żeby wcześnie łapać regresje, bez codziennego obciążania serwera. Zawsze można też odpalić test ręcznie, kiedy pojawi się konkretny powód do sprawdzenia (np. tuż po aktualizacji wersji bazy danych).

## Praktyczna pułapka: kiedy "zielono" kłamie

To nie jest teoria — to realny przypadek z wdrożenia takiego testu, który dobrze pokazuje, że sam pomysł restore-smoke to dopiero połowa roboty. Druga połowa to zaprojektowanie właściwych asercji, bo źle zaprojektowany test potrafi dać fałszywe poczucie bezpieczeństwa dokładnie tego samego rodzaju, przed którym miał chronić.

### Luka nr 1: próg liczby tabel może być za słaby

Pierwsza wersja testu sprawdzała tylko, czy w odtworzonej bazie istnieje jakakolwiek sensowna liczba tabel — próg ustawiony nisko, w stylu "przynajmniej jedna". Wydawało się to wystarczające, dopóki ktoś nie zwrócił uwagi na mechanizm formatu dumpu `pg_restore` w trybie custom (`-Fc`): struktura bazy — definicje tabel, wpis w tabeli wersji migracji — odtwarza się na samym początku procesu, jeszcze **zanim** zacznie się odtwarzanie właściwych danych.

To oznacza, że **dump ucięty w trakcie zapisywania danych** — bo backup padł w połowie, dysk się zapełnił, albo proces został przerwany — i tak odtworzy pełny, poprawny schemat ze wszystkimi tabelami. Test, który liczy tylko tabele, zobaczy komplet i zaraportuje sukces, mimo że wszystkie tabele w środku są puste.

Dla systemu, w którym określone dane wpadają do bazy tylko raz — np. zaimportowany, kosztowny zestaw historyczny, którego nie da się łatwo pozyskać ponownie — to jest różnica między "mam pełny plan awaryjny" a "mam plan awaryjny, który w razie prawdziwej awarii odda mi pustą bazę z ładnym zielonym komunikatem".

**Poprawka:** podnieść próg liczby tabel do rzeczywistej, znanej wartości oczekiwanej w schemacie (nie "≥1", tylko konkretna liczba), dodać weryfikację integralności spisu treści dumpu (`pg_restore -l` — sprawdzenie, że w archiwum faktycznie są wszystkie sekcje z danymi, a nie tylko sekcja struktury), oraz dodać asercję na realną liczbę wierszy w reprezentatywnej, dużej tabeli — nie samą jej obecność, tylko potwierdzenie, że ma sensowną ilość danych powyżej ustalonego progu.

### Luka nr 2: cicha bramka

Drugi problem był bardziej organizacyjny niż techniczny: porażka testu restore-smoke była widoczna wyłącznie przez ręczne sprawdzenie stanu usług systemowych (np. `systemctl --failed`) — a nikt regularnie tego nie sprawdza z własnej inicjatywy. Test może faktycznie wykryć zepsuty backup, ale jeśli informacja o tym nie dotrze aktywnie do człowieka, cała wartość automatyzacji się rozmywa.

**Poprawka:** dopiąć tani, prosty alert — webhook, e-mail, wiadomość na czacie zespołowym — wyzwalany automatycznie przy porażce testu. Czerwony wynik ma generować powiadomienie, a nie czekać biernie, aż ktoś przypadkiem zajrzy do logów.

### Luka nr 3: zmiana roli w trakcie restore łamie prawa własności rozszerzenia

Trzeci, najbardziej podchwytliwy przypadek: `pg_restore` wywołany z flagą zmieniającą rolę (`--role=appuser`) wykonuje w tle odpowiednik `SET ROLE appuser` przed odtwarzaniem obiektów. Jeśli `appuser` to zwykły użytkownik aplikacji, a nie superuser, a baza korzysta z rozszerzenia takiego jak TimescaleDB, to odtwarzanie realnych danych czasowych wymaga tworzenia tzw. chunków w wewnętrznym schemacie rozszerzenia — a to prawo ma wyłącznie właściciel rozszerzenia, zwykle superuser.

Efekt: restore kończy się błędem typu "permission denied for schema..." albo "must be owner of extension" — ale **tylko wtedy, gdy w dumpie faktycznie jest coś do odtworzenia**. Na pustej albo bardzo małej testowej bazie, bez żadnych chunków do utworzenia, dokładnie ten sam restore przechodzi bez żadnego błędu, bo nie ma nic, czego brakujące uprawnienie mogłoby dotyczyć. Test wygląda na zielony — dopóki nie odpali się go na prawdziwym, dużym dumpie produkcyjnym, gdzie danych (a więc i chunków do utworzenia) jest już naprawdę dużo.

**Poprawka:** odtwarzać jako superuser, bez przełączania roli, zachowując ownership obiektów dokładnie taki, jaki był zapisany w dumpie. I — co ważniejsze — nie ograniczać testów restore wyłącznie do okrojonych albo pustych próbek. Realny test musi choć raz przejść na dumpie o rozmiarze i strukturze zbliżonej do produkcyjnej, bo dopiero tam ujawniają się błędy związane z uprawnieniami do obiektów specyficznych dla rozszerzeń.

### Wniosek z tej pułapki

Sam fakt posiadania restore-smoke testu nie wystarczy — trzeba też zadać sobie pytanie, **co dokładnie ten test sprawdza, a czego nie sprawdza, i na jakich danych go w ogóle uruchamiasz**. Test weryfikujący wyłącznie strukturę (schemat, liczbę tabel) na pustej albo małej próbce może dać fałszywe poczucie bezpieczeństwa: zielony status, który nie oznacza tego, co myślisz, że oznacza.

Praktyczna zasada na wynos, w trzech punktach:
1. Asercje w teście przywracania powinny sprawdzać **dane, nie tylko strukturę** — konkretną liczbę wierszy w kluczowych tabelach, a nie samą ich obecność.
2. Test trzeba choć raz przepuścić na **realnym, dużym dumpie**, nie tylko na okrojonej próbce — niektóre błędy (jak uprawnienia do rozszerzeń) ujawniają się wyłącznie wtedy, gdy jest co odtwarzać.
3. Wynik testu musi trafiać do kogoś **aktywnie**, nie tylko czekać biernie w logach.

## Podsumowanie

Restore-smoke to najprostsza możliwa forma testu przywracania: nie sprawdza spójności każdego rekordu, tylko odpowiada na jedno pytanie — *czy ten backup w ogóle da się odtworzyć do działającej bazy?* To pytanie brzmi banalnie, dopóki nie zdarzy się, że odpowiedź brzmi "nie" — a wtedy najlepiej, żeby dowiedzieć się o tym w spokojny dzień, a nie w środku prawdziwej awarii.

**Analogia jednym zdaniem:** to jak próbny alarm pożarowy — nie czekasz na prawdziwy pożar, żeby sprawdzić, czy syrena działa. Raz w tygodniu odpalasz ją "na sucho" i wiesz, że zadziała, gdy będzie naprawdę potrzebna.

---
tile: "Parametr -u w komendzie 'git push origin main'"
description: "Parametr -u w komendzie 'git push origin main'"
category: "Git"
tags: ["push", "lang:pl"]
date: 2026-06-19
draft: false
---

# 'git push origin main' vs 'git push -u origin main'

## Różnica to flaga -u (skrót od --set-upstream). 

Robi jedną dodatkową rzecz: zapamiętuje powiązanie lokalnej gałęzi main ze zdalną origin/main (tzw. upstream tracking).

- git push origin main — wypycha main do origin, ale nie zapisuje trwałego powiązania. Działa za każdym razem, ale musisz podawać origin main jawnie.
- git push -u origin main — wypycha i ustawia upstream. Od tej chwili sama gałąź „wie", dokąd należy. Skutki na przyszłość:
- możesz pisać samo git push / git pull (bez origin main),
- git status pokazuje ahead/behind względem origin/main (to, co przed chwilą widzieliśmy: „do przodu 1" — działa, bo upstream już jest ustawiony),
- git branch -vv pokaże [origin/main] przy gałęzi.

Praktyka: -u używasz raz, przy pierwszym pushu nowej gałęzi. Potem jest zbędne (powiązanie już istnieje) — wystarczy git push. 

Gdy main już ma upstream (status pokazywał ahead/behind), więc potem git push origin main i git push zrobią dokładnie to samo. -u nic nie zepsuje, po prostu nic nowego nie wniesie.

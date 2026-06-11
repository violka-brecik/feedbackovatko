# Feedbackovátko — rychlý návod

Nástroj pro komentování webových stránek přímo v prohlížeči. Žádná instalace, funguje okamžitě.

---

## Základní ovládání

Po otevření stránky uvidíš v pravém dolním rohu lištu se dvěma tlačítky:

| Tlačítko | Co dělá |
|----------|---------|
| **👁 Skrýt / Zobrazit** | Skryje nebo zobrazí všechny piny na stránce |
| **+ Komentovat** | Zapne režim přidávání komentářů |

---

## Jak přidat komentář

1. Klikni na **+ Komentovat** — kurzor se změní na fialový pin
2. Klikni na místo nebo prvek na stránce, který chceš okomentovat
3. Pokud ještě nemáš zadané jméno, nástroj se tě na něj zeptá
4. Napiš komentář a odešli ho tlačítkem **Odeslat ↵** nebo klávesou **Enter**
5. Pin se zobrazí na stránce, komentářový režim zůstane aktivní pro další komentář
6. Komentářový režim ukončíš klávesou **Escape** nebo druhým kliknutím na **+ Komentovat**

---

## Práce s komentáři

Klikni na libovolný pin pro zobrazení komentáře. V bublině můžeš:

- **👍** — přidat like
- **Odpovědět** — napsat odpověď (odeslání Enterem nebo tlačítkem)
- **Vyřešit** — označit komentář jako vyřešený (pin zmizí ze stránky)
- **✎** — upravit vlastní komentář (zobrazí se jen u tvých komentářů)

Bublinu zavřeš kliknutím kamkoliv mimo ni.

---

## Autor mode

Autor mode odemkne rozšířenou lištu s nástroji pro správu feedbacku. Slouží pro toho, kdo stránku připravil a chce komentáře zpracovat.

**Jak zapnout:** Přidej do URL parametr `?author=viola2026`
Například: `https://mujweb.cz/stranka?author=viola2026`

V liště se zobrazí dvě tlačítka navíc:

| Tlačítko | Co dělá |
|----------|---------|
| **✦ Odeslat Claudovi** | Zkopíruje všechny aktivní komentáře do schránky ve formátu pro Claude Code. Po vložení do Claude Code (`Cmd+V`) dostaneš strukturovaný přehled feedbacku připravený k řešení. |
| **Archivovat** | Označí všechny aktuální komentáře jako archivované — zmizí z pohledu. Slouží k „vynulování" stránky po tom, co byl feedback zpracován. |

**Odeslat Claudovi + archivovat zároveň:** Při kliknutí na **✦ Odeslat Claudovi** se zobrazí volba, jestli chceš komentáře zároveň archivovat. Praktické po každém review cyklu.

---

## Změna jména

Jméno se uloží do prohlížeče a používá se pro všechny komentáře. Pokud ho chceš změnit:

1. Otevři DevTools (`Cmd+Option+I` na Macu, `F12` na Windows)
2. Záložka **Console**
3. Napiš ručně `allow pasting` a stiskni Enter
4. Vlož a potvrď:
```
localStorage.setItem('fbt_username', 'NovéJméno')
```
5. Obnov stránku

---

## Tipy

- Piny jsou viditelné pro všechny, kdo mají stránku otevřenou — komentáře se synchronizují v reálném čase
- Každá stránka má své vlastní komentáře (`/nabijecka.html` a `/kalkulator.html` jsou oddělené)
- Vyřešené komentáře zmizí z pohledu, ale nejsou smazané
- Pokud pin „visí ve vzduchu" (prvek pod ním byl odstraněn), zobrazí se šedě s upozorněním

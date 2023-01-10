# Changelog

Tutte le modifiche importanti a questo progetto saranno documentate in questo file.

Il formato si basa su [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## Fixed

- Il paginator non funziona in presenza del numero zero

## [12.3.0] - 2021-07-26

### Added

- Aggiunto il metodo `DataTableService.setFilterMapper` per trasformare i dati inseriti nel filtro di un `DataTable`

### Modified

- Aggiunta la possibilità di utilizzare una espressione json_logic per il parametro `data.url` di un `DataTable`

### Fixed

- La traduzione delle intestazioni su `DataTable` si perde in modalità verticale (ie. risoluzioni tablet)
- Tooltip sui pulsanti di `DataTable` in presenza di `buttonGroup`

## [12.2.2] - 2021-07-21

### Added

- DataTable: Aggiunto l'attributo booleano `data.pagination.showFirstLastButtons` per mostrare i pulsanti Prima e Ultima Pagina

### Modified

- DatePicker: Rimossa la seconda etichetta sotto al campo che compariva quando la label aveva una lunghezza superiore ai 30 caratteri

### Fixed

- DataTable: Aggiunta la traduzione alle intestazioni
- DataTable: Aggiunta la traduzione ai pulsanti
- DataTable: Aggiunta la traduzione ai messaggi
- PublicApi: Riordinati gli export per evitare messaggi di warning durante la build

## [12.2.1] - 2021-07-20

### Fixed

- Aggiunto "default" e "" ai valori possibili per IFormButton.color e IFormButton.style

## [12.2.0] - 2021-07-20

### Added

- Aggiunta la possibilità di utilizzare HTML come contenuto delle celle, anche attraverso renderer
- Aggiunta la possibilità di inserire un menu a comparsa invece dei singoli pulsanti all'interno di una cella
- Aggiunto un secondo parametro contenente l'intera riga alla callback renderer delle celle di un datatable
- Aggiunta la possibilità di utilizzare pulsanti con stili diversi (basic, raised, stroked, flat o icon) all'interno delle celle di un datatable.
- Aggiunta interfaccia IFormData

## [12.1.1] - 2021-07-16

### Added

- Aggiunta la possibilità di mostrare o nascondere le colonne di una tabella in base a una JSON_LOGIC

## [12.1.0] - 2021-07-16

### Added

- Implementato metodo ConditionalService.applyAllJsonRules();

## [12.0.9] - 2021-07-08

### Added

- Aggiunto uploadResponseId come Il nome della proprietà che, nella risposta all'upload, conterrà l'ID del file caricato (default: objectId)

## [12.0.8] - 2021-07-05

### Fixed

- ComboService.setList funzionava solo con dataSrc: resource, adesso funziona per qualsiasi valore di dataSrc.

## [12.0.7] - 2021-07-02

### Added

- Aggiunto getter per DataTableComponent in DataTableService

### Fixed

- Risolto problema che impediva la visualizzazione di DataTable in mancanza di righe

## [12.0.6] - 2021-07-02

### Fixed

- Risolto problema che impediva la visualizzazione di DataTable in mancanza di una paginazione

## [12.0.5] - 2021-07-01

### Added

- Aggiunta la possibilità di settare dati paginati in runtime a un datatable

## [12.0.4] - 2021-07-01

### Added

- Aggiunto export per ElementWrapper

### Fixed

- Ripristinato ReadOnlyTradComponent

## [12.0.3] - 2021-06-23

### Fixed

-  Risolto bug che impediva il corretto funzionamento delle traduzioni quando usato in un modulo con lazy load

## [12.0.2] - 2021-06-17

### Modified

-  Ordinati import moduli
-  Rimosso ReactiveFormsModule dagli imports

## [12.0.1] - 2021-06-15

### Added

- Aggiunto enum IFormElementType

### Fixed

- Fix bug ripetibili

### Modified

-  Rimosso elemento codeEditor

## [12.0.0] - 2021-05-25

### Modified

- Aggiornate tutte le dipendenze ad Angular 12

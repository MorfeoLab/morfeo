## ![Morfeo](./assets/images/morfeo.logo.svg?raw=true "Morfeo Logo")

/**
* Example of usage:
* <example-url>http://localhost/demo/mysample.component.html</example-url>
* <example-url>/demo/mysample.component.html</example-url>
  */

# Cosa è Morfeo?

Morfeo è una libreria npm per la creazione e al gestione dei form in un applicativo Angular Material.

# Operazioni preliminari

La libreria si trova sul registry Nexus aziendale, prima di provare a installarlo occorre assicurarsi
di aver configurato a dovere npm.

## Impostare il Registry

Prima di poter installare occorre impostare Nexus come registry predefinito per tutte le librerie con prefisso @eng/

```bash
npm config set @eng:registry https://production.eng.it/nexus/repository/npm-private/
```


## Autenticazione

Per poter installare dal Registry aziendale occorre autenticarsi utilizzando le proprie credenziali LDAP, questo
passaggio è necessario soltanto la prima volta.

```bash
npm login --registry=https://production.eng.it/nexus/repository/npm-private/ --scope=@eng
```


## Installazione

Installare con npm

```bash
$ npm install --save @eng/morfeo
```


## Installare le dipendenze

Angular non installa più le Peer Dependencies, quindi occorre installare manualmente le dipendenze se
non ancora disponibili

```bash
$ npm install --save @angular/cdk @angular/material json-logic-js moment @angular/material-moment-adapter @ngx-translate/core @ngx-translate/http-loader
```


## Inserire il form all'interno del template

Una volta installato sarà sufficiente utilizzare il componente all'interno dei template dell'applicazione Angular:

```html
<mrf-form [form]="formJson"></mrf-form>
```


La variabile formJson deve essere pubblica e contenere un JSON descrittivo del form.

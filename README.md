## ![Morfeo](./assets/images/morfeo.logo.svg?raw=true "Morfeo Logo")

Libreria npm per la gestione dei form in un applicativo Angular Material.

Operazioni preliminari
La libreria si trova sul registry Nexus aziendale, prima di provare a installarlo occorre assicurarsi di aver configurato a dovere npm:

Impostare Nexus come registry predefinito per tutte le librerie con prefisso @eng/

npm config set @eng:registry https://production.eng.it/nexus/repository/npm-private/
Autenticazione (utilizzare le proprie credenziali LDAP)

npm login --registry=https://production.eng.it/nexus/repository/npm-private/ --scope=@eng
Installazione
Installare con npm

$ npm install --save @eng/morfeo
Installare le dipendenze

$ npm install --save @angular/cdk @angular/material json-logic-js moment @angular/material-moment-adapter @ngx-translate/core @ngx-translate/http-loader
Inserire il form all'interno del template

<app-eng-dynamic-form [form]="formJson"></app-eng-dynamic-form>
La variabile formJson deve essere pubblica e contenere un JSON descrittivo del form
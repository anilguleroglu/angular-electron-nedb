import { Injectable } from '@angular/core';



// import * as Datastore from 'nedb-promises';

const Datastore = require('nedb-promises');

import { ElectronService } from './electron/electron.service';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    static tables: any = {};

    get isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }

    constructor(private electronService: ElectronService) {

    }
    init() {
        DatabaseService.tables['forms'] = Datastore.create(
            {
                filename: this.electronService.remote.app.getAppPath() + 'forms.db',
                autoload: true,
                timestampData: true
            });
    }

    table(tbl): any {
        return (<any>DatabaseService.tables[tbl]);
    }

}

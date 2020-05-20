import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

import * as Datastore from 'nedb';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  static online = false;
  onChangeStatus = new EventEmitter();
  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  isOnline() {
    return navigator.onLine;
  }

  startCheckConnection() {
    setInterval(() => {
      if (!this.isOnline() && ElectronService.online) {
        ElectronService.online = false;
        this.onChangeStatus.emit('offline');
      } else {
        if (navigator.onLine && !ElectronService.online) {
          ElectronService.online = true;
          this.onChangeStatus.emit('online');
        }
      }
    }, 100)
  }
}

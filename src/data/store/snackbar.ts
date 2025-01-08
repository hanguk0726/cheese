import { SnackbarSeverity } from '@/model/app';
import { makeAutoObservable } from 'mobx';

class SnackbarStore {
  open: boolean = false;
  message: string = '';
  severity = SnackbarSeverity.Info;

  constructor() {
    makeAutoObservable(this);
  }

  showSnackbar(message: string, severity: SnackbarSeverity = SnackbarSeverity.Info) {
    this.message = message;
    this.severity = severity;
    this.open = true;
  }

  closeSnackbar() {
    this.open = false;
  }
}


const snackbarStore = new SnackbarStore();
export default snackbarStore;

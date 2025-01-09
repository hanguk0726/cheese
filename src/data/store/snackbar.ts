import { SnackbarSeverity } from '@/model/app';
import { makeAutoObservable, runInAction } from 'mobx';

class SnackbarStore {
  open: boolean = false;
  message: string = '';
  severity = SnackbarSeverity.Info;

  constructor() {
    makeAutoObservable(this);
  }

  showSnackbar(message: string, severity: SnackbarSeverity = SnackbarSeverity.Info) {
    runInAction(() => {
      this.message = message;
      this.severity = severity;
      this.open = true;
    })
  }

  closeSnackbar() {
    runInAction(() => {
      this.open = false;
    })
  }
}


const snackbarStore = new SnackbarStore();
export default snackbarStore;

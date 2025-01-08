import { makeAutoObservable } from 'mobx';

class AppStore {

    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }


}

const appStore = new AppStore();

export default appStore;

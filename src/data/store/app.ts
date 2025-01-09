import { RecordType } from '@/model/app';
import { makeAutoObservable } from 'mobx';

class AppStore {

    isLoading: boolean = false;
    recordType: RecordType = RecordType.Chart;

    constructor() {
        makeAutoObservable(this);
    }

    setLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    setRecordType(recordType: RecordType) {
        this.recordType = recordType;
    }

}

const appStore = new AppStore();

export default appStore;

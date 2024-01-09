import StateManager from '@/store';
import StoreManager from '@/store/store';

const stateManager = new StateManager();
const store = StoreManager.getInstance();

export {  stateManager, store };

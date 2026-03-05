import { Routes } from '@angular/router';
import { InventoryPage } from './pages/inventory-page/inventory-page';
import { InventoryCreate } from './components/inventory-create/inventory-create';
import { InventoryDetails } from './components/inventory-details/inventory-details';
import { ItemDetails } from './components/item-details/item-details';
import { ItemsList } from './components/items-list/items-list';

export const InventoryRoutes: Routes = [
    { path: '', component: InventoryPage },
    { path: 'create', component: InventoryCreate },
    { path: ':id/edit', component: InventoryCreate },
    { path: ':id/details', component: InventoryDetails },
    { path: ':id/item', component: ItemDetails },
];
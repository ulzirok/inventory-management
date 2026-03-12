import { Routes } from '@angular/router';
import { InventoryPage } from './pages/inventory-page/inventory-page';
import { InventoryCreate } from './pages/inventory-create/inventory-create';
import { InventoryDetails } from './pages/inventory-details/inventory-details';
import { ItemDetails } from './components/item-details/item-details';
import { InventorySharedItems } from './pages/inventory-shared-items/inventory-shared-items';
import { InventorySharedChat } from './pages/inventory-shared-chat/inventory-shared-chat';

export const InventoryRoutes: Routes = [
    { path: '', component: InventoryPage },
    { path: 'create', component: InventoryCreate },
    { path: ':id/edit', component: InventoryCreate },
    { path: ':id/details', component: InventoryDetails },
    { path: ':id/item', component: ItemDetails },
    { path: ':id/items', component: InventorySharedItems },
    { path: ':id/chat', component: InventorySharedChat },
];
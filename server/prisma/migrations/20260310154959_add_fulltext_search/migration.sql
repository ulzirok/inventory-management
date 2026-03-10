CREATE OR REPLACE VIEW inventory_search_v AS
SELECT 
    i.id AS inventory_id,
    setweight(to_tsvector('simple', coalesce(i.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(i.description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(string_agg(DISTINCT t.name, ' '), '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(string_agg(DISTINCT itm.string_1, ' '), '')), 'C') AS document
FROM "Inventory" i
LEFT JOIN "_InventoryTags" it ON it."A" = i.id
LEFT JOIN "Tag" t ON t.id = it."B"
LEFT JOIN "Item" itm ON itm."inventoryId" = i.id
GROUP BY i.id;

CREATE INDEX IF NOT EXISTS idx_inventory_title_desc_fts ON "Inventory" USING GIN (to_tsvector('simple', title || ' ' || description));

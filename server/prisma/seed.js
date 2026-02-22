const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = [
        'Books & Publications',
        'Equipment & Machinery',
        'Electronics & Devices',
        'Furniture',
        'Tools & Instruments',
        'Documents & Archives',
        'Vehicles',
        'Software & Licenses',
        'Medical Supplies',
        'Office Supplies',
        'Industrial Materials',
        'Personal Items',
        'Collectibles',
        'Other'
    ];

    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log('Categories seeded successfully.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());

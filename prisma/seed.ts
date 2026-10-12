import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de dados...');

  // Usuário padrão
  const user = await prisma.user.upsert({
    where: { email: 'cliente@teste.com' },
    update: {},
    create: {
      email: 'cliente@teste.com',
      passwordHash: '$2b$10$wTqKjJ5h.0J9.H/aU6l/dOfqQYtGzJb4hA.X5M6kE5t2aKz1WJ3tq', // hash de exemplo
      role: 'CUSTOMER'
    }
  });

  console.log(`Usuário criado/verificado: ${user.email}`);

  // Produtos para o catálogo
  const produtos = [
    { name: 'Notebook Gamer Pro', sku: 'NOTE-001', price: 4999.90, stock: 15 },
    { name: 'Mouse Sem Fio Ergonômico', sku: 'MOU-002', price: 149.50, stock: 50 },
    { name: 'Teclado Mecânico RGB', sku: 'TEC-003', price: 329.00, stock: 30 },
    { name: 'Monitor 27 Polegadas 144Hz', sku: 'MON-004', price: 1299.00, stock: 20 },
    { name: 'Headset Surround 7.1', sku: 'HEAD-005', price: 259.90, stock: 40 }
  ];

  for (const item of produtos) {
    const p = await prisma.product.upsert({
      where: { sku: item.sku },
      update: {
        price: item.price,
        stock: item.stock
      },
      create: {
        name: item.name,
        sku: item.sku,
        price: item.price,
        stock: item.stock
      }
    });
    console.log(`Produto catalogado: ${p.name} (${p.sku})`);
  }

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

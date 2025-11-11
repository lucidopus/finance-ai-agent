import { getDatabase } from '../lib/mongodb';

async function updateCustomerAssignments() {
  try {
    const db = await getDatabase();
    const customersCollection = db.collection('customers');

    // Update all customers assigned to sarah.chen@bank.com to harshil@gmail.com
    const result = await customersCollection.updateMany(
      { assignedTo: 'sarah.chen@bank.com' },
      {
        $set: {
          assignedTo: 'harshil@gmail.com',
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} customers to be assigned to harshil@gmail.com`);
  } catch (error) {
    console.error('Error updating customer assignments:', error);
  }
}

updateCustomerAssignments()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });